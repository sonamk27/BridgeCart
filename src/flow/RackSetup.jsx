import { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
export default function RackSetup({
  onDone
}) {
  const {
    configureLayout
  } = useStoreData();
  const [rows, setRows] = useState('6');
  const [columns, setColumns] = useState('5');
  const rowsNum = Math.max(1, Math.min(20, Number(rows) || 0));
  const colsNum = Math.max(1, Math.min(12, Number(columns) || 0));
  function handleSubmit(e) {
    e.preventDefault();
    configureLayout(rowsNum, colsNum);
    onDone();
  }
  return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-[520px]">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--teal)] flex items-center justify-center text-lg">🛒</div>
          <span className="font-extrabold text-[18px] text-[var(--navy-deep)]">BridgeCart</span>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-2xl p-7">
          <div className="text-center mb-7">
            <div className="text-[11.5px] font-bold tracking-wide text-[var(--teal-dark)] bg-[#E6F6EC] inline-block px-3 py-1 rounded-full mb-3">
              ONE-TIME SETUP
            </div>
            <div className="text-[19px] font-extrabold mb-1.5">Set up your store's rack layout</div>
            <div className="text-[13px] text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
              Tell us how your store is physically laid out. This shapes the 3D Store Layout view and every
              shelf assignment after this.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--muted)] mb-2">
                  Number of Rows (Racks)
                </label>
                <input type="number" min={1} max={20} value={rows} onChange={e => setRows(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-3 text-[16px] font-bold text-center" required />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--muted)] mb-2">
                  Number of Columns (Shelves per Row)
                </label>
                <input type="number" min={1} max={12} value={columns} onChange={e => setColumns(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-3 text-[16px] font-bold text-center" required />
              </div>
            </div>

            <div className="bg-[#F4F6F9] rounded-xl p-4">
              <div className="text-[11.5px] font-semibold text-[var(--muted)] mb-2.5">Preview</div>
              <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
                {Array.from({
                length: rowsNum
              }).map((_, r) => <div key={r} className="flex flex-col-reverse gap-[2px] shrink-0">
                    {Array.from({
                  length: colsNum
                }).map((_, c) => <div key={c} className="w-4 h-3 rounded-[2px]" style={{
                  background: `hsl(${r * 47 % 360} 55% 50%)`
                }} />)}
                  </div>)}
              </div>
              <div className="text-[12px] font-semibold text-[var(--navy-deep)] mt-3">
                {rowsNum} row{rowsNum !== 1 ? 's' : ''} × {colsNum} shelf{colsNum !== 1 ? 'ves' : ''} each ={' '}
                {rowsNum * colsNum} total shelf slots
              </div>
            </div>

            <button type="submit" className="w-full bg-[var(--teal)] text-white font-bold text-[14px] py-3 rounded-lg hover:bg-[var(--teal-dark)] transition-colors">
              Generate Store Layout →
            </button>
            <div className="text-[11px] text-center text-[var(--muted)]">
              You can change this any time from Store Layout → Reconfigure.
            </div>
          </form>
        </div>
      </div>
    </div>;
}
