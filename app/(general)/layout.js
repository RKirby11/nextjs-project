import NavOptions from '/components/NavOptions';
import { cookies } from 'next/headers';
export default function Layout({ children }) {
    const cookieStore = cookies();
    const userName = cookieStore.get('userName');
    const todaysWord = cookieStore.get('dailyWord');
    const avatarURL = cookieStore.has('avatarURL') ? cookieStore.get('avatarURL').value : '/avatar.svg';
    return (
        <>    
            <header>
                <nav className="h-20 px-10 bg-pink flex justify-between items-center text-white font-bold">
                    <div className='text-2xl'>
                        Todays Word: <span className="text-3xl">{todaysWord.value}</span>
                    </div>
                    <div className='flex items-center'>
                        <p className='text-2xl mr-2'>Hi {userName.value}!</p>
                        <NavOptions avatarURL={avatarURL}></NavOptions>
                    </div>
                </nav>
            </header>
            <div className='p-10 lg:px-20 xl:px-40 h-[calc(100vh-9rem)]'>
                {children}
            </div>
            <footer className="absolute w-screen top-[calc(100vh-4rem)] h-16 px-10 bg-purple flex items-center">
            <p className="text-white text-lg font-bold">Your Streak: 0</p>
            </footer>
        </>
    )
}