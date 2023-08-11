"use client";
import { useRouter } from "next/navigation";

export default async function handleSubmit({url, body, redirect, setError, setLoading,}) {
    setError("");
    setLoading(true);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.error) {
            if(Array.isArray(data.error)) setError(data.error[0])
            else setError(data.error);
        }
        else if (redirect) {
            const router = useRouter();
            router.push(redirect);
        }
        else {
            setError(data.message);
        }
    }
    catch (error) {
        setError('Sorry, something went wrong. Please try again.');
    }
    setLoading(false);
    return;
}