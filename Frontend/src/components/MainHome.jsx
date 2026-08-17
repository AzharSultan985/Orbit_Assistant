import React, { useState } from "react";

import OrbitRes from "./orbitresponse";
import PcMetrics from "./pcmatrices";
import OrbitMap from "./Map";
import Dailytask from "./dailytask";
import ChooseMIC_Lis from "./chooseMIC";
import NetworkAndSettings from "./systemcontrol";
import OrbitFace from "./orbitface";
import AIProcessPanel from "./Atprocesspanel";

export default function MainHome() {

  const [orbitMaximized, setOrbitMaximized] = useState(false);

  return (
    <main className="w-screen h-screen box-border overflow-hidden text-white p-3">

      {/* =================================================
          NORMAL DASHBOARD
      ================================================= */}

      <div className="w-full h-full min-h-0 grid grid-cols-[0.8fr_1fr_0.75fr] gap-3">

        {/* COLUMN 1 */}
        <section className="min-w-0 min-h-0 h-full grid grid-rows-[1fr_0.2fr_1fr] gap-3">

          <div className="rounded-2xl mr-2 overflow-hidden">
            <OrbitMap />
          </div>

          <div className="rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center gap-8">
              <NetworkAndSettings />
              <ChooseMIC_Lis />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden">
            <Dailytask />
          </div>

        </section>


        {/* COLUMN 2 */}
        <section className="min-w-0 min-h-0 h-full grid grid-rows-[0.5fr_1.5fr_0.8fr] gap-3">

          <div className="rounded-2xl overflow-hidden">
            <PcMetrics />
          </div>

          <div className="rounded-2xl flex items-center justify-center overflow-hidden">
            <OrbitFace />
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <AIProcessPanel />
          </div>

        </section>


        {/* COLUMN 3 */}
        <section className="min-w-0 min-h-0 h-full rounded-2xl overflow-hidden">

          <OrbitRes
            maximized={orbitMaximized}
            onMaximize={() => setOrbitMaximized(true)}
            onMinimize={() => setOrbitMaximized(false)}
          />

        </section>

      </div>


      {/* =================================================
          FULLSCREEN ORBIT RESPONSE
      ================================================= */}

      {orbitMaximized && (

        <div className="fixed inset-0 z-[9999] bg-black">

          <OrbitRes
            maximized={true}
            onMaximize={() => {}}
            onMinimize={() => setOrbitMaximized(false)}
          />

        </div>

      )}

    </main>
  );
}