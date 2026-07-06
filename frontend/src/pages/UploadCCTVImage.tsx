import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Camera, X, ArrowLeft } from 'lucide-react';

function UploadCCTVImage() {
  const [cctvImage, setCctvImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userImage = location.state?.userImage;
  const userPreview = location.state?.userPreview;
  const formData = location.state?.formData;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCctvImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCompare = async () => {
    if (!cctvImage) {
      alert("Please upload the CCTV snapshot.");
      return;
    }
    if (!userImage) {
      alert("Lost report details are missing. Go back to Step 1.");
      return;
    }

    setLoading(true);

    const payload = new FormData();
    payload.append("userImage", userImage);
    payload.append("cctvImage", cctvImage);
    payload.append("title", formData?.name || "");
    payload.append("description", formData?.description || "");
    payload.append("phone", formData?.phone || "");
    payload.append("locationName", formData?.location || "");
    payload.append("latitude", formData?.latitude?.toString() || "28.6139");
    payload.append("longitude", formData?.longitude?.toString() || "77.2090");
    payload.append("type", "lost");
    payload.append("category", "Electronics");

    try {
      const apiUrl = (import.meta.env.VITE_APP_API_URL as string) || "http://localhost:5000";
      const res = await axios.post(
        `${apiUrl}/api/compare`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate('/result', {
        state: {
          ...res.data,
          userPreview,
          cctvPreview: preview,
          itemName: formData?.name,
          formData,
        },
      });
    } catch (err) {
      alert("Error connecting to backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!userImage) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl mt-12">
        <h3 className="text-lg font-bold text-red-400">Session Invalid</h3>
        <p className="text-xs text-slate-400 mt-2">Please go back to Step 1 and complete the lost report form.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white cursor-pointer"
        >
          Go to Step 1
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl mt-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <div className="text-right">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">CCTV Frame</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>Step 2: Upload CCTV Image</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Upload the CCTV camera snapshot where the item was supposedly lost or found.</p>
      </div>

      <div className="space-y-6">
        {/* User reference display */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex items-center gap-4">
          <img src={userPreview} alt="user item" className="w-16 h-16 object-cover rounded-xl border border-slate-800" />
          <div>
            <h4 className="text-sm font-bold text-white">{formData?.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{formData?.description}</p>
          </div>
        </div>

        {/* CCTV Upload box */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">CCTV Camera Frame *</label>
          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/40 relative">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="CCTV preview" className="w-40 h-40 object-cover rounded-xl border border-slate-800 shadow-lg" />
                <button 
                  type="button" 
                  onClick={() => { setPreview(null); setCctvImage(null); }}
                  className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full text-white border border-slate-950 shadow-md cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Camera size={28} className="mx-auto text-slate-600" />
                <div className="text-xs text-slate-400">
                  <label className="relative cursor-pointer text-indigo-400 hover:text-indigo-300 font-bold">
                    <span>Upload CCTV snapshot</span>
                    <input type="file" onChange={handleImage} className="sr-only" accept="image/*" />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Compare / Submit button */}
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-extrabold text-white rounded-xl shadow-lg transition-all duration-200 mt-6 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-55"
        >
          {loading ? (
            <>
              <ActivityIndicator />
              <span>Analyzing Image Structural Perceptions...</span>
            </>
          ) : (
            <span>Compare Items</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Simple internal loader spinner
function ActivityIndicator() {
  return (
    <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin"></div>
  );
}

export default UploadCCTVImage;
