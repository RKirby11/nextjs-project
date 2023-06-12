import MatchBox from "/components/MatchBox.js"
import { cookies } from 'next/headers';

export default function Welcome() {
    const cookieStore = cookies();
    const todaysWord = cookieStore.get('dailyWord');
    return (
        <main className="z-10 absolute top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-offblack">
            <MatchBox todaysWord={todaysWord.value}></MatchBox>
        </main>
    )
}
