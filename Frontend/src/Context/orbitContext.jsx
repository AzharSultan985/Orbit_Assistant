import { createContext, useContext, useEffect, useState } from "react";

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${Base_URL_Backend}/api/system-info`);
      if (!res.ok) throw new Error("Failed to fetch system info");
      const data = await res.json();
      console.log('data',data);
      
      setSystemInfo(data.cpu);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  
 useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000); // every 5 sec
    return () => clearInterval(interval);
  }, []);
 

  return (
    <SystemContext.Provider
      value={{
        systemInfo,
        loading,
        error,
        refresh: fetchSystemInfo
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