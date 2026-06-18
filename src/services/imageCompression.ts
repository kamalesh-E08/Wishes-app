export async function compressImage(file: File): Promise<string> {
  const fileSizeMB = file.size / 1024 / 1024;

  if (fileSizeMB < 1) {
    return await fileToBase64(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Canvas Error");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const quality = fileSizeMB >= 2 ? 0.6 : 0.8;

        const compressed = canvas.toDataURL("image/jpeg", quality);

        resolve(compressed);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
