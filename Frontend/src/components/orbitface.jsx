
import os from "os";
import { exec } from "child_process";

export const getSystemInfo = async (req, res) => {
  try {
    // =========================
    // CPU
    // =========================

    const cpus = os.cpus();

    const cpuUsage = await new Promise((resolve) => {
      const start = cpus.map((cpu) => ({
        idle: cpu.times.idle,
        total: Object.values(cpu.times).reduce(
          (a, b) => a + b,
          0
        ),
      }));

      setTimeout(() => {
        const end = os.cpus();

        let idle = 0;
        let total = 0;

        end.forEach((cpu, index) => {
          const currentIdle = cpu.times.idle;

          const currentTotal =
            Object.values(cpu.times).reduce(
              (a, b) => a + b,
              0
            );

          idle +=
            currentIdle - start[index].idle;

          total +=
            currentTotal - start[index].total;
        });

        resolve(
          total > 0
            ? ((1 - idle / total) * 100)
            : 0
        );
      }, 500);
    });

    // =========================
    // RAM
    // =========================

    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;

    // =========================
    // WINDOWS NETWORK
    // =========================

    const network = await new Promise(
      (resolve, reject) => {
        exec(
          `powershell -NoProfile -Command "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes | ConvertTo-Json -Compress"`,

          (error, stdout) => {
            if (error) {
              reject(error);
              return;
            }

            try {
              let data =
                JSON.parse(stdout.trim());

              // If only one adapter exists
              if (!Array.isArray(data)) {
                data = [data];
              }

              resolve(data);
            } catch (err) {
              reject(err);
            }
          }
        );
      }
    );

    // =========================
    // Select active adapter
    // =========================

    const activeNetwork =
      network.find(
        (item) =>
          Number(item.ReceivedBytes) > 0 ||
          Number(item.SentBytes) > 0
      );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      cpu: {
        usage: Number(
          cpuUsage.toFixed(2)
        ),
        cores: cpus.length,
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
          activeNetwork?.Name ||
          "Unknown",

        receivedBytes:
          Number(
            activeNetwork?.ReceivedBytes
          ) || 0,

        sentBytes:
          Number(
            activeNetwork?.SentBytes
          ) || 0,
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

