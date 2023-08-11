"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "/components/forms/FormInput.js";
import FormSubmit from "/components/forms/FormSubmit.js";
import AuthFormLayout from "/components/forms/AuthFormLayout.js";
import SubmitAuthForm from "/utils/submitAuthForm.js";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        SubmitAuthForm({
            url: "/api/auth/signup", 
            body: {name: name, email: email, password: password, confirmPassword: confirmpass}, 
            redirect: false,
            setError, 
            setLoading
        });
    }

    return (
        <AuthFormLayout title="Sign Up" error={error} loading={loading}>
                <form 
                    className="flex flex-col items-center justify-center"
                    onSubmit={ e => handleSubmit(e) }
                >
                    <FormInput 
                        text="Enter Username"
                        onChange={ e => setName(e.target.value)} 
                    />
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
                    Already have an account? Login!
                </button>
        </AuthFormLayout>
    );
}
