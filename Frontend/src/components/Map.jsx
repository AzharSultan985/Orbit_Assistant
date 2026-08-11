import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

export default function OrbitMap() {
  const neonIcon = new L.DivIcon({
    className: "custom-marker",
    html: `<div class="w-3 h-3 rounded-full bg-cyan-400"></div>`,
  });

  return (
   <div className="relative w-[400px] h-[265px]">
  {/* Neon frame */}
  <svg
    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 300"
    preserveAspectRatio="none"
  >
    <polygon
      points="20,0 500,0 520,20 520,280 500,300 20,300 0,280 0,20"
      fill="transparent"
      stroke="#00eaff"
      strokeWidth="4"
      className="drop-shadow-[0_0_10px_#00eaff]"
    />

    {/* Top accent */}
    <line
      x1="40"
      y1="0"
      x2="100"
      y2="0"
      stroke="#00eaff"
      strokeWidth="4"
    />

    {/* Bottom accent */}
    <line
      x1="320"
      y1="300"
      x2="480"
      y2="300"
      stroke="#00eaff"
      strokeWidth="4"
    />

    {/* Right-side glow */}
    <line
      x1="520"
      y1="45"
      x2="520"
      y2="255"
      stroke="#00eaff"
      strokeWidth="5"
      className="drop-shadow-[0_0_12px_#00eaff]"
    />
  </svg>

  {/* Map */}
  <div className="absolute inset-0 bg-[#0a0f10] rounded-4xl overflow-hidden z-10">
    <MapContainer
      center={[33.6844, 73.0479]}
      zoom={5}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; CARTO"
      />

      <Marker position={[33.6844, 73.0479]} icon={neonIcon}>
        <Popup>
          <span className="font-mono text-xs text-green-400">
            ORBIT NODE
            <br />
            Status: ACTIVE ✅
          </span>
        </Popup>
      </Marker>

      <Circle
        center={[33.6844, 73.0479]}
        radius={100000}
        pathOptions={{
          color: "#00ffe7",
          fillColor: "#00ffd1",
          fillOpacity: 0.01,
        }}
      />
    </MapContainer>
  </div>
</div>
  );
}
