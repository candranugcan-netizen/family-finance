'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, Target, Wallet, ReceiptText } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

export default function BottomNav() {
  const pathname = usePathname();
  const openTxModal = useUIStore((state) => state.openTxModal);

  const navItemsLeft = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Aset', href: '/assets', icon: Wallet },
  ];

  const navItemsRight = [
    { name: 'Target', href: '/goals', icon: Target },
    { name: 'Kewajiban', href: '/net-worth', icon: PieChart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-100 pb-safe">
      {/* UBAH: Menggunakan grid 5 kolom agar jarak merata dan proporsional */}
      <div className="relative grid grid-cols-5 h-16 max-w-md mx-auto w-full">
        
        {/* Kiri (Kolom 1 & 2) */}
        {navItemsLeft.map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center space-y-1">
            <item.icon className={`w-6 h-6 ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-medium ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`}>{item.name}</span>
          </Link>
        ))}

        {/* Tengah (Kolom 3) - Spacer kosong agar area bawah tombol FAB tidak bisa di-klik sembarangan */}
        <div className="pointer-events-none"></div>

        {/* Tombol Tengah Melayang (FAB) - Tetap absolute */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={openTxModal}
            className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform border-4 border-slate-50"
          >
            <ReceiptText className="w-6 h-6" />
          </button>
        </div>

        {/* Kanan (Kolom 4 & 5) */}
        {navItemsRight.map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center space-y-1">
            <item.icon className={`w-6 h-6 ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-medium ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`}>{item.name}</span>
          </Link>
        ))}

      </div>
    </div>
  );
}