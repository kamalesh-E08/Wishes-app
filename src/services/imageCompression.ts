export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const MAX_WIDTH = 1024;

      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;

        width = MAX_WIDTH;
        height = height * ratio;
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

      resolve(compressedBase64);
    };

    img.onerror = reject;

    img.src = URL.createObjectURL(file);
  });
}
