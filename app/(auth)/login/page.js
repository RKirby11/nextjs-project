"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@material-tailwind/react";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e, email, password) => {
        e.preventDefault()
        setLoading(true);
        try {
            const body = isLogin 
                ? {email: email, password: password} 
                : {name: name, email: email, password: password, password_confirmation: confirmpass};
            const response = await fetch(`/api/auth/${ isLogin ? "login" : "signup" }`, {
                method: 'POST',
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.error) {
                setLoading(false);
                setError(data.error);
            }
            else if (isLogin) router.push("/dashboard");
            else {
                setIsLogin(true);
                setLoading(false);
                setError("Account created! Please login.");
            }
        }
        catch (error) {
            setLoading(false);
            setError('Sorry, something went wrong. Please try again.');
        }
    }
    return (
        <div className="flex flex-col items-center h-full px-8 justify-between">
            <h1 className="mt-5 text-2xl font-bold flex items-center">
                { isLogin ? "Login" : "Sign Up"}
            </h1>
            <p className="w-full h-12 text-blue text-center flex items-center">
                { error }
            </p>
            { 
                loading 
                ? <div className={`${isLogin ? "h-2/3" : "h-3/4"}`}>
                    <Spinner color="indigo" className="h-12 w-12 mt-10"/>
                </div>
                :  <> 
                    <form 
                        className={`flex flex-col items-center justify-center ${isLogin ? "h-2/3" : "h-3/4"}`}
                        aria-label="Login Form"
                        onSubmit={ e => handleSubmit(e, email, password) }
                    >
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple 
                                ${isLogin ? "hidden" : ""}`
                            }
                            type='text' 
                            placeholder='Enter Username' 
                            aria-label="username input" 
                            onChange={ e => setName(e.target.value)} 
                        />
                        <input 
                            className="w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple"
                            type='text' 
                            placeholder='Enter email' 
                            aria-label="Email Input" 
                            onChange={ e => setEmail(e.target.value)} 
                        />
                        <input 
                            className="w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple"
                            type='password' 
                            placeholder='Enter password' 
                            aria-label="Password Input" 
                            onChange={ e => setPassword(e.target.value)}
                        /> 
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple 
                                ${isLogin ? "hidden" : ""}`
                            }
                            type='password' 
                            placeholder='Confirm password' 
                            aria-label="Confirm Password Input" 
                            onChange={ e => setConfirmpass(e.target.value)}
                        /> 
                        <input
                            className="w-56 bg-offwhite p-2 rounded-md cursor-pointer hover:border-purple border-2" 
                            type='submit' 
                        />
                    </form>
                    <button 
                        className='w-full cursor-pointer underline hover:text-purple py-5'
                        onClick={() => setIsLogin(!isLogin)}>
                            { isLogin ? "Don't have an account? Sign Up!" : "Already have an account? Login!" }
                    </button>
                </>
            }
        </div>
    );
}
