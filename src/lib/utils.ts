import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Resizer from "react-image-file-resizer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// check if value is a key, given an object
export function isKeyOf<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}

/**
 * Resizes an image file.
 *
 * @param {File} file - The input image file to be resized.
 * @returns {Promise<any>} A promise that resolves with the resized image URI (base64-encoded).
 */
export function resizeImageFile(file: File): Promise<any> {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600, // Desired width
      600, // Desired height
      "png", // Output format
      100, // Image quality (0 to 100)
      0, // Rotation angle (in degrees)
      (uri) => {
        resolve(uri);
      },
      "file" // Encoding type: base64 | blob | file.
    );
  });
}

// check two arrays for equality
export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
