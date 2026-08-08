import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import React from "react";
import MainHome from "./components/MainHome";
function App() {
  const [spinner, setspinner] = useState(false);
  return (
    <>
      {!spinner
       ? <SplashScreen onFinish={() => setspinner(true)} /> :
<MainHome></MainHome> }
    </>
  );
}

export default App;
