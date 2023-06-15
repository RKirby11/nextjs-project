"use client";
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import convertToBase64 from '/utils/convertToBase64.js';
import { Spinner } from '@material-tailwind/react';

export default function AvatarUpload({currentAvatarUrl}) {
    const uploadInput = useRef(null);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
    const uploadAvatar = useCallback( async () => {
        if(uploadInput.current?.files && uploadInput.current.files.length > 0) {
            setLoading(true);
            setError(false);
            try {
                const file = uploadInput.current.files[0];
                const form = new FormData();
                form.append('fileInfo', JSON.stringify({name: file.name, type: file.type}));
                form.append('fileContent', await convertToBase64(file));
                const response = await fetch("/api/profile/avatar", {
                    method: 'POST',
                    body: form
                });
                if(response.ok) { 
                    const data = await response.json();
                    setAvatarUrl(data.avatarUrl);
                }
                else throw new Error();
            } catch (error) {
                setError(true);
            }
            uploadInput.current.value = "";
            setLoading(false);
        }
    }, []);

    return (
        <div className='flex flex-col items-center'>
            {
                loading
                ? <Spinner color="indigo" className="h-12 w-12 my-10"/>
                : <>
                    <Image src={avatarUrl} width="175" height="175" alt='User Avatar' className='mb-5 rounded-full'/>
                    <label 
                        htmlFor="avatar-upload" 
                        className="cursor-pointer flex items-center hover:underline"
                    >
                        <Image src='/uploadIcon.svg' width="20" height="20" alt='upload icon' className='mb-1'/>
                        Upload New Profile Photo
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        name="avatar-upload"
                        accept=".png, .jpg, .jpeg"
                        className="hidden"
                        ref={uploadInput}
                        onChange={(event) => uploadAvatar(event.target.files[0])}
                    />
                </>
            }
            <p className={`text-pink italic ${error ? "block" : "hidden"}`}>
                Sorry, something went wrong retrieving your avatar. Please try again later.
            </p>
        </div>
    )
}
