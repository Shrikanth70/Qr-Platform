import { useState, useEffect, useMemo } from 'react'
import PatternCard from '../components/PatternCard'
import QRPreview from '../components/QRPreview'
import { qrApi } from '../api/qrApi'

function Generate() {
  // Hard-reverted to fundamental non-silhouette styling options globally per request
  const patterns = ['Classic', 'Rounded', 'Bold', 'Minimal', 'Logo Center']
  const sizes = ['256', '512', '1024']

  const [selectedPattern, setSelectedPattern] = useState('Classic')
  const [size, setSize] = useState('512')
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const [logoFile, setLogoFile] = useState(null)
  
  const [logoBase64, setLogoBase64] = useState(null)
  
  useEffect(() => {
    if (!logoFile) {
      setLogoBase64(null)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setLogoBase64(e.target.result)
    reader.readAsDataURL(logoFile)
  }, [logoFile])

  const displayLogoUrl = selectedPattern === 'Logo Center' ? logoBase64 : null;

  const [downloadFormat, setDownloadFormat] = useState('png')
  const [actualQrMatrix, setActualQrMatrix] = useState(null)
  
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [isGenerating, setIsGenerating] = useState(false)

  // Reset actual image if style/inputs change so user doesn't download a stale QR
  useEffect(() => {
    setActualQrMatrix(null);
  }, [selectedPattern, fgColor, bgColor, size, link, title, description, logoFile]);

  const handleGenerate = async () => {
    if (!link.trim()) {
      alert('Please enter a valid link');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title for your QR code');
      return;
    }

    setIsGenerating(true)
    try {
      const payload = {
        text: link,
        title,
        description,
        type: 'link',
        pattern: selectedPattern,
        color: fgColor,
        bgColor: bgColor,
        size: parseInt(size, 10),
        expiresIn: 60
      }
      
      const response = await qrApi.generateQR(payload)
      setActualQrMatrix(response.qrCode)

    } catch (error) {
      console.error(error)
      alert(
        'Error generating QR: ' +
        (error.response?.data?.message || error.message)
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!actualQrMatrix) {
      alert('Generate an actual QR code first')
      return
    }

    const svgElement = document.getElementById('qr-render-svg');
    if (!svgElement) return;

    // Create a Blob from the SVG String
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    const targetSize = parseInt(size, 10) || 512;

    // Provide explicitly required xmlns wrapper or canvas exports will fail
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    // Explicitly set dimensions to ensure crisp SVG rasterization onto the specified canvas dimensions
    source = source.replace(/^<svg/, `<svg width="${targetSize}" height="${targetSize}"`);
    
    const bgStr = `<rect width="100%" height="100%" fill="${bgColor}" />`;
    source = source.replace('>', `>${bgStr}`); 

    const svgBlob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enforce the ISO standard Quiet Zone (padding)
      const padding = Math.floor(targetSize * 0.08); // 8% border
      const drawSize = targetSize - (padding * 2);

      ctx.drawImage(img, padding, padding, drawSize, drawSize);
      
      // Sanitize title for filename
      const safeTitle = title.trim().replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-') || 'qr-code';
      
      const downloadUrl = canvas.toDataURL(`image/${downloadFormat === 'jpg' ? 'jpeg' : downloadFormat}`, 1.0);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${safeTitle}.${downloadFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const inputClass = "w-full bg-slate-900/40 border border-slate-700/60 text-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/80 transition-all placeholder-slate-500 shadow-inner"
  const labelClass = "block font-bold text-slate-300 mb-2.5 text-[0.65rem] sm:text-xs uppercase tracking-widest opacity-90"

  const isDemo = !actualQrMatrix;

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12">
      <div className="mb-12 text-center md:text-left animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Generate <span className="text-blue-400">QR Code</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">Customize your design, shape matrix, sizing, and colors below.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 xl:gap-12 items-start">

        {/* LEFT PANEL */}
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-6 md:p-10 border border-white/5 ring-1 ring-white/5">

          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white border-b border-slate-700/50 pb-4">
            1. Visual Aesthetic
          </h2>

          <div className="grid sm:grid-cols-[1fr_auto] gap-6 mb-8">
            <div>
              <label className={labelClass}>Shape Profile</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {patterns.map((pattern) => (
                  <PatternCard
                    key={pattern}
                    label={pattern}
                    selected={selectedPattern === pattern}
                    onClick={() => setSelectedPattern(pattern)}
                  />
                ))}
              </div>
            </div>
            
            <div className="min-w-[120px]">
              <label className={labelClass}>Target Size</label>
              <div className="flex flex-col gap-3">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                      size === s 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'bg-slate-900/50 border-slate-700/60 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            <div>
              <label className={labelClass}>Foreground Color</label>
              <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-700/60 rounded-xl p-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/80 transition-all shadow-inner hover:bg-slate-900/80">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg shrink-0 bg-transparent border-none cursor-pointer p-0"
                />
                <span className="text-slate-300 uppercase font-mono text-sm tracking-widest font-semibold">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Background Color</label>
              <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-700/60 rounded-xl p-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/80 transition-all shadow-inner hover:bg-slate-900/80">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg shrink-0 bg-transparent border-none cursor-pointer p-0"
                />
                <span className="text-slate-300 uppercase font-mono text-sm tracking-widest font-semibold">{bgColor}</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white border-b border-slate-700/50 pb-4">
            2. QR Data & Assets
          </h2>

          <div className="space-y-6 mb-10">
            <div>
              <label className={labelClass}>Target URL / Link <span className="text-blue-400">*</span></label>
              <input
                type="text"
                placeholder="https://your-link.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className={inputClass}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Title <span className="text-blue-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. My Portfolio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Scan to view"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {selectedPattern === 'Logo Center' && (
              <div className="animate-in fade-in duration-300">
                <label className={labelClass}>Embedded Image / Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full text-slate-300 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 hover:file:text-blue-300 transition-colors cursor-pointer border border-slate-700/60 rounded-xl bg-slate-900/40 p-1.5 shadow-inner"
                />
                <p className="mt-2 text-xs text-slate-500 opacity-80">(Central automatic placement for distinct corporate or personal branding.)</p>
              </div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white border-b border-slate-700/50 pb-4">
            3. Finalize
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mt-8">
            <div className="flex-grow">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !link.trim() || !title.trim()}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.98]"
              >
                {isGenerating ? 'Encoding Matrix...' : 'Generate Format'}
              </button>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
               <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="bg-slate-800/80 border border-slate-600 text-white rounded-xl px-4 sm:px-5 py-4 outline-none font-bold cursor-pointer hover:bg-slate-700/80 transition-colors shadow-inner"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>

              <button
                onClick={handleDownload}
                disabled={!actualQrMatrix}
                className="flex-grow sm:flex-grow-0 bg-emerald-600 text-white px-6 sm:px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 disabled:opacity-50 disabled:bg-slate-700 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-[0.98]"
                title={!actualQrMatrix ? "You must generate the QR first" : ""}
              >
                Download
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="animate-in slide-in-from-right-4 duration-700 delay-100 fill-mode-both">
          <QRPreview 
            matrixArray={actualQrMatrix} 
            isDemo={isDemo} 
            pattern={selectedPattern} 
            fgColor={fgColor} 
            bgColor={bgColor} 
            size={size}
            logoUrl={displayLogoUrl}
          />
        </div>
      </div>
    </div>
  )
}

export default Generate