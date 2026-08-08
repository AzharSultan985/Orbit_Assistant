import { createContext, useContext, useEffect, useState } from "react";

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Backend_URL = import.meta.VITE_BACKEND_URL
  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3002/api/v1/system-info`);

      console.log("res", res);

      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch system info");

      setSystemInfo(data);
      console.log("data", data);

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
console.log("System Info State:", systemInfo);

  return (
    <SystemContext.Provider
      value={{
        systemInfo,
        loading,
        error,
        fetchSystemInfo
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used inside SystemProvider");
  }
  return context;
};

export default SystemContext;