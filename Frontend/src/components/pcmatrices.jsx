
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import SystemContext from "../Context/orbitContext";

// =====================================================
// LIVE GRAPH
// =====================================================

const LiveGraph = ({
  data = [],
  maxValue = 100,
  height = 65,
  stroke = "#22d3ee",
}) => {
  const width = 300;

  if (data.length < 2) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ height }}
      >
        <span className="text-cyan-400/30 text-[10px] font-mono">
          Collecting...
        </span>
      </div>
    );
  }

  // Make sure values are numbers
  const values = data.map((value) => {
    const number = Number(value);
    return Number.isFinite(number)
      ? Math.max(0, Math.min(number, maxValue))
      : 0;
  });

  const points = values.map((value, index) => {
    const x =
      (index / (values.length - 1)) * width;

    // HIGH value = TOP
    // LOW value = BOTTOM
    const percentage = value / maxValue;

    const y =
      height - percentage * height;

    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;

  // Current/latest point
  const lastValue = values[values.length - 1];

  const lastX = width;

  const lastY =
    height -
    (lastValue / maxValue) * height;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 border-t border-cyan-400/10" />

        <div className="absolute top-1/2 left-0 right-0 border-t border-cyan-400/10" />

        <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/10" />
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
        />

        {/* Current value dot */}
        <motion.circle
          cx={lastX}
          cy={lastY}
          r="3"
          fill={stroke}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Glow around current point */}
        <motion.circle
          cx={lastX}
          cy={lastY}
          r="6"
          fill="none"
          stroke={stroke}
          strokeOpacity="0.25"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </svg>
    </div>
  );
};

// =====================================================
// METRIC BOX
// =====================================================

const MetricBox = ({
  title,
  value,
  history,
}) => {
  return (
    <div className="p-4 border-r border-cyan-400/10 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            duration: 0.25,
          }}
          className="font-mono text-2xl text-cyan-100"
        >
          {Number(value).toFixed(1)}%
        </motion.span>
      </div>

      {/* Graph */}
      <div className="mt-3">
        <LiveGraph
          data={history}
          maxValue={100}
          height={65}
          stroke="#22d3ee"
        />
      </div>

      {/* Scale */}
      <div className="flex justify-between text-[9px] text-cyan-400/20 font-mono">
        <span>100%</span>
        <span>0%</span>
      </div>
    </div>
  );
};

// =====================================================
// NETWORK BOX
// =====================================================

const NetworkBox = ({
  strength,
  history,
}) => {
  return (
    <div className="p-4 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            duration: 0.25,
          }}
          className="font-mono text-2xl text-cyan-100"
        >
          {Number(strength).toFixed(0)}%
        </motion.span>
      </div>

      {/* Network Strength Graph */}
      <div className="mt-3">
        <LiveGraph
          data={history}
          maxValue={100}
          height={65}
          stroke="#22d3ee"
        />
      </div>

      {/* Scale */}
      <div className="flex justify-between text-[9px] text-cyan-400/20 font-mono">
        <span>100%</span>
        <span>0%</span>
      </div>
    </div>
  );
};

// =====================================================
// PC METRICS
// =====================================================

export default function PcMetrics() {
  const { systemInfo } =
    useContext(SystemContext);

  // ===================================================
  // HISTORY
  // ===================================================

  const [history, setHistory] =
    useState({
      cpu: [],
      ram: [],
      strength: [],
    });

  // ===================================================
  // UPDATE GRAPH HISTORY
  // ===================================================

  useEffect(() => {
    if (!systemInfo) return;

    // -------------------------
    // CPU
    // -------------------------

    const cpu = Number(
      systemInfo?.cpu?.usage || 0
    );

    // -------------------------
    // RAM
    // -------------------------

    const ramTotal =
      Number(systemInfo?.ram?.total) || 0;

    const ramUsed =
      Number(systemInfo?.ram?.used) || 0;

    const ram =
      ramTotal > 0
        ? (ramUsed / ramTotal) * 100
        : 0;

    // -------------------------
    // NETWORK STRENGTH
    // -------------------------

    const strength = Number(
      systemInfo?.network?.signal || 0
    );

    // -------------------------
    // SAVE HISTORY
    // -------------------------

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
    }));
  }, [systemInfo]);

  // ===================================================
  // CURRENT CPU
  // ===================================================

  const cpu = Number(
    systemInfo?.cpu?.usage || 0
  );

  // ===================================================
  // CURRENT RAM
  // ===================================================

  const ramTotal =
    Number(systemInfo?.ram?.total) || 0;

  const ramUsed =
    Number(systemInfo?.ram?.used) || 0;

  const ram =
    ramTotal > 0
      ? (ramUsed / ramTotal) * 100
      : 0;

  // ===================================================
  // CURRENT NETWORK STRENGTH
  // ===================================================

  const strength = Number(
    systemInfo?.network?.signal || 0
  );

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-2 bg-black">

      {/* CPU */}
      <MetricBox
        title="CPU Usage"
        value={cpu}
        history={history.cpu}
      />

      {/* RAM */}
      <MetricBox
        title="RAM Usage"
        value={ram}
        history={history.ram}
      />

      {/* NETWORK */}
      <NetworkBox
        strength={strength}
        history={history.strength}
      />

    </div>
  );
}
