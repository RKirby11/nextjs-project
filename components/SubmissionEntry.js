"use client";
import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Camera from "/components/Camera.js";

export default function SubmissionEntry() {
    const uploadInput = useRef(null);
    const [useCamera, setUseCamera] = useState(false);
    const [fileURL, setFileURL] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [note, setNote] = useState(null);
    const [status, setStatus] = useState('upload');
    const [error, setError] = useState(null);
    const router = useRouter();

    const saveCameraImg = useCallback((url) => {
        setFileURL(url);
        setFileContent(url);
        setFileInfo({name: `screenshot-${Date.now()}.jpg`, type: "jpeg"})
        setUseCamera(false);
        setStatus('confirm');
    }, []);

    const saveUploadedImg = useCallback( async () => {
        if(uploadInput.current?.files && uploadInput.current.files.length > 0) {
            const file = uploadInput.current.files[0];
            const convertedFile = await convertToBase64(file);
            setFileURL(URL.createObjectURL(file));
            setFileInfo({name: file.name, type: file.type});
            setFileContent(convertedFile);
            uploadInput.current.value = "";
            setStatus('confirm');
        }
    }, []);

    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        });
    }, []);

    const reset = useCallback(() => {
        setFileURL(null);
        setFileInfo(null);
        setFileContent(null);
        setNote(null);
        setStatus('upload');
    }, []);

    const submit = useCallback(async() => {
        if(fileInfo && fileContent) {
            try {
                const form = new FormData();
                form.append('fileInfo', JSON.stringify(fileInfo));
                form.append('fileContent', fileContent);
                form.append('note', note);

                const response = await fetch("/api/submissions", {
                    method: 'POST',
                    body: form
                });

                if(response.ok) { 
                    setStatus('complete');
                }
                else {
                    throw new Error("Submission Failed");
                }
            } catch (error) {
                setError('Sorry, an error occurred uploading this submission. Please try again.');
            }
        }
    }, [fileInfo, fileContent, note]);

    return (
        <div className="flex flex-col items-center">
            <div>
                {
                    status === 'upload' && useCamera ?
                        <Camera useCamera={useCamera} saveCameraImg={saveCameraImg}></Camera> 
                    : status === 'upload' ?
                        <Image src="/camera.svg" width="300" height="300" alt='Camera Icon'/>
                    : status === 'confirm' ?
                        <>
                            <Image
                                alt="not found"
                                height="300"
                                width="300"
                                src={fileURL}
                            />
                            <div className="w-[300px] flex mt-5 flex-col align-center items-center">
                                <h2 className="text-2xl font-bold text-pink">Looks Great!</h2>
                                <textarea
                                    placeholder="Add a note?.."
                                    className="p-5 max-h-32 text-offblack bg-white w-full border-2 border-solid border-pink rounded-md mt-5 focus:outline-purple"
                                    onChange={(event) => setNote(event.target.value)}
                                ></textarea>
                                <button className="bg-pink w-full h-10 text-white rounded-sm mt-4" onClick={submit}>
                                    Submit!
                                </button>
                                <button className="w-1/2 flex justify-center items-center text-center mt-4 border-b-2 border-bottom hover:border-purple italic" onClick={() => reset()}>
                                    <Image src="/arrowLeft.svg" className='mr-2 mb-1' width="15" height="15" alt='Back Arrow'/>
                                    Back
                                </button>
                                <p className={`w-full mt-5 text-purple text-center ${ error ? "block" : "hidden"}`}>
                                    {error}
                                </p>
                            </div>
                        </>
                    : status === 'complete' ?
                        <>
                            <Image src="/greenTick.svg" width="300" height="300" alt='Green Tick Icon'/>
                            <p className={`w-full mt-5 text-xl text-purple text-center`}>
                                Submission Complete!
                            </p>
                            <div className="flex mt-5 flex-col align-center items-center">
                                <Link 
                                    className="bg-purple w-full h-10 text-white rounded-md mt-4 flex justify-center items-center" 
                                    href='/history'
                                >
                                    View Past Entries
                                </Link>
                            </div>
                        </>
                    : <></>
                }
            </div>
            <div className="flex mt-5">
                <div className={`flex ${status === 'upload' && !useCamera ? "block" : "hidden"}`}>
                    <label 
                        htmlFor="imageUpload" 
                        className="p-5 rounded-md bg-pink text-white cursor-pointer mr-5"
                    >
                        Upload Image
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        name="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        className="hidden"
                        ref={uploadInput}
                        onChange={(event) => saveUploadedImg(event.target.files[0])}
                    />
                </div>
                <div className={`flex ${ status === 'upload' ? "block" : "hidden"}`}>
                    <button 
                        className="p-5 rounded-md bg-pink text-white ml-5"  
                        onClick={() => setUseCamera(!useCamera)}
                    >
                        { useCamera ? "Stop Camera" : "Take Photo"}
                    </button>
                </div>
            </div>
        </div>
    );
};