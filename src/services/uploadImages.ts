export async function processImage(
  file: File,
  onProgress?: (progress: number) => void,
) {
  return new Promise<{
    imageBase64: string;
    mimeType: string;
  }>((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (!event.total) return;

      const progress = Math.round((event.loaded * 100) / event.total);

      onProgress?.(progress);
    };

    reader.onload = () => {
      const result = reader.result as string;

      resolve({
        imageBase64: result,
        mimeType: file.type,
      });
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
