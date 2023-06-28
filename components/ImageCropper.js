import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import getCroppedImg from '/utils/cropImage.js';

export default function ImageCropper({uploadedImg, setUploadedImg, onComplete}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const reset = useCallback(() => {
        setUploadedImg(null)
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    }, [setUploadedImg]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const returnCroppedImage = useCallback(async () => {
        const croppedImage = await getCroppedImg(uploadedImg, croppedAreaPixels, rotation);
        onComplete(croppedImage);
        reset();
    }, [uploadedImg, croppedAreaPixels, rotation]);

    return (
        <div>
            { uploadedImg && (
                <>
                    {/* modal template */}
                    <div className="absolute top-0 left-0 z-50 w-screen h-screen bg-offblack opacity-80"/>
                    <div className="absolute top-0 left-0 z-50 w-screen h-screen flex justify-center items-center">
                        <div className="relative h-5/6 w-5/6 bg-offwhite rounded-lg shadow-lg flex flex-col items-center p-4">
                            {/* image crop */}
                            <div className="relative h-5/6 w-full bg-offblack rounded-lg">
                                <Cropper
                                    image={uploadedImg}
                                    zoom={zoom}
                                    crop={crop}
                                    rotation={rotation}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className='w-full grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4 mx-8'>
                                <div className='flex w-full items-center'>
                                    <p className='mr-4'>ZOOM:</p>
                                    <Slider
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.01}
                                        aria-label="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                    />
                                </div>
                                <div className='flex w-full items-center'>
                                    <p className='mr-4'>ROTATION:</p>
                                    <Slider
                                        value={rotation}
                                        min={0}
                                        max={360}
                                        step={1}
                                        aria-label="Rotation"
                                        onChange={(e) => setRotation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='w-full flex justify-center items-center'>
                                <button className='bg-gray-500 text-white rounded-md px-2 py-1 font-bold text-lg my-5 hover:bg-purple w-32 mr-5' onClick={reset}>Go Back</button>
                                <button className='bg-pink text-white rounded-md px-2 py-1 font-bold text-lg my-5 hover:bg-purple w-32 ml-5' onClick={returnCroppedImage}>Upload</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}