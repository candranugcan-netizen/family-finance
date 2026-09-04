import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Goal, CreateGoalInput, TopUpGoalInput } from './types';

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('goals')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}


export function useTopUpGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: TopUpGoalInput) => {
      const supabase = createClient();
      
      // 1. Ambil data current_amount saat ini
      const { data: goal, error: fetchError } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Tambahkan nominal baru
      const newAmount = Number(goal.current_amount) + amount;

      // 3. Update ke database
      const { data, error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}