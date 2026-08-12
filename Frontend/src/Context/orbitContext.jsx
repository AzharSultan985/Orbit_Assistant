import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SystemContext = createContext(null);

const BACKEND_URL = "http://localhost:3002";

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
});

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [MicEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [OrbitMode, setOrbitMode] = useState("idle");
  const [logs, setLogs] = useState([]);
const [orbitResponse, setOrbitResponse] = useState(null);
  // ==============================
  // SYSTEM INFO
  // ==============================

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BACKEND_URL}/api/v1/system-info`
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error("Failed to fetch system info");
      }

      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();

    const interval = setInterval(() => {
      fetchSystemInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==============================
  // SOCKET
  // ==============================

  useEffect(() => {
    const handleConnect = () => {
      console.log("React connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.log("React disconnected:", reason);
    };

    const handleOrbitMode = (mode) => {
      console.log("Orbit mode:", mode);
      setOrbitMode(mode);
    };

    const handleOrbitLog = (data) => {
      console.log("Orbit log:", data);

      setLogs((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now() + Math.random(),
          message: data.message,
          timestamp: data.timestamp,
        },
      ]);
    };



    const handleOrbitResponse = (data) => {

        console.log("Orbit response:", data);

        if (!data?.success) {
            return;
        }

        setOrbitResponse({
            id: Date.now() + Math.random(),
            type: "orbit",
            text: data.response,
            timestamp: data.timestamp,
        });
    };






    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("orbitMode", handleOrbitMode);
    socket.on("orbit:log", handleOrbitLog);
   socket.on(
        "orbit:response",
        handleOrbitResponse
    );
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.off("orbitMode", handleOrbitMode);
      socket.off("orbit:log", handleOrbitLog);
      socket.off(
            "orbit:response",
            handleOrbitResponse
        );
    };
  }, []);

  // ==============================
  // SEND MESSAGE TO NODE
  // ==============================

  const sendOrbitMessage = (message) => {
    if (!message?.trim()) return;
console.log("message",message);

    socket.emit("user:message", {
      message: message.trim(),
      type:"user",
      timestamp: new Date().toISOString(),
    });
  };

  // ==============================
  // MICROPHONE
  // ==============================

  const toggleMic = async () => {
    const enabled = !MicEnabled;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v2/orbit/mic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enabled,
          }),
        }
      );

      const data = await response.json();

      console.log("Python mic status:", data);

      if (data.success) {
        setMicEnabled(data.micEnabled);
      }
    } catch (error) {
      console.error("Mic control error:", error);
    }
  };
console.log("orbitResponse",orbitResponse);

  return (
    <SystemContext.Provider
      value={{
        systemInfo,
        loading,
        error,
        fetchSystemInfo,

        OrbitMode,
        setOrbitMode,

        MicEnabled,
        toggleMic,

        logs,

        // Socket message function
        sendOrbitMessage,orbitResponse
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);

  if (!context) {
    throw new Error(
      "useSystem must be used inside SystemProvider"
    );
  }

  return context;
};

export default SystemContext;