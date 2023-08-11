import NavLink from "/components/nav/NavLink.js";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function NavMenu({showMenu, setShowMenu}) {
    const [showLinks, setShowLinks] = useState(false);
    useEffect(() => {
        if (showMenu) {
            const timeout = setTimeout(() => {
                setShowLinks(true);
            }, 100);
            return () => clearTimeout(timeout);
        }
        else {
            setShowLinks(false);
        }
    }, [showMenu]);

    return (
        <div 
            className={`z-40 transition-all transform duration-500 ease-in-out fixed bottom-0 right-0 w-full bg-red rounded-t-lg
            ${showMenu ? "h-3/5" : "h-0"}`}
        >
            { showMenu &&
                <div className={`pt-2 pb-5 transition-opacity transform duration-500 flex flex-col justify-center items-center
                    ${ showLinks ? "opacity-100" : "opacity-0"}`}>
                    <Image src="/icons/arrowDown.svg" width="45" height="45" alt="Arrow Down" className="mb-4" onClick={() => setShowMenu(false)}/>
                    <NavLink url="/dashboard" text="Home" src="/icons/home.svg"/>
                    <NavLink url="/dashboard" text="Profile" src="/icons/avatar.svg"/>
                    <NavLink url="/dashboard" text="Explore" src="/icons/world.svg"/>
                    <NavLink url="/friends" text="Friends" src="/icons/friends.svg"/>
                    <NavLink url="/login" text="Logout" src="/icons/exit.svg"/>
                </div>
            }
        </div>
    )
}