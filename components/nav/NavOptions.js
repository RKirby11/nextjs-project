"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavMenu from "/components/nav/NavMenu";
import SearchUsers from "/components/nav/SearchUsers.js";

export default function NavOptions() {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setShowMenu(false);
        setShowSearch(false);
    }, [pathname]);
    
    return ( 
        <>
            <div className='absolute top-0 left-0 w-full h-20 flex flex-row-reverse justify-start pr-4'>     
                <div className='h-full w-[3rem] flex justify-end'>            
                    <Image 
                        src="/icons/burgerMenu.svg" 
                        className="cursor-pointer" 
                        width="45" 
                        height="45" 
                        alt='Show Menu' 
                        onClick={() => {setShowMenu(!showMenu); setShowSearch(false);}}
                    />
                    <NavMenu showMenu={showMenu} setShowMenu={setShowMenu}/>
                </div>
                

                <div 
                    className={`h-full flex transition-all duration-500 ease-in-out bg-red
                         ${showSearch ? "w-[calc(100vw-5rem)]" : "w-[3rem] " }`}
                >
                    <Image 
                        src="/icons/search.svg"
                        className="cursor-pointer"
                        width="45"
                        height="45"
                        alt='Search Icon'
                        onClick={() => {setShowSearch(!showSearch); setShowMenu(false);}}
                    />
                    <SearchUsers showSearch={showSearch}/>
                </div>
                
            </div>  
            { 
                (showMenu || showSearch) &&
                <div 
                    className='z-20 absolute top-20 left-0 bg-offblack opacity-60 w-screen h-screen'
                    onClick={() => {setShowMenu(false); setShowSearch(false);}}></div>
            }
        </>
    )
}