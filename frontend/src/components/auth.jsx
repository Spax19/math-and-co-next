"use client";
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose}) => {

    const [isLogin, setIsLogin] = useState(true);
    // const [formData, setFormData] = useState({
    //     name: '',
    //     email: '',
    //     password: ''
    // });
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        userType: "",
    });

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Input validation
        const nameRegex = /^[A-Za-z]{1,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,13}$/;

        // Validate name
        if (!nameRegex.test(formData.username)) {
            toast.error("Name must be letters only and up to 50 characters.");
            return;
        }

        // Validate email
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // Validate password
        if (!passwordRegex.test(formData.password)) {
            toast.error(
                "Password must be 8-13 characters long, contain at least one uppercase letter, one number, and one special character."
            );
            return;
        }

        // Dynamically set userType based on password content
        let userType;
        if (formData.password.includes("web@admin")) {
            userType = "webAdmin";
        } else if (formData.password.includes("math@co")) {
            userType = "admin";
        } else {
            userType = "user";
        }

        const updatedformData = { ...formData, userType };

        axios.post("http://localhost:5174/register", updatedformData).then((res) => {
            if (res.data.success) {
                toast.success(
                    "Registration successful! A verification email has been sent."
                );
                setTimeout(() => router.replace("/"), 2000); // Redirect after 2 seconds
            }
        })
            .catch((err) => {
                const errorMessage = err.response
                    ? err.response.data.message
                    : "Registration failed. Please try again.";
                toast.error(errorMessage);
            });
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5174/login", {
                username: formData.username,
                password: formData.password,
            });

            if (res.status === 200 && res.data?.userType) {
                const { userType, message } = res.data;

                toast.success(message || "Login successful!");

                localStorage.setItem("role", JSON.stringify(userType));
                setRole(userType); // ✅ Now available

                setTimeout(() => {
                    if (userType === "admin" || userType === "webAdmin") {
                        navigate("/dashboard");
                    } else {
                        navigate("/");
                    }
                }, 1500);
            } else {
                throw new Error(res.data?.message || "Unexpected response from server.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
        }
    };






    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Handle form submission here
    //     toast.success("User registered");
    //     console.log('Form submitted:', formData);
    //     // Add your authentication logic here
    // };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">or</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                                    required
                                    minLength="6"
                                />
                            </div>
                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#d4b26a] focus:ring-[#d4b26a] border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link href="/forgot-password" className="text-sm text-[#d4b26a] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#d4b26a] hover:bg-[#c4a25a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b26a]"
                            >
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            {isLogin ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="font-medium text-[#d4b26a] hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        className="font-medium text-[#d4b26a] hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthModal;