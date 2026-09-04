import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Asset } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAssetInput } from './types';

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Asset[];
    },
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAssetInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('assets')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

// Hook untuk Update Harga Pasar (Valuasi)
export function useUpdateAssetPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newPrice }: { id: string; newPrice: number }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('assets')
        .update({ current_price: newPrice })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}