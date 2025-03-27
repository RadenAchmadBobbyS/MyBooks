import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Chatbot from "./Chatbot";


export default function MainLayout() {



    return (
        <>
        <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
        <Outlet />
        </main>
        <Chatbot/>
        </div>
        </>
    )
}