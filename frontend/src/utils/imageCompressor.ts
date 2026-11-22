/**
 * Utility untuk mengompresi gambar di sisi klien (browser) menggunakan HTML5 Canvas.
 * Menghasilkan gambar yang tetap tajam (Full HD, resolusi maks 1400px) dengan ukuran file
 * yang tereduksi drastis (biasanya 150 KB - 350 KB, aman di bawah limit 768 KB / SOP).
 */
export async function compressImage(
  file: File,
  maxDimension = 1400,
  initialQuality = 0.82,
  targetMaxKb = 700
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      reject(new Error("Format file harus berupa JPG, JPEG, atau PNG."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar ke canvas."));
      img.onload = () => {
        let { width, height } = img;

        // Hitung aspect ratio dan sesuaikan ukuran jika melebihi batas maksimal
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          // Fallback jika canvas 2d context tidak tersedia
          resolve(event.target?.result as string);
          return;
        }

        // Gambar ulang di canvas
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi pertama dengan initialQuality
        let quality = initialQuality;
        let base64 = canvas.toDataURL("image/jpeg", quality);

        // Cek ukuran hasil base64 (dalam KB)
        const calculateKb = (b64: string) => Math.round((b64.length * 3) / 4 / 1024);

        // Jika masih lebih besar dari targetMaxKb, turunkan kualitas bertahap
        let iterations = 0;
        while (calculateKb(base64) > targetMaxKb && quality > 0.5 && iterations < 4) {
          quality -= 0.1;
          base64 = canvas.toDataURL("image/jpeg", quality);
          iterations++;
        }

        resolve(base64);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
