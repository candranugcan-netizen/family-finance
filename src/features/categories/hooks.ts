import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Category } from './types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
}