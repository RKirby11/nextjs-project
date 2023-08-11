"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserCard from "/components/UserCard.js";

export default function SearchUsers({showSearch}) {
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const searchInput = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if ( text.length != 0 ) {
            const getData = setTimeout(() => {
                searchUsers(text);
            }, 500);
            return () => clearTimeout(getData);
        }
        else setUsers([]);
    }, [text]);

    const searchUsers = async () => {
        const response = await fetch(`http://localhost:8000/api/users/search?query=${text}`);
        if(response.ok) {
            const data = await response.json();
            setUsers(data.users);
        }
    }

    const goToProfile = (user_name) => {
        setText('');
        searchInput.current.value = '';
        router.push(`/users/${user_name}`);
    }

    return (
        <div className={`flex items-center justify-center h-full w-full`}>
            <input 
                ref={searchInput}
                type="text" 
                placeholder="Search Friends" 
                className={`h-1/2 p-2 transitional-all duration-500 rounded-md focus:outline-none text-offblack
                    ${showSearch ? "w-5/6" : "hidden"}`}
                onChange={(e) => setText(e.target.value)}
            />

            { showSearch && users.length > 0 &&
                <div className="z-40 absolute top-20 w-screen bg-red px-2 pb-2">
                    {   
                        users.map((user) => {
                            return <UserCard user={user} key={user.id} onClick={() => goToProfile(user.user_name)}/>
                        })
                    }
                </div>
            } 
        </div>
    )
}