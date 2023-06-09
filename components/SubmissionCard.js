import Image from 'next/image';
export default function SubmissionCard({submission, toggleModal}) {
    return (
        <div className='mb-8 group relative' onClick={() => toggleModal(submission)} >
            <img src={submission.image_url} alt='submission image' className="object-cover h-64 w-full rounded-lg shadow-md"/>
            <div className="absolute bg-offblack w-full h-64 top-0 rounded-lg hidden group-hover:block opacity-80"/>
            <div className='absolute w-full h-64 top-0 left-0 text-lg text-white hidden group-hover:block'>
                <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex'>
                    <Image src='/eyeIcon.svg' alt='click to view' width={20} height={20} className='mr-2'/>
                    Click To View</p>
            </div>
            <p className='mt-5 text-lg text-center w-full'><b>Word:</b> { submission.word }</p>
        </div>
    );
}
