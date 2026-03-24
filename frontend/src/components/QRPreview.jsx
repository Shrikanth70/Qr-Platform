import QRRenderer from './QRRenderer';

function QRPreview({ matrixArray, isDemo, pattern, fgColor, bgColor, size, logoUrl, quietZone }) {
  
  // Predictable physical visual bounds based on expected size outputs.
  const getContainerMaxWidth = () => {
    switch (size) {
      case '1024': return '340px'; 
      case '512': return '240px'; 
      case '256': return '160px';
      default: return '340px';
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 lg:sticky lg:top-28 h-fit flex flex-col items-center ring-1 ring-white/5 relative">
      
      <div className="w-full flex justify-between items-end sm:items-center mb-8 border-b border-slate-700/50 pb-4">
        <h3 className="text-xl font-extrabold text-white tracking-widest uppercase text-opacity-90">
          Live Preview
        </h3>
        {isDemo && (
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-10 backdrop-blur-md">
            Style Demo
          </div>
        )}
      </div>

      {/* The container explicitly respects the physical visual boundaries mapped tightly to the selection */}
      <div 
        className={`relative flex flex-col items-center justify-center w-full aspect-square bg-[#0a0f1c] rounded-3xl border border-white/5 p-4 sm:p-6 shadow-inner transition-all duration-500 ease-out group mx-auto`}
        style={{ maxWidth: getContainerMaxWidth() }}
      >


        <div className={`w-full h-full flex items-center justify-center rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] min-w-0 min-h-0 overflow-hidden`}>
          <QRRenderer 
            matrix={isDemo ? null : matrixArray} 
            pattern={pattern} 
            fgColor={fgColor} 
            bgColor={bgColor} 
            logoUrl={logoUrl}
            size={size}
            quietZone={quietZone}
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