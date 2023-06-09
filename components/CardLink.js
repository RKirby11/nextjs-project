//this is an example of a function component, it:
// returns JSX describing the UI
// can utilize react hooks such as 'useState' and 'useEffect' to manage state and lifecycle hooks
// is generally more concise and easier to read than class components
// is typically more performant than class components because they have a smaller memory footprint

import Link from 'next/link'

export default function CardButton({ href, text}) {
    return (        
        <Link
            href={ href }
            className="rounded-full w-full h-32 lg:h-56 xl:h-64 bg-blue text-white flex justify-center items-center text-3xl"
        >
            {text}
        </Link>
    )
}