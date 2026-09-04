'use client';

import { useState } from 'react';
import { useGoals } from '@/features/goals/hooks';
import { Goal } from '@/features/goals/types';
import CreateGoalModal from '@/features/goals/components/create-goal-modal';
import TopUpGoalModal from '@/features/goals/components/top-up-goal-modal'; // BARU
import { formatRupiah } from '@/lib/utils';
import { Target, Plus, PlusCircle } from 'lucide-react'; // BARU: PlusCircle

export default function GoalsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); // BARU
  
  const { data: goals, isLoading } = useGoals();

  return (
    <div className="min-h-screen relative pb-24">
      {/* HEADER (Tetap sama) */}
      <div className="bg-slate-900 text-white pt-10 pb-8 px-6 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Financial Goals</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Target Keuangan</h1>
        <p className="text-slate-400 text-sm">Wujudkan mimpimu satu per satu.</p>
      </div>

      {/* BODY CONTENT */}
      <div className="px-6 -mt-4 space-y-4">
        {/* TOMBOL TAMBAH TARGET */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-center space-x-2 text-slate-800 font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-5 h-5 text-slate-900" />
          <span>Buat Target Baru</span>
        </button>

        {isLoading ? (
          <div className="animate-pulse bg-slate-200 h-32 rounded-3xl w-full"></div>
        ) : goals?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">Belum ada target keuangan.</p>
          </div>
        ) : (
          goals?.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const isCompleted = progress >= 100;

            return (
              <div key={goal.id} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{goal.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isCompleted ? 'Target Tercapai! 🎉' : 'Sedang Berjalan'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-800">{formatRupiah(goal.current_amount)}</span>
                    <span className="block text-xs text-slate-400">dari {formatRupiah(goal.target_amount)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                
                {/* BARU: Area Bawah (Progress % dan Tombol Top Up) */}
                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                  <span className="text-xs font-bold text-slate-500">{progress.toFixed(1)}% Terkumpul</span>
                  
                  {!isCompleted && (
                    <button 
                      onClick={() => setSelectedGoal(goal)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">Top Up</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODALS */}
      <CreateGoalModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <TopUpGoalModal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)} goal={selectedGoal} />
    </div>
  );
}