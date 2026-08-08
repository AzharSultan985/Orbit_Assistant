import React, { useContext, useEffect } from "react";
import SidebarLayout from "./sidebar";
import ChooseToPrompt from "./orbitresponse";
import PcMetrics from "./pcmatrices";
import OrbitRes from "./orbitresponse";
import OrbitMap from "./Map";
import Dailytask from "./dailytask";
import ChooseMIC_Lis from "../chooseMIC";
import ChooseSpeak from "../chooseSpeaker";
import OrbitFace from "./orbitface";
import UserPrompt from "./userPrompt";

import NetworkAndSettings from "./systemcontrol";
import AIProcessPanel from "./Atprocesspanel";
import SystemContext from '../Context/orbitContext'



export default function MainHome() {
  const {systemInfo}=useContext(SystemContext)
  console.log('systemInfo',systemInfo);
  
  return (
    <>
    
    <section className="w-screen h-screen flex   flex-row">
{/* <div className="w-screen h-7 border-b-2 border-green-400">
<div className="text-green-500 font-semibold px-4">
Setting
<i class="fa fa-cogs" ></i>

</div>
</div>
  */}
    {/* <i class="fa fa-cogs" aria-hidden="true"></i> */}
<div >

<div className="   h-[50vh] w-[55vh] px-2"><OrbitRes/>


</div>

 {/* Mic Toggle fixed bottom-center */}
  <div className="  m-1  w-[51vh] h-12 items-center flex justify-center  gap-6 ">
<NetworkAndSettings />
    <ChooseMIC_Lis />
  </div>

<div className=" h-[41vh] w-[60vh] justify-center items-center flex">
  {<Dailytask></Dailytask>}
</div>


</div>


<div class="grid grid-cols-2 grid-rows-3 gap-4 h-screen p-2">
  {/* <!-- Top row --> */}
  {/* <div class="  ">   </div> */}
  {/* Top Center */}
  <div class="    ">
    

    {<PcMetrics/>}
  </div>
  <div class="    h-[45vh]">
{<OrbitMap/>}
 
  </div>

  {/* <!-- Middle row --> */}
  <div class="p-2 flex mb-4  justify-center">
    <OrbitFace/>
    </div> 
  <div class="  h-[30vh] mt-8 ">

     <AIProcessPanel state={"idle"} />
</div>

  {/* <!-- Bottom row --> */}
  <div class="  flex items-center justify-center"><UserPrompt/></div>
  <div class=" border ">Bottom Center</div>
  {/* <div class=" border flex items-center justify-center">Bottom Right</div> */}
</div>







    </section>
    
    
    
    
    
    
    
    </>
  );
}
