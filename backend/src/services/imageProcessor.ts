import sharp from "sharp";

function getDirectDownloadUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Google Drive
    if (urlObj.hostname.includes("drive.google.com")) {
      const matchFileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (matchFileId && matchFileId[1]) {
        return `https://drive.google.com/uc?export=download&id=${matchFileId[1]}`;
      }
      const fileIdParam = urlObj.searchParams.get("id");
      if (fileIdParam) {
        return `https://drive.google.com/uc?export=download&id=${fileIdParam}`;
      }
    }

    // Dropbox
    if (urlObj.hostname.includes("dropbox.com")) {
      urlObj.searchParams.set("dl", "1");
      return urlObj.toString();
    }

    // SharePoint sharing links (e.g. https://tenant.sharepoint.com/:i:/g/personal/user/token?e=...)
    if (urlObj.hostname.includes("sharepoint.com")) {
      const match = url.match(/https:\/\/([^/]+)\/(?::[a-z]:\/g\/)?personal\/([^/]+)\/([A-Za-z0-9_-]+)/);
      if (match) {
        const tenantHost = match[1];
        const personalUser = match[2];
        const token = match[3];
        return `https://${tenantHost}/personal/${personalUser}/_layouts/15/download.aspx?share=${token}`;
      }
      urlObj.searchParams.set("download", "1");
      return urlObj.toString();
    }

    // OneDrive / 1drv.ms
    if (
      urlObj.hostname.includes("1drv.ms") ||
      urlObj.hostname.includes("onedrive.live.com")
    ) {
      urlObj.searchParams.set("download", "1");
      return urlObj.toString();
    }

    return url;
  } catch (err) {
    return url;
  }
}

async function fetchWithRetry(url: string, options: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response; // Client error, don't retry
      }
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Fetch failed (attempt ${i + 1}/${retries}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error("Max retries reached");
}

export async function compressImageFromUrl(imageUrl: string): Promise<string> {
  const directUrl = getDirectDownloadUrl(imageUrl);
  
  const response = await fetchWithRetry(directUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download image from ${directUrl}. Status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());

  // Check if response is actually HTML text instead of an image
  const headerSample = buffer.toString("utf8", 0, 100).toLowerCase();
  if (contentType.includes("text/html") || headerSample.includes("<!doctype html") || headerSample.includes("<html")) {
    throw new Error("The image URL returned an HTML page instead of raw image data.");
  }

  const fileSizeMB = buffer.length / 1024 / 1024;

  // Same logic as frontend
  if (fileSizeMB < 1) {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }

  const quality = fileSizeMB >= 2 ? 60 : 80;

  const compressed = await sharp(buffer)
    .jpeg({
      quality,
    })
    .toBuffer();

  return `data:image/jpeg;base64,${compressed.toString("base64")}`;
}
