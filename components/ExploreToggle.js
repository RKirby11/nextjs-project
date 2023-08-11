import Image from 'next/image';
import Link from 'next/link';
import ImageCard from '/components/ImageCard.js';

function LockedView() {
    return (
        <div className="flex flex-col justify-between h-full p-4 pb-6">
            <div className="h-20 flex items-center">
                <Image src="/icons/lock.svg" width="50" height="50" alt="lock icon" className='mr-3'/>
                <p>
                    You can view other people's submissions once you've submitted your own.
                </p>
            </div>
            <div className="w-full h-[calc(100%-6.5rem)] grid grid-cols-2 auto-rows-fr gap-2">
                <ImageCard imageURL="/images/example1.jpeg" altText="Example" locked={true}/>
                <ImageCard imageURL="/images/example3.jpeg" altText="Example" locked={true}/>
                <ImageCard imageURL="/images/example4.jpeg" altText="Example" locked={true}/>
                <ImageCard imageURL="/images/example2.jpeg" altText="Example" locked={true}/>
            </div>
        </div>
    )
}

function UnlockedView() {
    return (
        <Link href="#" className="h-full w-full p-4 pb-6 flex justify-between items-center">
            <Image src="/icons/arrowRight.svg" width="50" height="50" alt="lock icon" className='mr-3'/>
            <p>
                Check out other submissions from today!
            </p>
        </Link>
    )
}


export default function ExploreToggle({submissionComplete}) {
    return (
        <div className={`fixed mt-2 -bottom-2 right-0 bg-blue text-white w-screen rounded-t-xl
            ${submissionComplete? "h-24" : "h-[calc(100vh-14rem)]"}`}
        >
            {
                submissionComplete
                ? <UnlockedView />
                : <LockedView />
            }
        </div>
    )
}