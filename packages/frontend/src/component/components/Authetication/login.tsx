
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
        navigate("/");
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 px-4 pt-24">
            <div className="bg-white p-8 rounded-lg shadow-md" style={{ width: '320px' }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-3 rounded w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-3 rounded w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 w-full"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    New user?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>




    );
};

export default Login;
