'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenseByCategory } from '../hooks';
import { formatRupiah } from '@/lib/utils';

// Palet warna elegan ala corporate/e-banking
const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

export default function ExpenseChart() {
  const { data, isLoading } = useExpenseByCategory();

  if (isLoading) {
    return <div className="h-48 w-full bg-slate-50 animate-pulse rounded-2xl"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl">
        <p className="text-sm text-slate-400">Belum ada pengeluaran bulan ini.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Pengeluaran Terbesar
      </p>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => formatRupiah(Number(value))}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-2">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-800">{formatRupiah(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}