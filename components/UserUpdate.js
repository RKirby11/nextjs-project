import Image from 'next/image'
import Link from 'next/link'

function SubmitEntryButton() {
    return (
        <Link href="/submission" className="bg-offblack w-full text-white text-lg font-bold drop-shadow-sm rounded-md py-2 px-4">
            Submit Today's Entry
        </Link>
    )
}

function SubmissionStreak() {
    return (
        <div className="bg-lgreen w-full text-white drop-shadow-sm rounded-md py-2 px-3">
            <p>Submission Streak: <b>3</b></p>
        </div>
    )
}

export default function UserUpdate({submissionComplete, avatarURL, userName}) {
    return (
        <div className="absolute -left-4 p-5 w-screen h-28 bg-cream drop-shadow-md flex">
            <Image 
                src={avatarURL} 
                width="80" 
                height="80" 
                alt="User Avatar" 
                className="rounded-full mr-4"
            />
            <div className="w-full">
                <p className="mb-2">{userName}</p>
                { submissionComplete 
                    ? <SubmissionStreak/>
                    : <SubmitEntryButton/>
                }
            </div>
        </div>
    )
}