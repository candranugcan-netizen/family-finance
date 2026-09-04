'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Menggunakan useState agar QueryClient tidak dibuat ulang setiap render ulang
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 menit cache default
            refetchOnWindowFocus: false, // Menghindari fetch berulang saat pindah tab
          },
        },
      })
  );

  return (
    // Perbaikan: Hapus tanda kutip "" pada client={queryClient}
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}