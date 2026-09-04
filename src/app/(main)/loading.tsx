export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Data...</p>
      </div>
    </div>
  );
}