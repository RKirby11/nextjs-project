"use client";
import TextButton from '/components/TextButton.js';
import { useState, useCallback } from 'react';
import { Spinner } from "@material-tailwind/react";

function getText(relationship) {
    switch (relationship) {
        case 'friends':
            return "You are friends with this user.";
        case 'request sent':
            return "You have sent a friend request to this user.";
        case 'request received':
            return "This user has sent you a friend request.";
        case 'not friends':
            return "You are not friends with this user.";
        default:
            return
    }
};

function UpdateOptions({relationship, action}) {
    switch (relationship) {
        case 'friends':
            return <TextButton text="Unfriend" color="red-900" img="/redCross.svg" action={() => action('unfriend')} />
        case 'request sent':
            return <TextButton text="Cancel Request" color="red-900" img="/redCross.svg" action={() => action('cancel request')}/>
        case 'request received':
            return ( 
                <>
                    <TextButton text="Accept Request" color="blue" img="/blueTick.svg" action={() => action('accept request')}/>
                    <TextButton text="Reject Request" color="red-900" img="/redCross.svg" action={() => action('reject request')}/>
                </> 
            ) 
        case 'not friends':
            return <TextButton text="Send Friend Request" color="green" img="/greenPlus.svg" action={() => action('send request')}/>
        default:
            return
    }
}

export default function AddFriend({username, relationship, setRelationship}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const updateRelationship = useCallback(async (updateType) => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch(`http://localhost:8000/api/users/${username}/friendship`, {
                method: 'POST',
                body: JSON.stringify({action: updateType, relationship: relationship}),
            });
            if(response.ok) {
                const data = await response.json();
                setRelationship(data.updatedRelationship);
            }
            else throw new Error("Update Failed");
        } catch (error) {
            setError(true);
        }
        setLoading(false);
    }, [relationship]);

    return (
        <div className="flex flex-col items-center justify-center h-12">
            { 
                loading 
                ?   <Spinner color="indigo" className="h-10 w-10"/> 
                :   <>
                        <p className='text-gray-700 mb-2'>{getText(relationship.status)}</p>
                        <UpdateOptions relationship={relationship.status} action={(updateType) => updateRelationship(updateType)} />
                    </>
            }
            <p className="text-purple">{error && "Sorry, we were unable to complete this action, please try again later."}</p>
        </div>
    );
}