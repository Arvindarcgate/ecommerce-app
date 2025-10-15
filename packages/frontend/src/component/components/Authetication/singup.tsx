import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";

const Signup: React.FC = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return alert("Passwords do not match!");
        await signup(email, password);
        navigate("/login");
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 px-4 pt-24">
            <div
                className="bg-white p-8 rounded-lg shadow-md"
                style={{ width: "320px" }}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-3 rounded w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="border p-3 rounded w-full pr-10" // padding-right so text doesn't overlap icon
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* Icon visually inside the input */}
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}

                        </span>
                    </div>


                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="border p-3 rounded w-full"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-3 rounded hover:bg-green-700 w-full"
                    >
                        Create Account
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
