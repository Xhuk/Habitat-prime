// FIX: This file was empty. Created image processing utility.

const MAX_WIDTH = 256;
const MAX_HEIGHT = 256;
const JPEG_QUALITY = 0.8;

export const processImageForAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            if (!event.target?.result) {
                return reject(new Error('Could not read file'));
            }
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
