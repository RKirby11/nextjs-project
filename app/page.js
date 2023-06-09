"use client";
import MatchBox from "/components/MatchBox.js"
import { useState } from "react";
import { Tooltip } from 'react-tooltip'
import { useRouter } from "next/navigation";

export default function Welcome() {
    const [unlocked, setUnlocked] = useState(false);
    const router = useRouter();
    const onSuccess = () => {
        setUnlocked(true);
    }
    const redirect = () => {
        if (unlocked) {
            router.push("/dashboard");
        }
    }
    return (
        <main className="z-10 absolute top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-offblack">
            <div className={`absolute transition-all duration-[2500ms] ease-out bg-pink ${unlocked ? "w-screen h-screen rounded-none" : "w-0 h-0 rounded-full blur-3xl"}`}></div>
            <div className="mb-16 text-center text-2xl z-10 text-offblack">
            <p className="font-semibold">Today's Word:
                <br/>
                <span className="text-4xl font-bold">WORD</span>
            </p>
            </div>
            <MatchBox onSuccess={onSuccess}></MatchBox>
            <div className={`w-64 border-solid border-2 p-4 rounded-xl flex justify-center text-2xl z-10 cursor-pointer 
                ${unlocked ? "border-offblack text-offblack hover:bg-offblack hover:text-offwhite group" : "border-pink text-pink"}`}
                onClick={redirect}
                data-tooltip-id="btn-tooltip"
                data-tooltip-content="Swipe the match along the matchbox to light it!"
                data-tooltip-place="bottom"
            >
                { unlocked ? "Let's Go!" : "Swipe to Unlock"}
            </div>
            <Tooltip id="btn-tooltip" className={`${unlocked ? "hidden" : ""}`}/>
        </main>
    )
}
