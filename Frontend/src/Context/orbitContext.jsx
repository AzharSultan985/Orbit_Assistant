import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SystemContext = createContext(null);

const BACKEND_URL = "http://localhost:3002";

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
});

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [MicEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [OrbitMode, setOrbitMode] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [orbitResponse, setOrbitResponse] = useState(null);

  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [orbitMaximized, setOrbitMaximized] = useState(false);

const [alert, setAlert] = useState({
  show: false,
  type: "success",
  title: "TASK SAVED",
  message: "Daily task has been added successfully.",
});
  // ==============================
  // SYSTEM INFO
  // ==============================

  const fetchSystemInfo = async () => {
    try {

      const res = await fetch(
        `${BACKEND_URL}/api/v1/orbit/system-info`
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error("Failed to fetch system info");
      }

      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
    } 
  };

  useEffect(() => {
    fetchSystemInfo();

    const interval = setInterval(() => {
      fetchSystemInfo();
    }, 6000);

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

      setOrbitResponse(
        {
          _id: Date.now() + Math.random(),
          type: "orbit",

          text: data.response,
        }
      );

    };
    const handleOrbit_VOICE_Response = (data) => {

      console.log("Orbit voice  response:", data);

      if (!data?.success) {
        return;
      }

      setOrbitResponse(
        {
          _id: Date.now() + Math.random(),
          type: data.type,

          text: data.response,
        }
      );

    };


    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("orbitMode", handleOrbitMode);
    socket.on("orbit:log", handleOrbitLog);
    socket.on("orbit:response",handleOrbitResponse);
    socket.on("orbit_voice:response",handleOrbit_VOICE_Response);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.off("orbitMode", handleOrbitMode);
      socket.off("orbit:log", handleOrbitLog);
      socket.off(
        "orbit:response",
        FetchConversation
      );
      socket.off(
        "orbit_voice:response",
        handleOrbit_VOICE_Response
      );
    };
  }, []);

  // ==============================
  // SEND MESSAGE TO NODE
  // ==============================

  const sendOrbitMessage = (message) => {
    if (!message?.trim()) return;
    console.log("message", message);

    socket.emit("user:message", {
      message: message.trim(),
      type: "user",
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






const FetchConversation = useCallback(async () => {
  try {
    

    const res = await fetch(
      `${BACKEND_URL}/api/v1/orbit/conversation`
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to fetch conversation");
    }

    setMessages(data.history);

  } catch (err) {
    setError(err.message);

  } finally {
  
  }
}, []);











// save tasks

  const HandleSaveTask = async (payload) => {
    try {
            setLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/api/v1/orbit/task-save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        
        setAlert({
          show: true,
          type: "success",
          message:  data.message,
        });
        HandleFetchTasks()
      }else{

      setAlert({
          show: true,
          type: "error",

          message: data.message,
        });
      }
    } catch (error) {
      console.error("task save  error:", error);
    }finally{
      setLoading(false);

    }
  };






const HandleFetchTasks = useCallback(async () => {
  try {
    

    const res = await fetch(
      `${BACKEND_URL}/api/v1/orbit/fetch-tasks`
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to fetch tasks");
    }
console.log(res)
       if (data.success) {
      setTasks(data.tasks);

    } else {
      setTasks([]);
    }

  } catch (err) {
    setError(err.message);

  }
}, []);

const HandleDeleteTask =async (id) => {
  try {
    setLoading(true);

    const res = await fetch(
      `${BACKEND_URL}/api/v1/orbit/delete-task/${id}`,{
        method:"delete"
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to delete tasks");
    }
    if (data.success) {
        
        setAlert({
          show: true,
          type: "success",
          message:  data.message,
        });
        HandleFetchTasks()
      }
      setAlert({
          show: true,
          type: "error",

          message: data.message,
        });

  } catch (err) {
    setError(err.message);

  } finally {
    setLoading(false);
  }
};



// console.log(tasks)



useEffect(()=>{
  HandleFetchTasks()
  // FetchConversation()
    },[])



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
        sendOrbitMessage, orbitResponse, FetchConversation, messages, setMessages,orbitMaximized, setOrbitMaximized,HandleSaveTask,tasks,HandleFetchTasks
        ,HandleDeleteTask,setAlert,alert
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