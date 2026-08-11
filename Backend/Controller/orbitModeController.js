export const OrbitModeController = (req, res) => {
    const { mode } = req.body;

    if (!mode) {
        return res.status(400).json({
            success: false,
            message: "Mode is required"
        });
    }

    console.log("Orbit Mode:", mode);

    // Send mode to connected React clients
    req.io.emit("orbitMode", mode);

    return res.json({
        success: true,
        mode
    });
};