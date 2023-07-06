"use client";
import UserAvatar from '/components/UserAvatar.js'
import UserBio from '/components/UserBio.js'
import AddFriend from '/components/AddFriend.js'
import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@material-tailwind/react';

export default function UserProfile({params}) {
    const userName = params.username;
    const [userAvatar, setUserAvatar] = useState("");
    const [userBio, setUserBio] = useState("");
    const [isSelf, setIsSelf] = useState(false);
    const [relationship, setRelationship] = useState("");
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
                else setUserAvatar("/avatarBlack.svg");
                if (data.userData.bio !== null) setUserBio(data.userData.bio);
                if (data.userData.relationship.status === 'self') setIsSelf(true);
                else setRelationship(data.userData.relationship);
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
            { error && <h1 className="text-xl font-bold text-center text-gray-400">Sorry, there was an error fetching this users data, please try again later.</h1>}
            <div className={`${loading || error ? "hidden" : "h-full flex flex-col items-center justify-around"}`}> 
                <h1 className="text-4xl text-offblack font-bold">{userName}</h1>
                <UserAvatar username={userName} isEditable={isSelf} userAvatar={userAvatar} setUserAvatar={setUserAvatar}></UserAvatar>
                <UserBio username={userName} isEditable={isSelf} userBio={userBio} setUserBio={setUserBio}></UserBio>
                { !isSelf && <AddFriend username={userName} relationship={relationship} setRelationship={setRelationship}></AddFriend>}
            </div>
        </main>
    );
}