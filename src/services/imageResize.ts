export async function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const MAX_SIDE = 1000;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_SIDE) {
          height = Math.round(height * MAX_SIDE / width);
          width = MAX_SIDE;
        }
      } else {
        if (height > MAX_SIDE) {
          width = Math.round(width * MAX_SIDE / height);
          height = MAX_SIDE;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context not available'));
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Step down quality until under ~200 KB
      const MAX_SIZE = 200 * 1024;
      let quality = 0.7;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Basic size check: Base64 is approx 4/3 the size of the binary data
      // So byte size is roughly dataUrl.length * (3/4)
      while (dataUrl.length * 0.75 > MAX_SIZE && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}
