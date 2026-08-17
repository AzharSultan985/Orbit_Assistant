import React from "react";     
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";  // ✅ must be here
import App from './App.jsx'
import { SystemProvider } from "./Context/orbitContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <>
  <StrictMode>
    <SystemProvider>

  <BrowserRouter>
    <App />
  </BrowserRouter>
    </SystemProvider>
  </StrictMode>

  </>

)
