"use client";
import Image from 'next/image';
import { useState, useCallback, useRef } from 'react';
import { Spinner } from '@material-tailwind/react';
import ImageCropper from './ImageCropper';
import readFile from '/utils/readFile.js';

export default function UserAvatar({username, isEditable, userAvatar, setUserAvatar}) {
    const uploadInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [uploadedAvatar, setUploadedAvatar] = useState(null);


    const selectImage = async (e) => {
        if(isEditable) {
            const file = e.target.files[0];
            let imageUrl = await readFile(file);
            setUploadedAvatar(imageUrl);
        }
    };

    const uploadAvatar = useCallback(async (croppedImg) => {
        console.log('uploading avatar')
        if(isEditable) {
            setLoading(true);
            setError(false);
            try {
                const form = new FormData();
                form.append('file', croppedImg);
                const response = await fetch(`/api/users/${username}/avatar`, {
                    method: 'POST',
                    body: form
                });
                if(response.ok) { 
                    const data = await response.json();
                    setUserAvatar(data.avatarUrl);
                }
                else throw new Error();
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }
    }, [isEditable]);

    return (
        <div className='flex flex-col items-center'>
            {
                loading
                ? <Spinner color="indigo" className="h-12 w-12 my-10"/>
                : <>
                    <Image src={userAvatar} width="175" height="175" alt='User Avatar' className='mb-5 rounded-full'/>
                    <div className={`${isEditable ? "block" : "hidden"}`}>
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
                            onChange={selectImage}
                        />
                    </div>
                    <ImageCropper uploadedImg={uploadedAvatar} setUploadedImg={setUploadedAvatar} onComplete={(croppedImg) => {uploadAvatar(croppedImg)}}/>
                </>
            }
            <p className={`text-sm italic ${error ? "block" : "hidden"}`}>
                Sorry, something went wrong retrieving your avatar. Please try again later.
            </p>
        </div>
    )
}
