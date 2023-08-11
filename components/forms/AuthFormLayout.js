import CircularProgress from '@mui/material/CircularProgress';

export default function AuthFormLayout({title, error, loading, children}) {
    return (
        <div className="flex flex-col items-center h-full px-8 py-12 justify-between">
             <h1 className="mb-8 text-3xl text-center">
                { title }
            </h1>
            <p className={`text-center ${ error ? "mb-4" : ""}`}>
                { error }
            </p>
            {   loading 
                ? <div className="text-blue"><CircularProgress color="inherit"/></div>
                : children
            }
        </div>
    )
}
