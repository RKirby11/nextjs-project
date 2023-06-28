"use client";
import Image from 'next/image';

export default function AddFriend({username}) {
    const [error, setError] = useState(false);
    const sendRequest = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${username}/friend-request`, {
                method: 'POST',
            });
            if(response.ok) {
                
                console.log(data.avatarUrl)
                if (data.avatarUrl !== null) setAvatarUrl(data.avatarUrl);
                setLoading(false);
            }
            else throw new Error("Fetch Failed");
        } catch (error) {
            setError(true);
        }
    },[]);
    return (
        <div>
            <button 
                className="flex items-center text-green font-bold text-xl"
                onClick={() => addFriend() }
            >
                <Image src="/greenPlus.svg" alt="Add Friend" width={25} height={25} className='mr-2' />
                Send Friend Request
            </button>
        </div>
    );
}