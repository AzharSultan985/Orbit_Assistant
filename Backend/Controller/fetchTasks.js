import Tasks from "../Model/tasksave.js";

export const FetchTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found",
        tasks: [],
      });
    }

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};