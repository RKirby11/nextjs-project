"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "/components/forms/FormInput.js";
import FormSubmit from "/components/forms/FormSubmit.js";
import AuthFormLayout from "/components/forms/AuthFormLayout.js";
import SubmitAuthForm from "/utils/submitAuthForm.js";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const resetToken = searchParams.get('reset-token')
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        SubmitAuthForm({
            url: "/api/auth/reset-password", 
            body: {password: password, confirmPassword: confirmpass, resetToken: resetToken}, 
            redirect: false,
            setError, 
            setLoading
        });
    }

    return (
        <AuthFormLayout title="Reset Password" error={error} loading={loading}>
                <form 
                    className="flex flex-col items-center justify-center"
                    onSubmit={ e => handleSubmit(e) }
                >
                    <FormInput
                        text="Enter Password"
                        type="password"
                        onChange={ e => setPassword(e.target.value)}
                    /> 
                    <FormInput
                        text="Confirm Password"
                        type='password' 
                        onChange={ e => setConfirmpass(e.target.value)}
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
