export default function Layout({ children }) {
  return (
        <>   
            <div className='h-screen w-screen flex justify-center items-center bg-pink'>
                <div className="bg-white h-1/2 w-80 rounded-md flex justify-center items-center">
                    {children}
                </div>
            </div>
        </>
    )
}