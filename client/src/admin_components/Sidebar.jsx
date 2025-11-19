import { Home, Settings, ChevronLeft, ChevronRight, LayoutDashboard, FileText, UploadIcon } from 'lucide-react'
import { useState } from 'react'
import myimage from '../assets/edulens_logo.png'

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    return (
    <div
      className={`h-screen text-black transition-all duration-300
      ${open ? "w-64" : "w-16"} border-r border-gray-700 bg-[#0fc6b4]`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between ">
        {open && <h1 className="text-xl font-bold p-2 pl-10">
            <img src={myimage} alt="logo" className="h-10 mt-5" />
            </h1>}

        <button
          onClick={() => setOpen(!open)}
          className={`${open ? "mr-1" : "ml-2.5"} p-1 rounded hover:bg-blue-500 mt-5`}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="mt-4 space-y-3">
        <li className="flex items-center gap-3 px-4 py-2 hover:bg-[#0B2C59] font-medium hover:text-white cursor-pointer">
          <LayoutDashboard size={20} />
          {open && <span>Dashboard</span>}
        </li>
        <li className="flex items-center gap-3 px-4 py-2 hover:bg-[#0B2C59] font-medium hover:text-white cursor-pointer">
          <UploadIcon size={20} />
          {open && <span>Upload&nbsp;Marking</span>}
        </li>

        <li className="flex items-center gap-3 px-4 py-2 hover:bg-[#0B2C59] font-medium hover:text-white cursor-pointer">
          <Settings size={20} />
          {open && <span>Settings</span>}
        </li> 
      </ul>
    </div>
  )
}

export default Sidebar