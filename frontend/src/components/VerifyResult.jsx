function VerifyResult({ result }) {
  if (!result) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-2xl text-slate-500 bg-slate-800/20 backdrop-blur-sm">
        <p className="font-medium text-lg mb-2">Awaiting QR scan</p>
        <p className="text-sm">Upload a QR image to verify its authenticity.</p>
      </div>
    );
  }

  const isValid = result.success;

  const statusColor = isValid
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    : 'bg-red-500/10 border-red-500/30 text-red-400';

  const statusText = isValid
    ? result.message || "Valid Secure QR"
    : result.reason || result.message || "Invalid QR";

  const payload = result.data || {};

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">
        Verification Result
      </h3>

      {/* STATUS */}
      <div className={`p-4 rounded-xl mb-6 border ${statusColor} flex items-center gap-3`}>
        <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`}></div>
        <span className="font-semibold">{statusText}</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="space-y-4 text-slate-300 bg-slate-900/50 border border-slate-800 p-6 rounded-xl">

        {payload.description && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 text-blue-100 font-medium">
            {payload.description}
          </div>
        )}

        {payload.title && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">Title</span>
            <span className="w-2/3 text-white font-semibold">{payload.title}</span>
          </div>
        )}

        {payload.type && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">Type</span>
            <span className="w-2/3 text-white font-semibold capitalize">{payload.type}</span>
          </div>
        )}

        {/* Dynamic Fields Loop */}
        {Object.entries(payload).map(([key, value]) => {
          if (['title', 'description', 'type', 'qrId', 'createdAt', 'expiresAt', 'data'].includes(key)) return null;
          if (typeof value === 'object') return null; // Avoid rendering raw nested objects
          
          return (
            <div key={key} className="flex border-b border-slate-800 pb-3">
              <span className="w-1/3 text-slate-500 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="w-2/3 text-white font-semibold">{String(value)}</span>
            </div>
          )
        })}

        {payload.data && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">
              {payload.type === 'link' || payload.type === 'url' ? 'Link' : 'Content'}
            </span>
            <span className="w-2/3 text-white font-semibold break-all">{payload.data}</span>
          </div>
        )}
        
        {/* Optional Contextual Link Description */}
        {payload.data && (payload.type === 'link' || payload.type === 'url') && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">Overview</span>
            <span className="w-2/3 text-slate-400 text-sm">
              This QR code securely connects you directly to the linked web address.
            </span>
          </div>
        )}

        {payload.qrId && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">QR ID</span>
            <span className="w-2/3 text-slate-400 font-mono text-sm">{payload.qrId}</span>
          </div>
        )}

        {(payload.createdAt || payload.expiresAt) && (
          <div className="flex border-b border-slate-800 pb-3">
            <span className="w-1/3 text-slate-500 font-medium">Validity</span>
            <span className="w-2/3 text-slate-400 text-sm">
              Issued: {payload.createdAt || 'N/A'}<br/>
              Expires: {payload.expiresAt || 'N/A'}
            </span>
          </div>
        )}

        {result.scanCount !== undefined && (
          <div className="flex">
            <span className="w-1/3 text-slate-500 font-medium">Scan Count</span>
            <span className="w-2/3 text-white font-semibold">{result.scanCount}</span>
          </div>
        )}

        {!isValid && result.reason && (
          <div className="flex mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="w-1/3 text-red-500 font-medium">Error</span>
            <span className="w-2/3 text-red-400">{result.reason}</span>
          </div>
        )}
      </div>

      {/* CLICKABLE LINK */}
      {payload.data && payload.data.startsWith("http") && (
        <a
          href={payload.data}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition shadow-[0_0_15px_rgba(37,99,235,0.2)]"
        >
          Open Link
        </a>
      )}
    </div>
  );
}

export default VerifyResult;