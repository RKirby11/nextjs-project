import AvatarUpload from '/components/AvatarUpload.js'
import UserDetails from '/components/UserDetails.js'
import { cookies } from 'next/headers';

export default function Profile() {
    const cookieStore = cookies();
    const userName = cookieStore.get('userName');
    const avatarUrl = cookieStore.get('avatarURL') || '/avatar.svg';
    return (
        <main className="h-full w-full">
            <div className="h-full flex flex-col items-center justify-around">
                <h1 className="text-4xl font-bold">Your Account</h1>
                <AvatarUpload currentAvatarUrl={avatarUrl.value}></AvatarUpload>
                <UserDetails userName={userName.value}></UserDetails>
            </div>
        </main>
    );
}