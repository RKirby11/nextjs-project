import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

// https://www.npmjs.com/package/react-webcam
// useEffect: runs when the component renders (similar to componentDidMount), but also on every re-render
// useCallback: returns a memoized (cached) callback, so that the function is not recreated on every render - optimising performance

export default function CustomWebcam({useCamera, saveCameraImg}) {
    const webcamRef = useRef(null);
    const [isShowVideo, setIsShowVideo] = useState(false);

    const videoConstraints = {
        width: 300,
        height: 300,
        facingMode: "user"
    }

    const capture = useCallback(
        () => {
            saveCameraImg(webcamRef.current.getScreenshot());
        },
        [webcamRef]
    );

    useEffect(() => {
        if(!useCamera) {
            let stream = webcamRef.current.stream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setIsShowVideo(false); 
        }
        else setIsShowVideo(true);
    });

    return (
        <div className="h-[300px] bg-cream relative">
            <div className="camView">
                {isShowVideo &&
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
                }
            </div>
            <button 
                className="absolute bottom-5 left-[130px] w-[40px] h-[40px] bg-cream rounded-full outline-double outline-white outline-4"
                onClick={capture}
            />
        </div>
    );
};
