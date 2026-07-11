import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Camera, X, Shield, Wallet } from 'lucide-react';

function UploadUserImage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    location: '',
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState({ lat: 28.6139, lng: 77.2090 });

  // Web3 Reward States
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [rewardAmount, setRewardAmount] = useState('0.05');
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const navigate = useNavigate();

  const connectWallet = () => {
    setIsWalletConnecting(true);
    setTimeout(() => {
      setWalletAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      setIsWalletConnecting(false);
    }, 800);
  };

  // Auto-detect location
  const fetchGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsCoords({ lat: latitude, lng: longitude });
        setForm((prev) => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
        }));
        setGpsLoading(false);
      },
      () => {
        alert("Enable GPS to auto-detect location");
        setGpsLoading(false);
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const nextPage = () => {
    if (!form.name || !form.description || !form.phone) {
      alert("Please fill all required details.");
      return;
    }
    if (!image) {
      alert("Please upload an item image.");
      return;
    }

    navigate('/cctv', {
      state: {
        userImage: image,
        userPreview: preview,
        formData: {
          ...form,
          latitude: gpsCoords.lat,
          longitude: gpsCoords.lng,
          web3Reward: isWeb3Enabled ? `${rewardAmount} ETH` : null,
          wallet: walletAddress
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl mt-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>Step 1: Lost Item Report</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">Lost Report</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Specify your details and upload the reference image of the lost item.</p>
      </div>

      <div className="space-y-4">
        {/* NAME */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Your Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 mt-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Item Description *</label>
          <textarea
            name="description"
            placeholder="Describe the lost item in detail (e.g. brand, color, unique marks)"
            required
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 mt-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PHONE */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase">Phone Number *</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +91 98765 43210"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 mt-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase flex justify-between items-center">
              <span>Lost Location *</span>
              <button 
                type="button" 
                onClick={fetchGPS}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Compass size={11} className={gpsLoading ? 'animate-spin' : ''} />
                <span>Get GPS</span>
              </button>
            </label>
            <input
              type="text"
              name="location"
              placeholder="Delhi Terminal 3, or coordinates"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 mt-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Item Reference Image *</label>
          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/40 relative">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-36 h-36 object-cover rounded-xl border border-slate-800 shadow-lg" />
                <button 
                  type="button" 
                  onClick={() => { setPreview(null); setImage(null); }}
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
                    <span>Upload a file</span>
                    <input type="file" onChange={handleImage} className="sr-only" accept="image/*" />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Web3 Reward Escrow Card */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Shield size={14} className="text-indigo-400" />
              <span>Enable Web3 Smart Contract Reward</span>
            </span>
            <input 
              type="checkbox" 
              checked={isWeb3Enabled}
              onChange={(e) => setIsWeb3Enabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
            />
          </div>

          {isWeb3Enabled && (
            <div className="pt-2 border-t border-slate-900 space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* MetaMask Connector */}
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Wallet Connection</label>
                  {walletAddress ? (
                    <div className="mt-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2 text-[10px] text-slate-300 font-mono flex items-center gap-2">
                      <Wallet size={12} className="text-indigo-400" />
                      <span>{walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</span>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={connectWallet}
                      disabled={isWalletConnecting}
                      className="mt-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-[10px] font-bold text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Wallet size={12} />
                      <span>{isWalletConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
                    </button>
                  )}
                </div>

                {/* Reward Amount */}
                <div className="w-full sm:w-1/3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Escrow Reward (ETH)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 mt-1.5 text-[10px] text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <p className="text-[9px] text-slate-500">Funds are locked securely in the AuraFind Escrow Contract and released to the finder only upon scanning the cryptographically verified QR code.</p>
            </div>
          )}
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={nextPage}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-extrabold text-white rounded-xl shadow-lg transition-all duration-200 mt-6 cursor-pointer"
        >
          Next: Upload CCTV Image
        </button>
      </div>
    </div>
  );
}

export default UploadUserImage;
