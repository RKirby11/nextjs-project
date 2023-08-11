"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "/components/forms/FormInput.js";
import FormSubmit from "/components/forms/FormSubmit.js";
import AuthFormLayout from "/components/forms/AuthFormLayout.js";
import SubmitAuthForm from "/utils/submitAuthForm.js";

export default function Register() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        SubmitAuthForm({
            url: "/api/auth/verify", 
            body: {email: email}, 
            redirect: false,
            setError, 
            setLoading
        });
    }

    return (
        <AuthFormLayout title="Resend Verification Email" error={error} loading={loading}>
            <form 
                className="flex flex-col items-center justify-center"
                onSubmit={ e => handleSubmit(e) }
            >
                <FormInput 
                    text="Enter Email"
                    type="email"
                    onChange={ e => setEmail(e.target.value)} 
                />
                <FormSubmit/>
            </form>
            <button 
                className="w-full cursor-pointer underline"
                onClick={() => {router.push('/login')}}
            >
                Back to Login
            </button>
        </AuthFormLayout>
    );
}
