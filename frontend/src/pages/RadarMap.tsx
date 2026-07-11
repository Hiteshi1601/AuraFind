import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Info, Radio, Layers } from 'lucide-react';
import { ItemReport } from '../types';

const createCustomMarker = (color: string) => {
  return new L.DivIcon({
    html: `<div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
            <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
           </div>`,
    className: 'custom-leaflet-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const lostMarkerIcon = createCustomMarker('#ef4444');
const foundMarkerIcon = createCustomMarker('#10b981');

function RadarMap() {
  const [items, setItems] = useState<ItemReport[]>([]);
  const [viewMode, setViewMode] = useState<'gps' | 'ble'>('gps');

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aurafind_reports');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing saved reports:", err);
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Spatial Positioning Map</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">
              {viewMode === 'gps' ? 'GPS Geofences' : 'Indoor BLE Beacons'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'gps' 
              ? 'Geographical coordinates of your reported lost and found items.' 
              : 'Indoor micro-location tracking of your items using Bluetooth Beacons.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button 
            onClick={() => setViewMode('gps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'gps' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MapPin size={13} />
            <span>Outdoor GPS</span>
          </button>
          <button 
            onClick={() => setViewMode('ble')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'ble' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Radio size={13} />
            <span>Indoor BLE</span>
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 relative min-h-[400px] bg-slate-950/40">
        
        {viewMode === 'gps' ? (
          // OUTDOOR GPS MAP (Leaflet)
          items.length > 0 ? (
            <MapContainer 
              center={[items[0].latitude, items[0].longitude]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {items.map(item => (
                <Marker 
                  key={item.id} 
                  position={[item.latitude, item.longitude]}
                  icon={item.type === 'lost' ? lostMarkerIcon : foundMarkerIcon}
                >
                  <Popup>
                    <div className="text-slate-100 p-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {item.type}
                      </span>
                      <h4 className="text-sm font-bold mt-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      <p className="text-[10px] text-indigo-400 font-semibold mt-1 flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{item.locationName}</span>
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3">
              <MapPin size={48} className="text-slate-600 animate-pulse" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-400">No Items Logged Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Use the Match Wizard to report a lost item, and its GPS coordinates will map automatically.</p>
              </div>
            </div>
          )
        ) : (
          // INDOOR BLE BEACON RADAR VIEW
          <div className="w-full h-full p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto">
            {/* Visual Floor Layout Graph */}
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative min-h-[300px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border border-slate-800/40 pointer-events-none">
                <div className="border-r border-b border-slate-800/30 p-2 text-[9px] font-mono text-slate-600">ZONE 101 - CORRIDOR</div>
                <div className="border-b border-slate-800/30 p-2 text-[9px] font-mono text-slate-600">ZONE 102 - OFFICE</div>
                <div className="border-r border-slate-800/30 p-2 text-[9px] font-mono text-slate-600">ZONE 103 - LIBRARY FLOOR 2</div>
                <div className="p-2 text-[9px] font-mono text-slate-600">ZONE 104 - CONFERENCES</div>
              </div>

              {/* Beacon A Circle */}
              <div className="absolute top-[25%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-ping absolute"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-lg z-10">
                  <Radio size={8} className="text-white" />
                </div>
                <span className="absolute top-5 text-[8px] font-mono text-slate-400 bg-slate-950 px-1 rounded border border-slate-850">Major 1 Min 100</span>
              </div>

              {/* Beacon B Circle */}
              <div className="absolute top-[65%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border border-indigo-500/10 bg-indigo-500/5 absolute"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-500 border border-white flex items-center justify-center shadow-lg z-10">
                  <Radio size={8} className="text-white" />
                </div>
                <span className="absolute top-5 text-[8px] font-mono text-slate-400 bg-slate-950 px-1 rounded border border-slate-850">Major 1 Min 101</span>
              </div>

              {/* Lost Item Bounding Spot */}
              <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-lg shadow-red-500/40 z-20 animate-bounce">
                  <MapPin size={10} className="text-white" />
                </div>
                <span className="text-[9px] bg-red-500/90 text-white font-bold px-2 py-0.5 rounded-full shadow border border-white/20 mt-1 z-30">
                  {items.length > 0 ? items[0].title : "Your Wallet"}
                </span>
                <span className="text-[7px] font-mono text-emerald-400 bg-slate-950/80 px-1 rounded mt-0.5">Trilaterated Position</span>
              </div>

              {/* Connection Lines (Trilateration simulation) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="30%" y1="25%" x2="45%" y2="35%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3" />
                <line x1="75%" y1="65%" x2="45%" y2="35%" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3" />
              </svg>
            </div>

            {/* Side Beacon Signal Strengths Panel */}
            <div className="w-full lg:w-80 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-400" />
                <span>Trilateration Node Logs</span>
              </h3>

              <div className="space-y-3">
                {[
                  { name: "Beacon Room A", uuid: "FDA50693...", minor: "100", rssi: "-62 dBm", dist: "1.2m", color: "text-emerald-400" },
                  { name: "Beacon Corridor B", uuid: "FDA50693...", minor: "101", rssi: "-75 dBm", dist: "3.5m", color: "text-indigo-400" },
                  { name: "Beacon Entrance C", uuid: "FDA50693...", minor: "102", rssi: "-89 dBm", dist: "7.8m", color: "text-slate-500" }
                ].map((beacon, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-[10px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200">{beacon.name}</span>
                      <span className={beacon.color}>{beacon.rssi}</span>
                    </div>
                    <p className="text-slate-500 font-mono mt-1 text-[8px]">UUID: {beacon.uuid} (Min: {beacon.minor})</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900/60">
                      <span className="text-slate-400">Estimated Distance:</span>
                      <span className="font-bold text-slate-300">{beacon.dist}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 text-[9px] text-slate-400 flex gap-2">
                <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <p>Calculated dynamically using the log-distance path loss model: distance increases exponentially as signal strength (RSSI) weakens.</p>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {viewMode === 'gps' && (
          <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 rounded-xl p-3 backdrop-blur-md z-[1000] flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
              <span>Your Lost Items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
              <span>Your Found Items</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RadarMap;
