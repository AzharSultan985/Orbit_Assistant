import React from "react";     
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";  // ✅ must be here
import App from './App.jsx'
import { SystemProvider } from "./Context/orbitContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemProvider>

    <App />
    </SystemProvider>
  </StrictMode>,
)
