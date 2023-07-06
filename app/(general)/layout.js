import NavOptions from '/components/NavOptions';
import SearchUsers from '/components/SearchUsers';
import { cookies } from 'next/headers';
export default function Layout({ children }) {
    const cookieStore = cookies();
    const userName = cookieStore.get('userName');
    const todaysWord = cookieStore.get('dailyWord');
    const avatarURL = cookieStore.has('avatarURL') ? cookieStore.get('avatarURL').value : '/avatarWhite.svg';
    return (
        <>    
            <header className="z-40 fixed left-0 top-0 w-full h-20 px-10 bg-pink flex justify-between items-center text-white font-bold">
                <div className='text-2xl'>
                    Todays Word: <span className="text-3xl">{todaysWord.value}</span>
                </div>
                <SearchUsers></SearchUsers>
                <div className='flex items-center'>
                    <NavOptions userName={userName.value} avatarURL={avatarURL}></NavOptions>
                </div>
            </header>
            <div className='mt-20 pt-4 px-10 lg:px-20 xl:px-40'>
                {children}
            </div>
            <footer className="fixed left-0 bottom-0 w-full h-16 px-10 bg-purple flex items-center">
                <p className="text-white text-lg font-bold">Your Streak: 0</p>
            </footer>
        </>
    )
}