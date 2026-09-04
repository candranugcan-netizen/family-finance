export interface Asset {
  id: string;
  name: string;
  category: string;
  units: number;
  avg_buy_price: number;
  current_price: number;
  realized_gain: number;
}

// Data yang dibutuhkan saat tambah aset baru
export interface CreateAssetInput {
  name: string;
  category: string;
  units: number;
  avg_buy_price: number;
  current_price: number;
}