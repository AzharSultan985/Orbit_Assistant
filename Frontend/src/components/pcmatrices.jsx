
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SystemContext from "../Context/orbitContext";

// ========================================
// Live Graph Component
// ========================================

const LiveGraph = ({ data = [], maxValue = 100 }) => {
  const width = 300;
  const height = 45;

  // Not enough data yet
  if (data.length < 2) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className="text-cyan-400/30 text-[9px] font-mono">
          Collecting...
        </span>
      </div>
    );
  }

  // Convert values to SVG points
  const points = data.map((value, index) => {
    const x =
      (index / (data.length - 1)) * width;

    const safeValue = Math.max(
      0,
      Number(value) || 0
    );

    const y =
      height -
      (Math.min(safeValue, maxValue) / maxValue) *
        height;

    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* Graph Grid */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-0 left-0 right-0 border-t border-cyan-400/10" />

        <div className="absolute top-1/2 left-0 right-0 border-t border-cyan-400/10" />

        <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/10" />

      </div>

      {/* SVG */}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <motion.path
          d={linePath}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 0.4,
          }}
        />
      </svg>

    </div>
  );
};


// ========================================
// Normal Metric Box
// CPU / RAM
// ========================================

const MetricBox = ({
  title,
  value,
  history,
  unit = "%",
  maxValue = 100,
}) => {
  return (
    <div className="relative overflow-hidden p-4">

      {/* Header */}

      <div className="relative z-10 flex items-center justify-between">

        <h2 className="text-cyan-300 font-mono text-sm tracking-widest uppercase">
          {title}
        </h2>

        <motion.span
          key={value}
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="font-mono text-2xl text-cyan-100"
        >
          {Number(value || 0).toFixed(1)}
          {unit}
        </motion.span>

      </div>


      {/* Graph */}

      <div className="relative h-[65px] mt-3">

        <LiveGraph
          data={history}
          maxValue={maxValue}
        />

      </div>


      {/* Scale */}

      <div className="flex justify-between text-[9px] text-cyan-400/20 font-mono">

        <span>
          {maxValue}
          {unit}
        </span>

        <span>
          0{unit}
        </span>

      </div>

    </div>
  );
};


// ========================================
// Network Box
// Signal + Download
// ========================================

const NetworkBox = ({
  strength,
  download,
  strengthHistory,
  downloadHistory,
}) => {

  // Calculate download graph scale

  const maxDownload = Math.max(
    ...downloadHistory,
    Number(download) || 0,
    1
  );

  const downloadMax =
    Math.ceil(maxDownload / 5) * 5;


  return (
    <div className="relative overflow-hidden p-4">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="relative z-10 flex items-center justify-between">

        <h2 className="text-cyan-300 font-mono text-sm tracking-widest uppercase">
          Network
        </h2>

        <motion.span
          key={strength}
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="font-mono text-2xl text-cyan-100"
        >
          {Number(strength || 0).toFixed(0)}%
        </motion.span>

      </div>


      {/* ================================= */}
      {/* Signal Strength */}
      {/* ================================= */}

      <div className="mt-2">

        <div className="flex items-center justify-between">

          <span className="text-[9px] text-cyan-400/50 font-mono uppercase">
            Signal Strength
          </span>

          <span className="text-[9px] text-cyan-300/50 font-mono">
            {strength >= 80
              ? "Excellent"
              : strength >= 60
              ? "Good"
              : strength >= 40
              ? "Fair"
              : strength > 0
              ? "Weak"
              : "Unknown"}
          </span>

        </div>


        {/* Signal Graph */}

        <div className="relative h-[32px] mt-1">

          <LiveGraph
            data={strengthHistory}
            maxValue={100}
          />

        </div>

      </div>


      {/* Divider */}

      <div className="border-t border-cyan-400/10 my-1" />


      {/* ================================= */}
      {/* Download */}
      {/* ================================= */}

      <div>

        <div className="flex items-center justify-between">

          <span className="text-[9px] text-cyan-400/50 font-mono uppercase">
            Download
          </span>

          <span className="text-[9px] text-cyan-300 font-mono">
            {Number(download || 0).toFixed(2)} MB/s
          </span>

        </div>


        {/* Download Graph */}

        <div className="relative h-[32px] mt-1">

          <LiveGraph
            data={downloadHistory}
            maxValue={downloadMax}
          />

        </div>

      </div>


      {/* Scale */}

      <div className="flex justify-between text-[8px] text-cyan-400/20 font-mono mt-1">

        <span>
          {downloadMax} MB/s
        </span>

        <span>
          0 MB/s
        </span>

      </div>

    </div>
  );
};


// ========================================
// PC Metrics
// ========================================

export default function PcMetrics() {

  const { systemInfo } =
    useContext(SystemContext);


  // ========================================
  // Graph History
  // ========================================

  const [history, setHistory] = useState({
    cpu: [],
    ram: [],
    strength: [],
    download: [],
  });


  // ========================================
  // Update History
  // ========================================

  useEffect(() => {

    if (!systemInfo) return;


    // ========================================
    // CPU
    // ========================================

    const cpu = Number(
      systemInfo?.cpu?.usage || 0
    );


    // ========================================
    // RAM
    // ========================================

    const ramTotal = parseFloat(
      systemInfo?.ram?.total || "0"
    );

    const ramUsed = parseFloat(
      systemInfo?.ram?.used || "0"
    );

    const ram =
      ramTotal > 0
        ? (ramUsed / ramTotal) * 100
        : 0;


    // ========================================
    // Network Strength
    // ========================================

    const strength = Number(
      systemInfo?.network?.signal || 0
    );


    // ========================================
    // Download
    // ========================================

    const download = Number(
      systemInfo?.network?.download || 0
    );


    // ========================================
    // Save History
    // ========================================

    setHistory((previous) => ({

      cpu: [
        ...previous.cpu,
        cpu,
      ].slice(-40),

      ram: [
        ...previous.ram,
        ram,
      ].slice(-40),

      strength: [
        ...previous.strength,
        strength,
      ].slice(-40),

      download: [
        ...previous.download,
        download,
      ].slice(-40),

    }));

  }, [systemInfo]);


  // ========================================
  // Current CPU
  // ========================================

  const cpu = Number(
    systemInfo?.cpu?.usage || 0
  );


  // ========================================
  // Current RAM
  // ========================================

  const ramTotal = parseFloat(
    systemInfo?.ram?.total || "0"
  );

  const ramUsed = parseFloat(
    systemInfo?.ram?.used || "0"
  );

  const ram =
    ramTotal > 0
      ? (ramUsed / ramTotal) * 100
      : 0;


  // ========================================
  // Current Network
  // ========================================

  const strength = Number(
    systemInfo?.network?.signal || 0
  );

  const download = Number(
    systemInfo?.network?.download || 0
  );


  // ========================================
  // Render
  // ========================================

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-2 bg-black">

      {/* ================================= */}
      {/* CPU */}
      {/* ================================= */}

      <MetricBox
        title="CPU Usage"
        value={cpu}
        history={history.cpu}
        unit="%"
        maxValue={100}
      />


      {/* ================================= */}
      {/* RAM */}
      {/* ================================= */}

      <MetricBox
        title="RAM Usage"
        value={ram}
        history={history.ram}
        unit="%"
        maxValue={100}
      />


      {/* ================================= */}
      {/* NETWORK */}
      {/* ================================= */}

      <NetworkBox
        strength={strength}
        download={download}
        strengthHistory={history.strength}
        downloadHistory={history.download}
      />

    </div>
  );
}

