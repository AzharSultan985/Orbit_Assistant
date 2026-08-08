
import os from "os";
import si from "systeminformation";

// Keep previous network counters in memory
let previousRx = null;
let previousTx = null;
let previousTime = null;

export const getSystemInfo = async (req, res) => {
  try {
    // =========================
    // CPU
    // =========================

    const cpu = await si.currentLoad();

    // =========================
    // RAM
    // =========================

    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;

    // =========================
    // Wi-Fi
    // =========================

    const wifiConnections = await si.wifiConnections();

    const connectedWifi = wifiConnections.find(
      (wifi) =>
        wifi.ssid &&
        wifi.signalLevel !== undefined
    );

    const signalDbm =
      connectedWifi?.signalLevel ?? null;

    let signal = 0;

    if (signalDbm !== null) {
      signal = Math.min(
        100,
        Math.max(
          0,
          2 * (signalDbm + 100)
        )
      );
    }

    // =========================
    // Network Interfaces
    // =========================

    const interfaces = await si.networkInterfaces();

    // Find active Wi-Fi / Ethernet interface
    const activeInterface = interfaces.find(
      (item) =>
        item.operstate === "up" &&
        !item.internal &&
        item.iface &&
        item.ip4
    );

    // =========================
    // Network Stats
    // =========================

    const stats = await si.networkStats();

    const activeStats = stats.find(
      (item) =>
        item.iface === activeInterface?.iface
    );

    // Total bytes
    const currentRx =
      Number(activeStats?.rx_bytes) || 0;

    const currentTx =
      Number(activeStats?.tx_bytes) || 0;

    const currentTime = Date.now();

    let download = 0;
    let upload = 0;

    // =========================
    // Calculate Speed
    // =========================

    if (
      previousRx !== null &&
      previousTime !== null
    ) {
      const timeDiff =
        (currentTime - previousTime) / 1000;

      if (timeDiff > 0) {
        const rxDiff =
          currentRx - previousRx;

        const txDiff =
          currentTx - previousTx;

        // Bytes/sec -> MB/sec
        download =
          rxDiff > 0
            ? rxDiff /
              timeDiff /
              1024 /
              1024
            : 0;

        upload =
          txDiff > 0
            ? txDiff /
              timeDiff /
              1024 /
              1024
            : 0;
      }
    }

    // Save current values
    previousRx = currentRx;
    previousTx = currentTx;
    previousTime = currentTime;

    // =========================
    // Debug
    // =========================

    console.log("NETWORK:", {
      interface: activeInterface?.iface,
      rxBytes: currentRx,
      txBytes: currentTx,
      download: download.toFixed(2),
      upload: upload.toFixed(2),
    });

    // =========================
    // Response
    // =========================

    return res.status(200).json({
      success: true,

      cpu: {
        usage: Number(
          cpu.currentLoad.toFixed(2)
        ),
        cores: os.cpus().length,
      },

      ram: {
        total: Number(
          (
            totalRam /
            1024 ** 3
          ).toFixed(2)
        ),

        used: Number(
          (
            usedRam /
            1024 ** 3
          ).toFixed(2)
        ),

        free: Number(
          (
            freeRam /
            1024 ** 3
          ).toFixed(2)
        ),
      },

      network: {
        name:
          connectedWifi?.ssid ||
          activeInterface?.iface ||
          "Unknown",

        signal: Number(
          signal.toFixed(0)
        ),

        signalDbm,

        download: Number(
          download.toFixed(2)
        ),

        upload: Number(
          upload.toFixed(2)
        ),

        downloadUnit: "MB/s",
        uploadUnit: "MB/s",
      },
    });

  } catch (error) {
    console.error(
      "System Info Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to get system information",
      message: error.message,
    });
  }
};

