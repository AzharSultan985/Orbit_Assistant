import React from 'react'

export default function Dailytask() {
  return (
    <>
      {/* <div className="w-full bg-[#102327]  text-green-400 font-mono"> */}
        <div className="bg-[#102327] border text-cyan-300 rounded-md shadow-lg w-[60vh] h-[41vh]  ">
          {/* Header */}
          <div className="flex justify-between  items-center px-3 py-2 border-b border-green-400">
            <h1 className="text-xl tracking-widest">[ Daily Tasks ]</h1>
            <button
              className="ml-2 border border-cyan-300 px-3 py-1 text-cyan-300 hover:bg-green-500 hover:text-black transition rounded-sm flex items-center gap-1"
            >
              <span className="text-lg font-bold">+</span> Add
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-cyan-300 flex items-center">
            <span className="mr-2"></span>
            <input
              className="w-full bg-transparent outline-none border-none text-green-300 placeholder-cyan-300"
              type="text"
              placeholder="[ search_task_here... ]"
            />
          </div>

          {/* Task List */}
          <div className="max-h-[28vh] overflow-y-auto custom-scroll px-2 py-1">
            <ul className="space-y-2 text-sm">
              
              <li className="flex justify-between items-center px-2 py-1 border-b border-green-900">
                <p>❯ Cricket</p>
                <button className="px-2 py-1 text-red-400 border border-red-500 hover:bg-red-500 hover:text-black transition text-xs rounded-sm">
                  x
                </button>
              </li>
            </ul>
          </div>
        </div>
      {/* </div> */}
    </>
  )
}
