"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavLink from "/components/NavLink.js";

export default function NavOptions({avatarURL}) {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const logout = async () => {
        await fetch("/api/auth/logout");
        router.push("/login");
    }

    return ( 
        <>     
            <Image
                src={avatarURL}
                width="40"
                height="40"
                alt='User Avatar'
                className="rounded-full mr-5"
            />
            <Image 
                src="/burgerMenu.svg" 
                className="invert cursor-pointer" 
                width="40" 
                height="40" 
                alt='Nav Toggle' 
                onClick={() => setShowMenu(!showMenu)}
            />
            
            <div 
                className={`z-20 absolute top-20 right-5 w-64 p-5 bg-pink rounded-sm flex flex-col justify-center items-center text-offwhite text-2xl font-bold
                    ${showMenu ? "" : "hidden"}`
                }>
                    <NavLink url="/profile" text="Profile"/>
                    <NavLink url="/dashboard" text="Dashboard"/>
                    <NavLink url="/submission" text="Submit Entry"/>
                    <NavLink url="/history" text="Past Entries"/>
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