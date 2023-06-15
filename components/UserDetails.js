"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Spinner } from '@material-tailwind/react';

export default function UserDetails({userName}) {
    const bioInput = useRef(null);
    const [bio, setBio] = useState('');
    const [error, setError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [bioLoading, setBioLoading] = useState(true);

    useEffect(() => {
        fetchBio();
    }, []);

    const fetchBio = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/profile/bio`);
            if(response.ok) {
                const data = await response.json();
                if (data.bio !== null) setBio(data.bio);
                setBioLoading(false);
            }
            else throw new Error("Fetch Failed");
        } catch (error) {
            setError(true);
        }
    },[]);

    const saveBio = useCallback(async () => {
        setBioLoading(true);
        setError(false);
        try {
            const response = await fetch(`http://localhost:8000/api/profile/bio`, {
                method: 'POST',
                body: JSON.stringify({bio: bioInput.current.value})
            });
            if(response.ok) {
                const data = await response.json();
                setBio(data.bio);
                setEditMode(false);
            }
            else throw new Error("Update Failed");
        } catch (error) {
            setError(true);
        }
        setBioLoading(false);
    });

    return (
        <div>
            <p><b>User Name:</b> {userName}</p>
            <div className='flex items-center'>
                <b>Bio:</b>
                <Image 
                    src={editMode ? '/saveIcon.svg' : '/editIcon.svg'} 
                    alt={editMode ? 'save icon' : 'edit icon'}
                    width={20} height={20} 
                    className={`cursor-pointer mb-1 ml-2 ${bioLoading ? 'hidden' : 'block'}`}
                    onClick={() => {editMode ? saveBio() : setEditMode(true)}}>    
                </Image>
            </div>
            {
                bioLoading
                ?   <div className='flex w-64 justify-center'>
                        <Spinner color="indigo" className="h-8 w-8 self-center"/>
                    </div>
                :   <textarea 
                        className={
                            `w-64 resize-none focus:outline-none 
                            ${editMode ? 'rounded-md p-2 border-offwhite border-2 border-offwhite focus:border-blue' : 'border-none'}`
                        } 
                        ref={bioInput}
                        defaultValue={bio}
                        placeholder={
                            editMode 
                            ? "Write your bio and click the save icon above to save it!" 
                            : "You haven't added a bio yet, click the edit icon above to add one!"
                        }
                        maxLength="200"
                        rows="2"
                        onChange={(e) => setBio(e.target.value)}
                        readOnly={editMode ? false : true}
                    />
            }
            <p className={`w-64  text-center text-pink italic ${error ? "block" : "hidden"}`}>
                Sorry, something went wrong retrieving your bio. Please try again later.
            </p>
        </div>
    )
}