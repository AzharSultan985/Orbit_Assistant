import axios from "axios";

export const toggleMicController = async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "enabled must be a boolean",
      });
    }

    console.log(
      `Sending MIC ${enabled ? "ON" : "OFF"} command to Python...`
    );

    const response = await axios.post(
      "http://127.0.0.1:5000/api/mic",
      {
        enabled,
      },
      {
        timeout: 5000,
      }
    );

    console.log("Python response:", response.data);

    return res.status(200).json({
      success: true,
      micEnabled: response.data.micEnabled,
    });

  } catch (error) {
    console.error(
      "Mic Controller Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not communicate with Python server",
    });
  }
};