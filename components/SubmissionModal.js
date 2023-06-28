import Image from 'next/image';
export default function SubmissionModal({submission, toggleModal}) {
    const formattedDate = new Date(submission.date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    return (
        <>
        <div className='absolute z-20 top-0 left-0 h-screen w-screen opacity-80 bg-offblack'/>
        <div className='absolute z-30 h-5/6 w-2/3 opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-5'>
            <button className='absolute top-0 right-0 mt-5 mr-5 text-2xl hover:underline' onClick={() => toggleModal(null)}>X</button>
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <h2 className='text-2xl mb-5'>Word: <b>{ submission.word }</b></h2>
                <Image src={submission.image_url} alt='submission image' width={300} height={300} className='rounded-md'/>
                <p className='text-lg mt-5'>{ formattedDate }</p>
                <p className='text-lg mt-5'>{ submission.note }</p>
            </div>
        </div>
        </>
    );
}
