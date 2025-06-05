"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useAuth } from '../../context/AuthContext';


const LoginForm = ({ onSuccess, switchToRegister }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Both email and password are required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password.trim()
                }),
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Update auth context
            login(data.user);

            // Redirect based on role
            switch (data.user.userType) {
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'webadmin':
                    router.push('/webadmin/dashboard');
                    break;
                default:
                    router.push('/profile');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setError('');

    //     if (!formData.email.trim()) {
    //         toast.error("Email is required");
    //         setIsLoading(false);
    //         return;
    //     }
    //     if (!formData.password.trim()) {
    //         toast.error("Password is required");
    //         setIsLoading(false);
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('/api/auth/login', formData);

    //         if (response.data.success) {
    //             toast.success("Login successful!");

    //             // Store user data in context/localStorage
    //             localStorage.setItem('user', JSON.stringify(response.data.user));

    //             // Redirect based on role
    //             switch (response.data.user.role) {
    //                 case 'admin':
    //                     router.push('/admin/dashboard');
    //                     break;
    //                 case 'webadmin':
    //                     router.push('/webadmin/dashboard');
    //                     break;
    //                 default:
    //                     router.push('/main/profile');
    //             }

    //             onSuccess?.(); // Close the modal
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Login failed");
    //     } finally {
    //         setIsLoading(false);
    //     }

    // };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-[#d4b26a] focus:ring-[#d4b26a] border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-[#d4b26a] hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-[#d4b26a] text-white font-medium rounded-md hover:bg-[#c4a25a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b26a] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                        </span>
                    ) : 'Sign In'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                    onClick={switchToRegister}
                    className="font-medium text-[#d4b26a] hover:underline focus:outline-none"
                >
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;