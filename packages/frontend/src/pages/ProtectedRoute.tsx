
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <p>Checking Auth...</p>;

    return isAuthenticated ? children : <Navigate to="/" />;
}
