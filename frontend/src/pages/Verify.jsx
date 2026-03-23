import { useState } from "react";
import qrApi from "../api/qrApi";
import VerifyResult from "../components/VerifyResult";

function Verify() {
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null); // Reset result on new file
    }
  };

  const handleVerify = async () => {
    if (!file) {
      alert("Please upload a QR code image to verify.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await qrApi.verifyQR(file);
      console.log("Verify Response:", response);
      setResult(response);
    } catch (err) {
      console.error(err);
      
      // If error from backend validation
      if (err.response?.data) {
        setResult(err.response.data);
      } else {
        // Network or other error
        setResult({
          success: false,
          message: "Verification failed due to a server error.",
          reason: err.message
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Verify QR Code
        </h1>
        <p className="text-slate-400">Upload a QR image to verify its authenticity and view contents safely.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Upload Panel */}
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700/50 pb-3">
            Upload Image
          </h2>
          
          <div className="mb-6">
            <label className="block border-2 border-dashed border-slate-600 hover:border-blue-500 bg-slate-900/40 rounded-2xl p-8 text-center cursor-pointer transition-colors group">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                 {/* Simple SVG icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                 </svg>
                {file ? <span className="font-semibold text-slate-200">{file.name}</span> : <span className="font-semibold">Click to select QR image</span>}
              </div>
            </label>
          </div>

          {previewUrl && (
            <div className="mb-6 flex justify-center">
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl border border-slate-700 object-contain bg-white/5 p-2" />
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={!file || isVerifying}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {isVerifying ? "Verifying Securely..." : "Verify Identity"}
          </button>
        </div>

        {/* Result Panel */}
        <div>
          <VerifyResult result={result} />
        </div>
      </div>
    </div>
  );
}

export default Verify;