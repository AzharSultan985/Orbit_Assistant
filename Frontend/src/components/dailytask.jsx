import React, { useContext, useEffect, useState } from "react";
import { X, Plus, Clock, CalendarDays, Bell, ChevronDown, ChevronRight } from "lucide-react";
import SystemContext from "../Context/orbitContext";

export default function Dailytask() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [task, setTask] = useState("");
  const [showDetails, setshowDetails] = useState(null);
  const { HandleSaveTask, tasks, HandleDeleteTask ,FetchConversation,HandleFetchTasks} = useContext(SystemContext);

const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
  const [time, setTime] = useState("");

    


  const handleAddTask = async () => {
    if (!task.trim() || !time) return;

    const newTask = {
      id: Date.now(),
      task: task.trim(),
      time,

    };

    // setTasks((prev) => [...prev, newTask]);
    await HandleSaveTask(newTask)
    // Reset fields
    setTask("");

    setTime("");


    setIsModalOpen(false);
  };

  const confirmDeleteTask = (task) => {
  setSelectedTask(task);
  setDeleteModalOpen(true);
};

const handleDeleteTask = async () => {
  if (!selectedTask?._id) return;

  try {
    await HandleDeleteTask(selectedTask._id);

    setDeleteModalOpen(false);
    setSelectedTask(null);
  } catch (error) {
    console.error("Delete task error:", error);
  }
};

  const toggleshowdetails = (id) => {
  setshowDetails((prev) => (prev === id ? null : id));
};
  return (
    <>
      {/* ==============================
          DAILY TASK PANEL
      ============================== */}

      <div className="relative bg-[#102327] border border-cyan-400/40 rounded-md shadow-lg w-[60vh] h-[41vh] text-cyan-300">

        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-green-400/50">

          <h1 className="text-xl tracking-widest">
            [ Daily Tasks ]
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="
              ml-2
              border border-cyan-300
              px-3 py-1
              text-cyan-300
              hover:bg-green-500
              hover:text-black
              transition
              rounded-sm
              flex items-center gap-1 cursor-pointer
            "
          >
            <Plus size={16} />
            Add
          </button>

        </div>


        {/* Task List */}
        <div className="max-h-[28vh] overflow-y-auto custom-scroll px-2 py-2">

          {tasks.length === 0 ? (

            <div className="h-40 flex flex-col items-center justify-center text-cyan-400/40">

              <CalendarDays size={28} />

              <p className="mt-2 text-sm">
                No daily tasks
              </p>

              <p className="text-xs">
                Add a task to get started
              </p>

            </div>

          ) : (

            <ul className="space-y-2 text-sm">

              {tasks.map((item) => (

                <li
                  key={item._id}
                  className="
                    group
                    px-2
                    py-2
                    border-b
                    border-green-900/60
                    hover:bg-cyan-400/5
                    transition
                  "
                >

                  <div className="flex justify-between items-center">

                    <div className="flex items-center gap-2 min-w-0" onClick={() => toggleshowdetails(item._id)}>
                  {showDetails !== item._id ? (
                        <ChevronRight
                          size={16}
                          strokeWidth={2}
                          className="text-green-400 cursor-pointer transition-transform"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          className="text-green-400 cursor-pointer transition-transform"
                        />
                      )}

                      <span className="truncate  cursor-pointer">
                        {item.task}
                      </span>

                    </div>

                    <button
                      onClick={() => confirmDeleteTask(item)}
                      className="
                        px-2
                        py-1
                        text-red-400
                        border border-red-500/60
                        hover:bg-red-500
                        hover:text-black
                        transition
                        text-xs
                        rounded-sm
                        cursor-pointer
                      "
                    >
                      x
                    </button>

                  </div>

               {showDetails === item._id && (
  <div className="flex items-center gap-4 ml-5 mt-1 text-[11px] text-cyan-400/60">
    <span className="flex items-center gap-1">
      <Clock size={11} />
      {item.time}
    </span>
  </div>
)}
                </li>

              ))}

            </ul>

          )}

        </div>

      </div>


      {/* ==============================
          ADD TASK MODAL
      ============================== */}


      {isModalOpen && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            p-4
          "
          onClick={() => setIsModalOpen(false)}
        >

          <div
            className="
              w-full
              max-w-md
              bg-[#0c1c1f]
              border
              border-cyan-400/40
              rounded-xl
              shadow-[0_0_40px_rgba(0,255,209,0.12)]
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-cyan-400/20
            ">

              <div>

                <h2 className="text-cyan-300 font-mono tracking-widest text-lg">
                  ADD TASK
                </h2>

                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Configure a reminder for Orbit
                </p>

              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  p-2
                  rounded-lg
                  text-slate-400
                  hover:text-red-400
                  hover:bg-red-400/10
                  transition
                "
              >
                <X size={18} />
              </button>

            </div>


            {/* Modal Body */}

            <div className="p-5 space-y-4">

              {/* Task */}

              <div>

                <label className="block text-xs font-mono text-cyan-400/70 mb-2">
                  TASK
                </label>

                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g. Play cricket"
                  autoFocus
                  className="
                    w-full
                    h-10
                    px-3
                    rounded-lg
                    bg-black/30
                    border border-cyan-400/30
                    text-white
                    placeholder:text-slate-600
                    outline-none
                    font-mono
                    text-sm
                    focus:border-cyan-400
                    focus:shadow-[0_0_12px_rgba(0,255,209,0.12)]
                  "
                />

              </div>


              {/* Date + Time */}

              <div className="grid grid-cols-2 gap-3">




                <div>

                  <label className="flex items-center gap-1 text-xs font-mono text-white mb-2">
                    <Clock size={12} />
                    TIME
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="
                      w-full
                      h-10
                      px-3
                      rounded-lg
                      bg-black/30
                      border border-cyan-400/30
                      text-white
                      outline-none
                      font-mono
                      text-sm
                      focus:border-cyan-400
                    "
                  />

                </div>

              </div>






            </div>


            {/* Modal Footer */}

            <div className="
              flex
              justify-end
              gap-2
              px-5
              py-4
              border-t
              border-cyan-400/20
              bg-black/10
            ">

              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border border-slate-600
                  text-slate-400
                  font-mono
                  text-sm
                  hover:bg-white/5
                 cursor-pointer
                  transition 
                "
              >
                Cancel
              </button>

              <button
                onClick={handleAddTask}
                className="
                  px-5
                  py-2
                  rounded-lg
                  border border-green-400/60
                  text-green-400
                  font-mono
                  text-sm
                  hover:bg-green-400
                  hover:text-black
                  disabled:opacity-30
                 cursor-pointer
                  transition 
                "
              >
                Save Task
              </button>

            </div>

          </div>

        </div>

      )}
{deleteModalOpen && (
  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      p-4
    "
    onClick={() => {
      setDeleteModalOpen(false);
      setSelectedTask(null);
    }}
  >
    <div
      className="
        w-full
        max-w-sm
        bg-[#0c1c1f]
        border
        border-red-400/40
        rounded-xl
        shadow-[0_0_40px_rgba(255,0,0,0.12)]
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-red-400/20">
        <h2 className="text-red-400 font-mono tracking-widest text-lg">
          DELETE TASK
        </h2>

        <p className="text-xs text-slate-500 mt-1 font-mono">
          Confirmation required
        </p>
      </div>

      {/* Body */}
      <div className="px-5 py-6">
        <p className="text-sm text-cyan-200 font-mono">
          Are you sure you want to delete this task?
        </p>

        {selectedTask && (
          <div className="mt-4 px-3 py-2 border border-cyan-400/20 rounded-lg bg-black/20">
            <p className="text-cyan-300 font-mono text-sm">
              {selectedTask.task}
            </p>

            <p className="text-xs text-cyan-400/50 mt-1">
              {selectedTask.time}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-5 py-4 border-t border-red-400/20">
        <button
          onClick={() => {
            setDeleteModalOpen(false);
            setSelectedTask(null);
          }}
          className="
            px-4
            py-2
            rounded-lg
            border border-slate-600
            text-slate-400
            font-mono
            text-sm
            hover:bg-white/5
            transition
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteTask}
          className="
            px-5
            py-2
            rounded-lg
            border border-red-400/60
            text-red-400
            font-mono
            text-sm
            hover:bg-red-400
            hover:text-black
            transition
            cursor-pointer
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}