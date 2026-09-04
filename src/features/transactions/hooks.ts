// hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { CreateTransactionInput, TransactionRecord } from './types';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const supabase = createClient();
      
      let finalCategoryId = input.category_id;

      // Handle new category creation
      if (input.new_category_name && input.type !== 'transfer') {
         const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert([{ name: input.new_category_name, type: input.type }])
            .select()
            .single();

         if (categoryError) throw categoryError;
         finalCategoryId = newCategory.id;
      }
      
      // Bersihkan data berdasarkan tipe agar tidak melanggar constraint database
      const payload = {
        type: input.type,
        amount: input.amount,
        account_id: input.account_id,
        to_account_id: input.type === 'transfer' ? input.to_account_id : null,
        category_id: input.type !== 'transfer' ? finalCategoryId : null,
        notes: input.notes,
        date: input.date
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate accounts agar saldo di dashboard langsung terupdate
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // Invalidate transactions untuk histori (akan kita buat nanti)
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Invalidate categories in case a new one was added
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useTransactions(limit = 10) {
  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: async () => {
      const supabase = createClient();
      
      // Mengambil transaksi sekaligus melakukan JOIN (relasi) ke tabel accounts dan categories
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          type,
          amount,
          notes,
          date,
          created_at,
          category:category_id (name),
          account:account_id (name),
          to_account:to_account_id (name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Supabase mengembalikan relasi dalam bentuk array jika tidak one-to-one secara strict, 
      // tapi kita gunakan any dulu atau as TransactionRecord[] jika relasi diset single object.
      // Jika di console ada error tipe, pastikan tipe datanya pas.
      return (data as any) as TransactionRecord[];
    },
  });
}

// Tambahkan fungsi ini di bagian bawah file src/features/transactions/hooks.ts

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true }); // Mengurutkan nama kategori sesuai abjad

      if (error) throw error;
      return data;
    },
  });
}