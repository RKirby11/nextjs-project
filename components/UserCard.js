import Image from "next/image";

export default function UserCard({user, onClick}) {
    return (
        <div 
            className="flex mt-2 justify-between items-center font-normal text-offblack bg-white rounded-md p-2 cursor-pointer hover:bg-white" 
            key={user.id}
            onClick={onClick}
        >
            <div className='flex'>
                <Image 
                    src={user.avatar_url || '/icons/avatar.svg'} 
                    alt="avatar" 
                    width={26} height={26} 
                    className={`rounded-full mr-5 ${user.avatar_url ? "" : "invert"}`}/>
                <p className='text-lg'>{user.user_name}</p>
            </div>
            {/* <p className="italic text-gray-700">
            {
                user.relationship.status == 'friends' ? "Friends"
                : user.relationship.status == 'request sent' ? "Friend Request Sent"
                : user.relationship.status == 'request received' ? "Friend Request Received"
                : ""
            }
            </p> */}
        </div>
    )
}