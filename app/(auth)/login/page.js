"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@material-tailwind/react";

export default function Login() {
    const [formType, setFormType] = useState(null); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [requireVerification, setRequireVerification] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationToken = searchParams.get('token')
    const resetToken = searchParams.get('reset-token')
    
    useEffect(() => {
        if (resetToken) setFormType("Reset Password");
        else setFormType("Login");
    }, [resetToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("");
        setRequireVerification(false);
        setLoading(true);
        try {
            const {body, url} = getFormData();
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.error) {
                setLoading(false);
                if(Array.isArray(data.error)) setError(data.error[0])
                else setError(data.error);

                if(data.error.includes("verification link")) setRequireVerification(true);
            }
            else if (formType === 'Login') router.push("/");
            else {
                setLoading(false);
                setError(data.message);
                setFormType("Login");
            }
        }
        catch (error) {
            setLoading(false);
            setError('Sorry, something went wrong. Please try again.');
        }
    }

    function getFormData() {
        let body, url;
        switch(formType) {
            case "Login":
                body = {email: email, password: password, verificationCode: verificationToken};
                url = "/api/auth/login";
                break;
            case "Sign Up":
                body = {name: name, email: email, password: password, confirmPassword: confirmpass};
                url = "/api/auth/signup";
                break;
            case "Verify Email":
                body = {email: email};
                url = "/api/auth/verify";
                break;
            case "Request Password Reset":
                body = {email: email};
                url = "/api/auth/request-password-reset";
                break;
            case "Reset Password":
                body = {password: password, confirmPassword: confirmpass, resetToken: resetToken};
                url = "/api/auth/reset-password";
                break;
            default:
                throw new Error("Invalid form type");
        }
        return {body: body, url: url};
    }

    function toggleView(newView) {
        setFormType(newView);
        setError("");
        setRequireVerification(false);
    }

    return (
        <div className="flex flex-col items-center h-full px-8 py-10 justify-between">
            <h1 className="my-5 text-2xl font-bold text-center">
                { formType }
            </h1>
            <p className={`text-blue text-center ${ error ? "mb-5" : ""}`}>
                { error }
            </p>
            <button 
                className={`text-offblack underline mb-5 hover:text-purple 
                    ${requireVerification ? "block" : "hidden"}`
                }
                onClick={() => toggleView('Verify Email')}
            >
                Resend verification email
            </button>
            { 
                loading || formType === null
                ? <Spinner color="indigo" className="h-12 w-12 my-10"/>
                : <> 
                    <form 
                        className="flex flex-col items-center justify-center"
                        onSubmit={ e => handleSubmit(e) }
                    >
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple 
                                ${formType === 'Sign Up' ? "block" : "hidden"}`
                        }
                            type='text' 
                            placeholder='Enter username' 
                            aria-label="username input" 
                            onChange={ e => setName(e.target.value)} 
                        />
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple
                                ${formType === 'Reset Password' ? "hidden" : "block"}`
                            }
                            type='text' 
                            placeholder='Enter email' 
                            aria-label="Email Input" 
                            onChange={ e => setEmail(e.target.value)} 
                        />
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple
                                ${formType === 'Request Password Reset' || formType === 'Verify Email' ? "hidden" : "block"}`
                            }
                            type='password' 
                            placeholder='Enter password' 
                            aria-label="Password Input" 
                            onChange={ e => setPassword(e.target.value)}
                        /> 
                        <input 
                            className={`w-56 p-2 rounded-md mb-5 border-2 hover:border-purple focus:outline-none focus:border-purple 
                                ${formType === 'Sign Up' || formType === 'Reset Password' ? "block" : "hidden"}`
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
                        className="w-full cursor-pointer underline hover:text-purple mt-5"
                        onClick={() => {formType === 'Sign Up' ? toggleView('Login') : toggleView('Sign Up')}}
                    >
                            { formType === 'Sign Up' ? "Already have an account? Login!" : "Don't have an account? Sign Up!" }
                    </button>
                    <button 
                        className={`w-full cursor-pointer underline hover:text-purple mt-2
                            ${ formType === 'Login' ? "block" : "hidden"}`
                        }
                        onClick={() => toggleView('Request Password Reset')}
                    >
                        Forgot password? Reset it!
                    </button>
                </>
            }
        </div>
    );
}
