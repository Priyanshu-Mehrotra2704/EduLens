import { Home, Settings, ChevronLeft, ChevronRight, LayoutDashboard, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import myimage from '../assets/edulens (2).png'

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();

    // 🔥 Auto-collapse on small screens (below 640px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setOpen(false);   // mobile → collapsed
            } else {
                setOpen(true);    // desktop → expanded
            }
        };

        handleResize(); // run on mount

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin_dashboard" },
        { name: "Upload Marking", icon: FileText, path: "/upload-marking" },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    return (
        <div
            className={`h-screen text-black transition-all duration-300
            ${open ? "w-64" : "w-16"} border-r border-gray-700 bg-gradient-to-r from-[#207dff] to-[#0fc6b4] hover:shadow-xl sticky top-0`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between ">
                {open && (
                    <h1 className="text-xl font-bold p-2 pl-10">
                        <img src={myimage} alt="logo" className="h-13 mt-5" />
                    </h1>
                )}

                <button
                    onClick={() => setOpen(!open)}
                    className={`${open ? "mr-1" : "ml-2.5"} p-1 rounded hover:bg-blue-500 mt-5`}
                >
                    {open ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>

            {/* Menu Items */}
            <ul className="mt-4 space-y-3">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2 font-medium cursor-pointer transition-colors
                                ${
                                    isActive
                                        ? "bg-[#0B2C59] text-white"
                                        : "hover:bg-[#14bccf] hover:text-white"
                                }`}
                            >
                                <item.icon size={20} />
                                {open && <span>{item.name}</span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;
