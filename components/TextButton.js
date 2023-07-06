import Image from 'next/image';

export default function TextButton({text, color, img, action}) {
    return (
        <button className={`flex items-center text-${color} font-bold text-xl`} onClick={() => action()}>
            <Image src={img} width="25" height="25" alt={text} className='mr-2'/>
            {text}
        </button>
    )
}
