import Link from 'next/link';
import Image from 'next/image';

export default function FriendCard({friend}) {
    return (
        <Link 
            href={`/users/${friend.username}`} 
            className='h-48 w-full flex flex-col justify-center items-center'
        >
             <Image 
                src={friend.avatar_url || '/icons/avatar.svg'} 
                alt="avatar" 
                width={150} height={150} 
                className={`rounded-full ${ friend.avatar_url ? "" : "invert"}`}/>
            <p className='text-xl text-offblack mt-2'>{friend.username}</p>
        </Link>
    )
}