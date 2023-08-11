export default function ImageCard({imageURL, altText, locked}) {
    return (
        <div className="relative h-full w-full">
            <img 
                src={imageURL} 
                alt={altText} 
                className={`h-full w-full object-cover
                    ${locked ? "blur-md" : ""}`}/>
            <div 
                className={`absolute w-full h-full top-0 left-0 bg-blue opacity-10
                    ${locked ? "block blur-md" : "hidden"}`}>
            </div>
        </div>
    );
}