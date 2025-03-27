import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export default function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoggin, setIsLoggin] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        setIsLoggin(!!token);
        setRole(userRole);
    }, [isLoggin]);

    const handleLogout = () => {
        localStorage.removeItem("name")
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggin(false);
        setRole(null);
        navigate("/login");
    };

    const toggleSearch = () => {
        setIsVisible(!isVisible)
    };
    
    return (
        <>
        <div className="navbar bg-white text-black">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-2xl font-mono hover:bg-transparent hover:border-white hover:text-black">My Books Library</Link>
            { role === "user" && ( 
                <>
                <Link to="/favorites" className="btn btn-ghost text-sm font-mono font-extralight border hover:bg-transparent hover:border-white hover:text-black">Favorites</Link>
                <Link to="/profile" className="btn btn-ghost text-sm font-mono font-extralight hover:bg-transparent hover:border-white hover:text-black">Profile</Link>
                </>
            )}

            {role === "admin" && (
                <Link to="/admin" className="btn btn-ghost text-sm font-mono font-extralight hover:bg-transparent hover:border-white hover:text-black">admin</Link>
            )}


            </div>
            <div className="flex gap-2">
            <div className="flex items-center">
                <button onClick={toggleSearch} className="btn btn-ghost btn-circle hover:bg-transparent hover:border-white hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                </button>

                {isVisible && (
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto bg-white border-black ml-2"/>
                )}
            </div>
            <div className="dropdown dropdown-end">

            </div>
            {isLoggin ? (
                        <button onClick={handleLogout} className="btn btn-ghost btn-circle hover:bg-transparent hover:border-white hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-ghost btn-circle hover:bg-transparent hover:border-white hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                            </svg>
                        </Link>
                    )}
            </div>
            </div>
        </>
    )
}