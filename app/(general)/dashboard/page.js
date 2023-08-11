import { cookies } from 'next/headers';
import UserUpdate from "/components/UserUpdate.js"
import ExploreToggle from "/components/ExploreToggle.js"
import CurrentSubmission from "/components/CurrentSubmission.js"

export default function Dashboard() {
    const cookieStore = cookies();
    // const status = cookieStore.get('submissionStatus');
    const submissionComplete = true;
    const avatarURL = cookieStore.get('avatarURL');
    const userName = cookieStore.get('userName');
    return (
        <main className="relative h-full flex flex-col justify-between">
            <UserUpdate 
                submissionComplete={submissionComplete} 
                avatarURL={avatarURL.value} 
                userName={userName.value}
            />
            { submissionComplete && <CurrentSubmission /> }
            <ExploreToggle
                submissionComplete={submissionComplete}
            />
        </main>
    );
}