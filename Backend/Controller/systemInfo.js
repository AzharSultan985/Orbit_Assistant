  import os from "os";
  import { exec } from "child_process";

  export const getSystemInfo = (req, res) => {
    const cpuUsage = os.loadavg()[0]; // 1 min average
    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;

    // Windows disk info command
    exec("wmic logicaldisk get size,freespace", (error, stdout) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Disk info error" });
      }

      // Parse wmic output
      const lines = stdout.trim().split("\n").filter(line => line.trim() !== "" && !line.toLowerCase().includes("size"));
      
      let totalDisk = 0;
      let totalFree = 0;

      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const free = parseInt(parts[0], 10);
        const size = parseInt(parts[1], 10);

        if (!isNaN(free) && !isNaN(size)) {
          totalDisk += size;
          totalFree += free;
        }
      });

      const totalUsed = totalDisk - totalFree;

      res.json({
        cpu: {
          cores: os.cpus().length,
          load: cpuUsage
        },
        ram: {
          total: (totalRam / 1024 ** 3).toFixed(2) + " GB",
          used: (usedRam / 1024 ** 3).toFixed(2) + " GB",
          free: (freeRam / 1024 ** 3).toFixed(2) + " GB"
        },
        disk: {
          total: (totalDisk / 1024 ** 3).toFixed(2) + " GB",
          used: (totalUsed / 1024 ** 3).toFixed(2) + " GB",
          free: (totalFree / 1024 ** 3).toFixed(2) + " GB"
        }
      });
    });
  };
