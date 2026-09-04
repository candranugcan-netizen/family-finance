import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Account, CreateAccountInput } from './types';

// Hook untuk mengambil daftar rekening
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Account[];
    },
  });
}

// Hook untuk menambah rekening baru
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAccount: CreateAccountInput) => {
      const supabase = createClient();
      // current_balance di awal sama dengan initial_balance
      const { data, error } = await supabase.from('accounts').insert([{
        ...newAccount,
        current_balance: newAccount.initial_balance
      }]).select().single();

      if (error) throw error;
      return data;
    },
    // Jika sukses, paksa fetch ulang data 'accounts' agar UI terupdate instan
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}