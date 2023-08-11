"use client";
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

function StaticBio({userBio}) {
    return (
        <div className="flex flex-col items-center">
            {
                userBio
                ?  <p>{userBio}</p>
                :  <p className="text-gray-400">User has not added a bio yet.</p>
            }
        </div>
    )
}

function EditableBio({username, userBio, setUserBio}) {
    const bioInput = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [bioUpdating, setBioUpdating] = useState(false);
    const [error, setError] = useState(false);
    
    const saveBio = useCallback(async () => {
        setBioUpdating(true);
        setError(false);
        try {
            const response = await fetch(`/api/users/${username}/bio`, {
                method: 'POST',
                body: JSON.stringify({bio: bioInput.current.value})
            });
            if(response.ok) {
                const data = await response.json();
                setUserBio(data.bio);
                setEditMode(false);
            }
            else throw new Error("Update Failed");
        } catch (error) {
            setError(true);
        }
        setBioUpdating(false);
    });

    return (
        <>                
            {
                bioUpdating
                ?   <div className='flex w-64 justify-center text-blue'>
                        <CircularProgress color="inherit" className="h-8 w-8 self-center"/>
                    </div>
                :   <>
                        <div className='flex w-64 justify-center'>
                            <Image 
                                src={editMode ? '/icons/save.svg' : '/icons/edit.svg'} 
                                alt={editMode ? 'save icon' : 'edit icon'}
                                width={20} height={20} 
                                className="cursor-pointer mb-1 mr-2"
                                onClick={() => {editMode ? saveBio() : setEditMode(true)}}>    
                            </Image>
                            <b>Your Bio:</b>
                        </div>
                        <textarea 
                            className={
                                `mt-2 w-full resize-none focus:outline-none rounded-md p-2 border-2 
                                ${editMode ? 'border-blue' : 'border-cream'}`
                            } 
                            ref={bioInput}
                            defaultValue={userBio}
                            placeholder={
                                editMode 
                                ? "Click the save icon above to save your bio!" 
                                : "Click the edit icon above to add a bio!!"
                            }
                            maxLength="200"
                            rows="2"
                            readOnly={editMode ? false : true}
                        />
                        <p className={`w-64 text-sm text-center italic ${error ? "block" : "hidden"}`}>
                            Sorry, something went wrong updating your bio. Please try again later.
                        </p>
                    </>
            }
           
        </>
    );
}

export default function UserBio({username, isEditable, userBio, setUserBio}) {
    return (
        <div>
            {
                isEditable
                ?   <EditableBio username={username} userBio={userBio} setUserBio={setUserBio}></EditableBio>
                :   <StaticBio userBio={userBio}></StaticBio>
            }
        </div>
    )
}