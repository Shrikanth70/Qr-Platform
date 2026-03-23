import QRRenderer from './QRRenderer';

function QRPreview({ matrixArray, isDemo, pattern, fgColor, bgColor, size, logoUrl }) {
  
  // Predictable physical visual scaling based on expected size outputs.
  const getScale = () => {
    switch (size) {
      case '1024': return 'scale-[1.0]'; 
      case '512': return 'scale-[0.85]'; 
      case '256': return 'scale-[0.65]';
      default: return 'scale-[0.85]';
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 lg:sticky lg:top-28 h-fit flex flex-col items-center ring-1 ring-white/5">
      <h3 className="text-xl font-extrabold text-white mb-8 border-b border-slate-700/50 pb-4 w-full text-center tracking-widest uppercase text-opacity-90">
        Live Preview
      </h3>

      {/* The container explicitly respects the sizing visual scaler mapped tightly to the selection */}
      <div className={`relative flex flex-col items-center justify-center w-full max-w-[320px] aspect-square bg-[#0a0f1c] rounded-3xl border border-white/5 p-4 sm:p-6 shadow-inner transition-transform duration-500 ease-out group`}>
        
        {isDemo && (
          <div className="absolute -top-4 right-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-10 backdrop-blur-md">
            Style Demo
          </div>
        )}

        <div className={`w-full h-full flex items-center justify-center rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${getScale()}`}>
          <QRRenderer 
            matrix={isDemo ? null : matrixArray} 
            pattern={pattern} 
            fgColor={fgColor} 
            bgColor={bgColor} 
            logoUrl={logoUrl}
          />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center space-y-2">
        {isDemo ? (
          <p className="text-sm text-slate-400 text-center font-medium px-2 leading-relaxed opacity-80">
            This demo visualises your <strong className="text-slate-200">{pattern}</strong> template at <strong className="text-slate-200">{size}px</strong>. <br/> Click <strong className="text-blue-400 font-semibold">Generate Format</strong> to encode data.
          </p>
        ) : (
          <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
             QR Encoded at {size}px
          </p>
        )}
      </div>
    </div>
  )
}

export default QRPreview;