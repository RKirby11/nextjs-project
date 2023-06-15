import { useRouter } from "next/navigation";
export default function NavLink({url, text}) {
    const router = useRouter();
    return (
        <button 
            className="w-full border-offwhite border-2 border-solid hover:bg-white hover:text-pink p-2 rounded-sm mb-5"
            onClick={() => router.push(url)}
        >
            { text }
        </button>
    )
}