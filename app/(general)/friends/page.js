import FriendIndex from '/components/FriendIndex.js';
export default async function Friends() {
    return (
        <main className="h-full w-full flex flex-col items-center">
            <p className='text-xl mb-5'>Your Friends</p>
            <FriendIndex></FriendIndex>
        </main>
    );
}