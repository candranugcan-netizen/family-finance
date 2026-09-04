import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Budget, CreateBudgetInput } from './types';
import { format } from 'date-fns';

// Ambil budget untuk bulan tertentu (default: bulan ini)
export function useBudgets(period = format(new Date(), 'yyyy-MM')) {
  return useQuery({
    queryKey: ['budgets', period],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('budgets')
        .select('*, category:category_id(name)')
        .eq('period', period);

      if (error) throw error;
      return data as Budget[];
    },
  });
}

// Simpan atau Update budget (Upsert)
export function useUpsertBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBudgetInput) => {
      const supabase = createClient();
      // Upsert: jika kombinasi category_id & period sudah ada, akan di-update (berkat unique constraint)
      const { data, error } = await supabase
        .from('budgets')
        .upsert([input], { onConflict: 'category_id,period' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.period] });
    },
  });
}