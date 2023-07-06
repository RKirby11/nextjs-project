"use client";
import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@material-tailwind/react';
import FriendCard from '/components/FriendCard.js';

export default function FriendIndex() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        getFriends();
    }, []);

    const getFriends = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/users/friends', {
                method: 'GET',
            });
            if(response.ok) {
                const data = await response.json();
                setFriends(data.friends);
            }
            else throw new Error("Error retrieving friends");
        } catch (error) {
            setError(true);
        }
        setLoading(false);
    }, []);

    return (
        <div className='flex w-full h-full justify-center items-center'>
            {
                loading ?   <Spinner color="indigo" className="h-12 w-12"/> :
                error   ?   <p className="text-gray-500 text-lg italic">Sorry, there was an error loading. Please Try again later.</p> :
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {
                        friends.map((friend) => {
                            return <FriendCard friend={friend} key={friend.username} />
                        })
                    }
                </div>
            }
        </div>
    );
}