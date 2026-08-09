import os from "os";
import si from "systeminformation";

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
    // WI-FI
    // =========================
    const wifiConnections = await si.wifiConnections();

    const connectedWifi = wifiConnections.find(
      (wifi) =>
        wifi.ssid &&
        wifi.signalLevel !== undefined
    );

    // =========================
    // SIGNAL dBm
    // =========================
    const signalDbm =
      connectedWifi?.signalLevel ?? null;

    // =========================
    // SIGNAL %
    // =========================
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

    signal = Number(signal.toFixed(0));

    // =========================
    // DEBUG
    // =========================
    // console.log("WIFI:", {
    //   name: connectedWifi?.ssid || "Unknown",
    //   signalDbm,
    //   signal: `${signal}%`,
    // });

    // =========================
    // RESPONSE
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
          (totalRam / 1024 ** 3).toFixed(2)
        ),

        used: Number(
          (usedRam / 1024 ** 3).toFixed(2)
        ),

        free: Number(
          (freeRam / 1024 ** 3).toFixed(2)
        ),
      },

      // =========================
      // NETWORK STRENGTH ONLY
      // =========================
      network: {
        name:
          connectedWifi?.ssid ||
          "Unknown",

        signal,

        signalDbm,
      },
    });

  } catch (error) {
    console.error(
      "System Info Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to get system information",
      message: error.message,
    });
  }
};