import Image from 'next/image';

export default function CurrentSubmission() {
    return (
        <div className="absolute -left-4 top-28 w-screen">
            <Image src="/images/Frame 9.svg" width="300" height="80" alt="Current Submission" />
            <div className="w-full px-4 py-2 flex flex-col justify-center items-center">
                <Image src="/images/example1.jpeg" width="300" height="300" alt="Current Submission" />
                <div className="w-full h-full border-2 border-blue rounded-md mt-4 p-2">
                    This is my submission for today. Blah blah blah
                </div>
                <div className="w-full flex justify-between mt-4">
                    <div className="flex items-center">
                        <Image 
                            src="/icons/world.svg" 
                            width="20" 
                            height="20" 
                            alt="Sharing Permissions" 
                            className="invert mr-5"
                        />
                        <p>Public</p>
                    </div>
                    <div className="flex items-center">
                        <p>3</p>
                        <Image 
                            src="/icons/fire.svg" 
                            width="25" 
                            height="25" 
                            alt="Likes" 
                            className="invert ml-5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}