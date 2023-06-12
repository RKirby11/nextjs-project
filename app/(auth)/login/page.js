"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    const searchParams = useSearchParams();
    const verification_token = searchParams.get('token')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("");
        setLoading(true);
        try {
            const body = isLogin 
                ? {email: email, password: password, email_verification_code: verification_token} 
                : {name: name, email: email, password: password, confirmPassword: confirmpass};
            const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.error) {
                setLoading(false);
                if(Array.isArray(data.error)) setError(data.error[0])
                else setError(data.error);
            }
            else if (isLogin) router.push("/");
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

    function toggleView() {
        setIsLogin(!isLogin);
        setError("");
    }

    return (
        <div className="flex flex-col items-center h-full px-8 py-10 justify-between">
            <h1 className="my-5 text-2xl font-bold">
                { isLogin ? "Login" : "Sign Up"}
            </h1>
            <p className={`text-blue text-center ${ error ? "mb-5" : ""}`}>
                { error }
            </p>
            { 
                loading 
                ? <div className={`${isLogin ? "h-2/3" : "h-3/4"}`}>
                    <Spinner color="indigo" className="h-12 w-12 my-10"/>
                </div>
                :  <> 
                    <form 
                        className={`flex flex-col items-center justify-center ${isLogin ? "h-2/3" : "h-3/4"}`}
                        aria-label="Login Form"
                        onSubmit={ e => handleSubmit(e) }
                    >
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple 
                                ${isLogin ? "hidden" : ""}`
                            }
                            type='text' 
                            placeholder='Enter username' 
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
                        onClick={() => toggleView()}>
                            { isLogin ? "Don't have an account? Sign Up!" : "Already have an account? Login!" }
                    </button>
                </>
            }
        </div>
    );
}
