import { useRouter } from "next/navigation";
import Image from "next/image";
export default function NavLink({url, text, src}) {
    const router = useRouter();
    const linkTo = async () => {
        if (text === "Logout") {
            await fetch("/api/auth/logout");
        }
        router.push(url);
    }
    return (
        <button 
            className="w-11/12 mb-5 p-2 rounded-md bg-white text-offblack flex justify-between"
            onClick={() => linkTo()}
        >   
            <Image src={src} width="25" height="25" alt={text} className="invert"/>
            { text }
            <div className="w-6 h-6"/>
        </button>
    )
}