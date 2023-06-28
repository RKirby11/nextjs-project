"use client";
import UserAvatar from '/components/UserAvatar.js'
import UserBio from '/components/UserBio.js'
import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@material-tailwind/react';

export default function UserProfile({params}) {
    const userName = params.username;
    const [userAvatar, setUserAvatar] = useState("");
    const [userBio, setUserBio] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${userName}`);
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.userData.avatar_url) setUserAvatar(data.userData.avatar_url);
                else setUserAvatar("/avatar.svg");
                if (data.userData.bio !== null) setUserBio(data.userData.bio);
                if (data.userData.is_current_user) setIsEditable(true);
            }
            else throw new Error("Fetch Failed");
        } catch (error) {
            setError(true);
        }           
        setLoading(false);
    },[]);

    return (
        <main className="h-[calc(100vh-10rem)] w-full flex justify-center items-center">
            { loading &&  <Spinner color="indigo" className="h-12 w-12 my-10"/> }
            { error && <h1 className="text-xl font-bold text-center">Sorry, there was an error fetching this users data, please try again later.</h1>}
            <div className={`${loading || error ? "hidden" : "h-full flex flex-col items-center justify-around"}`}> 
                <h1 className="text-4xl font-bold">{userName}</h1>
                <UserAvatar username={userName} isEditable={isEditable} userAvatar={userAvatar} setUserAvatar={setUserAvatar}></UserAvatar>
                <UserBio username={userName} isEditable={isEditable} userBio={userBio} setUserBio={setUserBio}></UserBio>
            </div>
        </main>
    );
}