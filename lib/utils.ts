import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rengin açık mı koyu mu olduğunu kontrol eden fonksiyon
export function isLightColor(hexColor: string): boolean {
  // Hex renk kodunu RGB'ye dönüştür
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Rengin parlaklığını hesapla (YIQ formülü)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 128'den büyükse açık renk, değilse koyu renk
  return brightness > 128;
}
