import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Liability, CreateLiabilityInput } from './types';

// 1. Fetch Data Utang
export function useLiabilities() {
  return useQuery({
    queryKey: ['liabilities'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Liability[];
    },
  });
}

// 2. Tambah Utang Baru
export function useCreateLiability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLiabilityInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liabilities')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liabilities'] });
    },
  });
}

// 3. Update Sisa Utang (Bayar Cicilan)
export function useUpdateRemainingDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newRemaining }: { id: string; newRemaining: number }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liabilities')
        .update({ remaining_amount: newRemaining })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liabilities'] });
    },
  });
}