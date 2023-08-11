import NavOptions from '/components/nav/NavOptions';
import { cookies } from 'next/headers';
export default function Layout({ children }) {
    const cookieStore = cookies();
    const todaysWord = cookieStore.get('dailyWord');
    return (
        <>    
            <header className="z-40 w-full h-20 pl-5 bg-red flex justify-between items-center text-white">
                <h1 className='text-xl'>
                    Todays Word:<br/>
                    <span className="font-bold">
                        {todaysWord.value}
                    </span>
                </h1>
                <div className='flex items-center'>
                    <NavOptions></NavOptions>
                </div>
            </header>
            <div className='calc(100vh-5rem) py-4 px-4'>
                {children}
            </div>
        </>
    )
}