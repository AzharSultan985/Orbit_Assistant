export const receiveOrbitLog = (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Log message is required",
      });
    }

    const logData = {
      message: String(message),
      timestamp: new Date().toLocaleTimeString(),
    };

    // Send log to all connected React clients
    req.io.emit("orbit:log", logData);

    // console.log(`[PYTHON] ${message}`);

    return res.status(200).json({
      success: true,
      data: logData,
    });
  } catch (error) {
    console.error("Orbit log controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to receive Orbit log",
    });
  }
};