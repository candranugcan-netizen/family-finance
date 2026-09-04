'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAccount } from '../hooks';
import { X, Loader2 } from 'lucide-react';
import { AccountType } from '../types';

const accountSchema = z.object({
  name: z.string().min(2, 'Nama rekening minimal 2 karakter'),
  type: z.enum(['Bank', 'Cash', 'E-Wallet', 'Investment'] as const),
  initial_balance: z.number().min(0, 'Saldo tidak boleh negatif'),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function CreateAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createAccount = useCreateAccount();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', type: 'Bank', initial_balance: 0 }
  });

  if (!isOpen) return null;

  const onSubmit = (data: AccountFormValues) => {
    createAccount.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm sm:items-center sm:justify-center">
      {/* Animasi sederhana untuk mobile bottom sheet */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Tambah Rekening</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Rekening</label>
            <input
              {...register('name')}
              placeholder="Contoh: BCA Keluarga, Uang Tunai"
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
            <select
              {...register('type')}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet (GoPay, OVO, dll)</option>
              <option value="Cash">Uang Tunai</option>
              <option value="Investment">Investasi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Saldo Awal</label>
            <input
              type="number"
              {...register('initial_balance', { valueAsNumber: true })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
            />
            {errors.initial_balance && <p className="text-red-500 text-xs mt-1">{errors.initial_balance.message}</p>}
          </div>

          <button
            type="submit"
            disabled={createAccount.isPending}
            className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-semibold flex justify-center items-center disabled:opacity-50"
          >
            {createAccount.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Rekening'}
          </button>
        </form>
      </div>
    </div>
  );
}