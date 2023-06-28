"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchUsers() {
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if ( text.length != 0 ) {
            const getData = setTimeout(() => {
                searchUsers(text);
            }, 1000);
            return () => clearTimeout(getData);
        }
    }, [text]);

    const searchUsers = async () => {
        const response = await fetch(`http://localhost:8000/api/users/search?query=${text}`);
        if(response.ok) {
            const data = await response.json();
            setUsers(data.users);
        }
    }

    const goToProfile = (user_name) => {
        router.push(`/users/${user_name}`);
    }

    return (
        <div className='relative flex flex-col w-96'>
            <input 
            type="text" 
            placeholder="Search Friends" 
            className="w-full h-10 p-2 border-2 text-offblack font-normal border-solid border-offwhite rounded focus:outline-none"
            onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute top-10 w-full bg-pink p-2">
                {
                    users.map((user) => {
                        return (
                            <div 
                                className="flex justify-between items-center font-normal text-black bg-offwhite rounded-md p-2 cursor-pointer hover:bg-white" 
                                key={user.id}
                                onClick={() => goToProfile(user.user_name)}
                            >
                                <div className='flex'>
                                    <Image 
                                        src={user.avatar_url || '/avatar.svg'} 
                                        alt="avatar" 
                                        width={25} height={25} 
                                        className="rounded-full mr-5"/>
                                    <p className='text-lg'>{user.user_name}</p>
                                </div>
                                <p className="italic text-slate-500">
                                {
                                    user.friendship_status == 'friends' ? "Friends"
                                    : user.friendship_status == 'sent' ? "Friend Request Sent"
                                    : ''
                                }
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}