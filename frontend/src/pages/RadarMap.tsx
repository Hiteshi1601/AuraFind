import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Info } from 'lucide-react';
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Interactive Radar Map</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">GPS Geofences</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Geographical distribution of your reported lost and found items.</p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 relative min-h-[400px]">
        {items.length > 0 ? (
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
          <div className="w-full h-full bg-slate-950/40 border border-slate-850 flex flex-col items-center justify-center text-slate-500 gap-3">
            <MapPin size={48} className="text-slate-600 animate-pulse" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-400">No Items Logged Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Use the Match Wizard to report a lost item, and its GPS coordinates will map automatically.</p>
            </div>
          </div>
        )}

        {/* Legend */}
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
      </div>
    </div>
  );
}

export default RadarMap;
