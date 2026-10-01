import { useState } from 'react';
import { useCustomer } from './CustomerContext';

export default function QRScannerModal({ onClose }) {
  const { session, startStoreSession, endStoreSession, extendSession } = useCustomer();
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [identifiedStore, setIdentifiedStore] = useState(null);

  function handleScanCode(code) {
    setErrorMsg('');
    const res = startStoreSession(code);
    if (res.success) {
      setIdentifiedStore(res.store);
      setScannedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setErrorMsg(res.error || 'Invalid Store QR. Please scan a valid BridgeCart entrance QR.');
    }
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-[var(--navy-deep)] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📷</span>
            <div>
              <h3 className="font-extrabold text-[15.5px]">Scan Store Entrance QR</h3>
              <p className="text-[11.5px] text-gray-300">Point your camera at the BridgeCart QR at the entrance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative bg-slate-950 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[260px]">
          {/* Subtle camera grid pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #15a99b 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {scannedSuccess ? (
            <div className="relative z-10 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                ✅
              </div>
              <div className="text-white font-extrabold text-[17px]">{identifiedStore?.name}</div>
              <div className="text-emerald-400 text-[12.5px] font-semibold mt-0.5">
                Session Activated • 60 Minutes Valid
              </div>
            </div>
          ) : (
            <div className="relative z-10 w-56 h-56 border-2 border-dashed border-teal-400/70 rounded-2xl flex flex-col items-center justify-center p-3 shadow-[0_0_40px_rgba(21,169,155,0.15)]">
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-4 border-l-4 border-[var(--teal)] rounded-tl-lg" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-4 border-r-4 border-[var(--teal)] rounded-tr-lg" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-4 border-l-4 border-[var(--teal)] rounded-bl-lg" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-4 border-r-4 border-[var(--teal)] rounded-br-lg" />

              {/* Animated laser line */}
              <div
                className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_12px_#15a99b] animate-bounce"
                style={{ animationDuration: '2s' }}
              />

              <div className="text-4xl mb-2 opacity-80">📱</div>
              <div className="text-[12px] text-teal-100/90 font-medium text-center">
                Align QR code within the frame
              </div>
            </div>
          )}

          <div className="relative z-10 mt-4 text-center">
            <span className="text-[11px] font-bold text-gray-400 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Live Camera Simulation
            </span>
          </div>
        </div>

        {/* Content & Test options */}
        <div className="p-5 space-y-4 bg-white">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[12px] font-semibold flex items-center gap-2">
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          {/* Preset store triggers for fast evaluation */}
          <div>
            <div className="text-[12px] font-bold text-[var(--navy-deep)] mb-2 flex items-center justify-between">
              <span>Quick Tap To Simulate Scanning:</span>
              <span className="text-[10.5px] text-[var(--teal-dark)] font-medium">Click to connect</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleScanCode('BC-STORE-LOKMANYA-101')}
                className="p-3 border-2 border-teal-100 hover:border-[var(--teal)] bg-teal-50/40 rounded-xl text-left transition-all hover:shadow-sm"
              >
                <div className="text-[13px] font-bold text-[var(--navy-deep)]">Lokmanya Super Market</div>
                <div className="text-[11px] text-[var(--muted)]">Store #101 • Kothrud</div>
                <div className="text-[10px] text-teal-700 font-semibold mt-1">Code: BC-101</div>
              </button>

              <button
                type="button"
                onClick={() => handleScanCode('BC-STORE-GREENVALLEY-102')}
                className="p-3 border-2 border-slate-100 hover:border-[var(--teal)] bg-slate-50/50 rounded-xl text-left transition-all hover:shadow-sm"
              >
                <div className="text-[13px] font-bold text-[var(--navy-deep)]">Green Valley Mart</div>
                <div className="text-[11px] text-[var(--muted)]">Store #102 • Baner</div>
                <div className="text-[10px] text-teal-700 font-semibold mt-1">Code: BC-102</div>
              </button>
            </div>
          </div>

          {/* Manual Store Code Input */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[var(--border)]">
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] mb-1">
              Or enter Store QR code / ID manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. BC-101 or LOKMANYA-101"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                className="flex-1 border border-[var(--border)] rounded-xl px-3 py-2 text-[13px] focus:outline-[var(--teal)]"
              />
              <button
                type="submit"
                className="bg-[var(--navy-deep)] hover:opacity-90 text-white font-bold text-[12.5px] px-4 rounded-xl transition-colors"
              >
                Connect
              </button>
            </div>
          </form>

          {/* Current Session status info */}
          {session.isActive && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[var(--muted)]">Current Session: </span>
                <span className="font-bold text-slate-800">{session.store?.name}</span>
                <span className="text-teal-700 font-semibold ml-1">({session.minutesRemaining}m remaining)</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => extendSession(30)}
                  className="text-[11px] font-bold text-[var(--teal-dark)] hover:underline"
                >
                  +30m
                </button>
                <button
                  type="button"
                  onClick={endStoreSession}
                  className="text-[11px] font-bold text-rose-600 hover:underline ml-2"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
