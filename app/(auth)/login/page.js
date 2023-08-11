"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "/components/forms/FormInput.js";
import FormSubmit from "/components/forms/FormSubmit.js";
import AuthFormLayout from "/components/forms/AuthFormLayout.js";
import SubmitAuthForm from "/utils/submitAuthForm.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationReminder, setVerificationReminder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationToken = searchParams.get('token')

    const handleSubmit = async (e) => {
        e.preventDefault();
        await SubmitAuthForm({
            url: "/api/auth/login", 
            body: {email: email, password: password, verificationCode: verificationToken}, 
            redirect: "/",
            setError, 
            setLoading
        });
        if (error && error.includes("verification")) {
            setVerificationReminder(true);
        }
    }

    return (
        <AuthFormLayout title="Login" error={error} loading={loading}>
            {
                verificationReminder && 
                <button className={`text-center mb-4 underline`} onClick={() => {router.push('/verify-email')}}>
                    Resend Verification Email
                </button>
            }
            <form 
                className="flex flex-col items-center justify-center"
                onSubmit={ e => handleSubmit(e) }
            >
                <FormInput 
                    text="Enter Email"
                    type="email"
                    onChange={ e => setEmail(e.target.value)} 
                />
                <FormInput
                    text="Enter Password"
                    type="password"
                    onChange={ e => setPassword(e.target.value)}
                />
                <FormSubmit/>
            </form>
            <button 
                className="w-full cursor-pointer underline"
                onClick={() => {router.push('/register')}}
            >
                Don't have an account? Sign Up!
            </button>
            <button 
                className="w-full cursor-pointer underline"
                onClick={() => {router.push('/request-password-reset')}}
            >
                Forgot your password? Reset it!
            </button>
        </AuthFormLayout>
    );
}
