import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import currency from "currency.js";

// Utility untuk menggabungkan class Tailwind (mencegah bentrok)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility untuk format uang Rupiah (standar akuntansi)
export function formatRupiah(value: number | string) {
  return currency(value, {
    symbol: "Rp ",
    separator: ".",
    decimal: ",",
    precision: 0, // Tahap awal kita set 0, bisa diubah ke 2 jika butuh presisi desimal
  }).format();
}