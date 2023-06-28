"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Camera from "/components/Camera.js";
import ImageCropper from './ImageCropper';
import readFile from '/utils/readFile.js';

export default function SubmissionEntry() {
    const uploadInput = useRef(null);
    const [useCamera, setUseCamera] = useState(false);
    const [uploadedImg, setUploadedImg] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [note, setNote] = useState(null);
    const [status, setStatus] = useState('upload');
    const [error, setError] = useState(null);

    const saveCameraImg = useCallback((base64Img) => {
        setFileContent(base64Img);
        setUseCamera(false);
        setStatus('confirm');
    }, []);

    const selectImage = async (e) => {
        const file = e.target.files[0];
        let imageUrl = await readFile(file);
        setUploadedImg(imageUrl);
        uploadInput.current.value = "";
    };

    const saveUploadedImg = useCallback( async (croppedImg) => {
        setFileContent(croppedImg);
        setStatus('confirm');
    }, []);

    const reset = useCallback(() => {
        setFileContent(null);
        setNote(null);
        setStatus('upload');
    }, []);

    const submit = useCallback(async() => {
        if(fileContent) {
            try {
                const form = new FormData();
                // form.append('fileInfo', JSON.stringify(fileInfo));
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
    }, [fileContent, note]);

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className='flex flex-col items-center'>
                {
                    status === 'upload' && useCamera ?
                        <Camera useCamera={useCamera} saveCameraImg={saveCameraImg}></Camera> 
                    : status === 'upload' ?
                        <Image src="/camera.svg" width="200" height="200" alt='Camera Icon'/>
                    : status === 'confirm' ?
                        <>
                            <Image
                                alt="not found"
                                height="200"
                                width="200"
                                src={fileContent}
                            />
                            <div className="w-[300px] flex mt-5 flex-col align-center items-center">
                                <h2 className="text-2xl font-bold text-pink">Looks Great!</h2>
                                <textarea
                                    placeholder="Add a note?.."
                                    maxLength="200"
                                    rows="2"
                                    className="p-2 resize-none text-offblack bg-white w-full border-2 border-solid border-pink rounded-md mt-5 focus:outline-purple"
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
                            <p className={`w-full mt-5 text-xl text-green font-bold text-center`}>
                                Submission Complete!
                            </p>
                            <div className="flex mt-5 flex-col align-center items-center">
                                <Link 
                                    className="bg-purple w-full h-10 px-4 text-white rounded-md mt-4 flex justify-center items-center" 
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
                        onChange={selectImage}
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
            <ImageCropper uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} onComplete={(croppedImg) => {saveUploadedImg(croppedImg)}}/>
        </div>
    );
};