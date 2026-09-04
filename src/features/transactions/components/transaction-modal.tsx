// transaction-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, ArrowRightLeft, TrendingDown, TrendingUp, Plus } from 'lucide-react';
import { format } from 'date-fns';

import { useAccounts } from '@/features/accounts/hooks';
import { useCategories } from '@/features/categories/hooks';
import { useCreateTransaction } from '../hooks';
import { TransactionType } from '../types';

// Skema validasi dinamis
const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().min(1, 'Nominal harus lebih dari 0'),
  account_id: z.string().min(1, 'Pilih rekening'),
  to_account_id: z.string().optional(),
  category_id: z.string().optional(),
  new_category_name: z.string().optional(),
  notes: z.string().optional(),
  date: z.string(),
}).superRefine((data, ctx) => {
  if (data.type === 'transfer') {
    if (!data.to_account_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Pilih rekening tujuan', path: ['to_account_id'] });
    } else if (data.account_id === data.to_account_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Rekening asal dan tujuan sama', path: ['to_account_id'] });
    }
  } else {
    // Membutuhkan category_id atau new_category_name
    if (!data.category_id && !data.new_category_name) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Pilih kategori atau buat baru', path: ['category_id'] });
    }
  }
});

type FormValues = z.infer<typeof transactionSchema>;

export default function TransactionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createTx = useCreateTransaction();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    }
  });

  // Reset form saat tab berubah, tapi pertahankan tanggal
  useEffect(() => {
    setValue('type', activeTab);
    setValue('category_id', '');
    setValue('new_category_name', '');
    setValue('to_account_id', '');
    setIsCreatingCategory(false);
  }, [activeTab, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: FormValues) => {
    createTx.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  // Filter kategori sesuai tab aktif (income/expense)
  const filteredCategories = categories?.filter(c => c.type === activeTab) || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header & Tabs */}
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Catat Transaksi</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('expense')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
            >
              <TrendingDown className="w-4 h-4 mr-1" /> Keluar
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" /> Masuk
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'transfer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <ArrowRightLeft className="w-4 h-4 mr-1" /> Transfer
            </button>
          </div>
        </div>

        {/* Form Scrollable */}
        <div className="p-4 overflow-y-auto">
          <form id="tx-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nominal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className="w-full p-3 text-2xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                placeholder="0"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Rekening Asal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {activeTab === 'transfer' ? 'Dari Rekening' : (activeTab === 'income' ? 'Masuk ke Rekening' : 'Pakai Rekening')}
              </label>
              <select {...register('account_id')} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-slate-800">
                <option value="">-- Pilih Rekening --</option>
                {accounts?.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
              {errors.account_id && <p className="text-red-500 text-xs mt-1">{errors.account_id.message}</p>}
            </div>

            {/* Khusus Transfer: Rekening Tujuan */}
            {activeTab === 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ke Rekening</label>
                <select {...register('to_account_id')} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-slate-800">
                  <option value="">-- Pilih Rekening Tujuan --</option>
                  {accounts?.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
                {errors.to_account_id && <p className="text-red-500 text-xs mt-1">{errors.to_account_id.message}</p>}
              </div>
            )}

            {/* Khusus Income/Expense: Kategori */}
            {activeTab !== 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                
                {isCreatingCategory ? (
                   <div className="flex space-x-2">
                       <input
                           type="text"
                           {...register('new_category_name')}
                           placeholder="Nama Kategori Baru"
                           className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                       />
                       <button
                           type="button"
                           onClick={() => {
                               setIsCreatingCategory(false);
                               setValue('new_category_name', '');
                           }}
                           className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200"
                       >
                           Batal
                       </button>
                   </div>
                ) : (
                    <div className="flex space-x-2">
                        <select {...register('category_id')} className="flex-1 p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-slate-800">
                            <option value="">-- Pilih Kategori --</option>
                            {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreatingCategory(true);
                                setValue('category_id', '');
                            }}
                            className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 flex items-center justify-center"
                            title="Tambah Kategori"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
              </div>
            )}

            {/* Tanggal & Catatan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                <input type="date" {...register('date')} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
                <input type="text" {...register('notes')} placeholder="Makan siang, belanja, dll" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            form="tx-form"
            type="submit"
            disabled={createTx.isPending}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold flex justify-center items-center disabled:opacity-50"
          >
            {createTx.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Transaksi'}
          </button>
        </div>

      </div>
    </div>
  );
}