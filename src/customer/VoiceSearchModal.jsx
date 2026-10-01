import { useState, useEffect, useRef } from 'react';

export default function VoiceSearchModal({ onQuerySelect, onClose }) {
  const [listening, setListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [browserSupport, setBrowserSupport] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onresult = (event) => {
        const text = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      rec.onend = () => {
        setListening(false);
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition warning:', e);
        setListening(false);
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn('Voice search error:', err);
      setBrowserSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  function handleUseTranscript(text) {
    if (text && text.trim()) {
      onQuerySelect(text.trim());
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 text-center p-6">
        
        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Pulsing Mic Icon */}
        <div className="relative my-4 flex items-center justify-center">
          {listening && (
            <div className="absolute w-24 h-24 rounded-full bg-teal-400/30 animate-ping" />
          )}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--teal-dark)] to-[var(--teal)] text-white flex items-center justify-center text-3xl shadow-xl shadow-teal-500/25">
            🎙️
          </div>
        </div>

        <h3 className="font-extrabold text-[18px] text-[var(--navy-deep)] mb-1">
          {listening ? 'Listening to you…' : 'Tap to search or pick a phrase'}
        </h3>
        <p className="text-[12.5px] text-[var(--muted)] mb-4">
          Say a product name like “Atta”, “Milk”, or “Soap”
        </p>

        {/* Live transcript or input preview */}
        <div className="min-h-[50px] bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-center mb-5">
          {transcript ? (
            <span className="font-bold text-[15px] text-[var(--teal-dark)]">
              “{transcript}”
            </span>
          ) : (
            <span className="text-[12.5px] text-gray-400 italic">
              Speak now, or tap any suggestion below...
            </span>
          )}
        </div>

        {transcript && (
          <button
            onClick={() => handleUseTranscript(transcript)}
            className="w-full bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13px] py-2.5 rounded-xl shadow-md mb-4"
          >
            Search “{transcript}” →
          </button>
        )}

        {/* Quick Voice Suggestions */}
        <div className="pt-2 border-t border-[var(--border)]">
          <div className="text-[11.5px] font-semibold text-[var(--muted)] mb-2.5">
            Or tap to search popular store items:
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {['Milk', 'Atta', 'Tata Salt', 'Maggi Noodles', 'Soap', 'Sunflower Oil', 'Basmati Rice'].map((item) => (
              <button
                key={item}
                onClick={() => handleUseTranscript(item)}
                className="bg-gray-100 hover:bg-teal-50 hover:text-[var(--teal-dark)] hover:border-teal-200 border border-transparent text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
              >
                🔍 {item}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
