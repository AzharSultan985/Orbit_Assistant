import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import React from "react";
import MainHome from "./components/MainHome";
import {Routes,Route} from "react-router-dom"
import OrbitRes from "./components/orbitresponse";
import CodeRun from "./components/codeRun";
function App() {
  const [spinner, setspinner] = useState(false);
   if (!spinner) {
    return (
      <SplashScreen
        onFinish={() => setspinner(true)}
      />
    );
  }
  return (
    <>
     
<Routes>
 <Route
          path="/"
          element={<MainHome />}
        />
<Route  path="/max-orbit-screen" element={<OrbitRes/>}/>
<Route  path="/run-code" element={<CodeRun/>}/>




</Routes>
    </>
  );
}

export default App;
 