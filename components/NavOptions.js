"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NavOptions() {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const logout = async () => {
        const response = await fetch("/api/auth/logout");
        const data = await response.json();
        router.push("/login");
    }
    const goTo = (path) => {
        router.push(path);
    }
    return ( 
        <>     
            <Image 
                src="/user.svg" 
                className="invert cursor-pointer" 
                width="40" 
                height="40" 
                alt='account' 
                onClick={() => setShowMenu(!showMenu)}
            />
            <div 
                className={`z-20 absolute top-20 right-5 w-64 p-5 bg-pink rounded-sm flex flex-col justify-center items-center text-offwhite text-2xl font-bold
                    ${showMenu ? "" : "hidden"}`
                }>
                    <button 
                        className="w-full border-offwhite border-2 border-solid hover:bg-white hover:text-pink p-2 rounded-sm mb-5"
                        onClick={() => goTo("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button 
                        className="w-full border-offwhite border-2 border-solid hover:bg-white hover:text-pink p-2 rounded-sm mb-5"
                        onClick={() => goTo("/submission")}
                    >
                        Submit Entry
                    </button>
                    <button 
                        className="w-full border-offwhite border-2 border-solid hover:bg-white hover:text-pink p-2 rounded-sm mb-5"
                        onClick={() => goTo("/history")}
                    >
                        Past Entries
                    </button>
                    <button 
                        className="w-full border-offwhite border-2 border-solid hover:bg-white hover:text-pink p-2 rounded-sm"
                        onClick={() => logout()}
                    >
                        Logout
                    </button>
            </div>
        </>  
    )
}