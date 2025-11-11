import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState<string | null>(null);
    const [verificationUrl, setVerificationUrl] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setVerificationUrl(`http://localhost:8000/api/auth/verify?token=${token}`);
        }
    }, [searchParams]);

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (!verificationUrl) return;

        try {
            const res = await fetch(verificationUrl);
            const data = await res.json();
            setMessage(data.message);
        } catch (err) {
            console.error(err);
            setMessage("Verification failed!");
        }
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Email Verification</h2>
            {message ? (
                <p>{message}</p>
            ) : (
                <a href={verificationUrl || "#"} onClick={handleClick}>
                    Click here to verify your email
                </a>
            )}
        </div>
    );
};

export default VerifyEmailPage;
