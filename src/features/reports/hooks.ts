import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';

export function useCurrentMonthCashFlow() {
  return useQuery({
    queryKey: ['cashflow', 'current-month'],
    queryFn: async () => {
      const supabase = createClient();
      const now = new Date();
      // Ambil tanggal 1 sampai akhir bulan ini dalam format ISO untuk query ke database
      const start = formatISO(startOfMonth(now));
      const end = formatISO(endOfMonth(now));

      const { data, error } = await supabase
        .from('transactions')
        .select('type, amount')
        .gte('date', start)
        .lte('date', end)
        .in('type', ['income', 'expense']); // Transfer tidak dihitung sbg arus kas

      if (error) throw error;

      let income = 0;
      let expense = 0;

      data?.forEach((tx) => {
        if (tx.type === 'income') income += tx.amount;
        if (tx.type === 'expense') expense += tx.amount;
      });

      return { income, expense, net: income - expense };
    },
  });
}


export function useExpenseByCategory() {
  return useQuery({
    queryKey: ['expense-by-category', 'current-month'],
    queryFn: async () => {
      const supabase = createClient();
      const now = new Date();
      const start = formatISO(startOfMonth(now));
      const end = formatISO(endOfMonth(now));

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, category:category_id(name)')
        .gte('date', start)
        .lte('date', end)
        .eq('type', 'expense');

      if (error) throw error;

      // Kelompokkan dan jumlahkan berdasarkan nama kategori
      const aggregated: Record<string, number> = {};
      data?.forEach((tx: any) => {
        const catName = tx.category?.name || 'Tanpa Kategori';
        aggregated[catName] = (aggregated[catName] || 0) + tx.amount;
      });

      // Format data agar bisa dibaca oleh Recharts (array of objects)
      return Object.entries(aggregated)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Urutkan dari pengeluaran terbesar
    },
  });
}