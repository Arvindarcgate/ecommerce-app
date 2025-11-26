import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setMessage("Invalid or missing verification token.");
            return;
        }

        // Auto verify as soon as page loads
        const verifyEmail = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/auth/verify?token=${token}`);
                const data = await res.json();
                setMessage(data.message);

                // redirect user to login after 2 seconds
                setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
                setMessage("Verification failed");
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Email Verification</h2>
            <p>{message || "Verifying your email..."}</p>
        </div>
    );
};

export default VerifyEmailPage;
