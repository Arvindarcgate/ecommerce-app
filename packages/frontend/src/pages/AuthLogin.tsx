import { useAuth0 } from "@auth0/auth0-react";

export default function AuthLogin() {
    const { loginWithRedirect, isLoading } = useAuth0();

    if (isLoading) return <p>Loading...</p>;

    return (
        <button
            onClick={() => loginWithRedirect()}
            style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100px",

            }}
        >
            Login with Auth0
        </button>
    );
}
