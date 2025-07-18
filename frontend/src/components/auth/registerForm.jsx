"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';

const RegisterForm = ({ onSuccess, switchToLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        inviteCode: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.username.trim() || !formData.email.trim() ||
            !formData.password.trim() || !formData.confirmPassword.trim()) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        // Input validation
        const nameRegex = /^[A-Za-z]{1,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,13}$/;

        if (!nameRegex.test(formData.username)) {
            toast.error("Name must be letters only and up to 50 characters.");
            setIsLoading(false);
            return;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            toast.error("Password must be 8-13 characters with uppercase, number, and special character.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    inviteCode: formData.inviteCode.trim() || null
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Success case
            toast.success(data.message);
            router.push('/');

            if (onSuccess) onSuccess();

        } catch (err) {
            toast.error(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="John Doe"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Letters only, up to 50 characters
                    </p>
                </div>


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
                        minLength={8}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        8-13 characters with uppercase, number, and special character
                    </p>
                </div>

                <div>
                    <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="••••••••"
                        required
                        minLength={8}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        8-13 characters with uppercase, number, and special character
                    </p>
                </div>

                <div>
                    <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Invite Code (optional)
                    </label>
                    <input
                        type="text"
                        id="inviteCode"
                        name="inviteCode"
                        value={formData.inviteCode}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="Enter invite code if you have one"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Required for admin registration
                    </p>
                </div>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
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
                            Registering...
                        </span>
                    ) : 'Sign Up'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={switchToLogin}
                    className="font-medium text-[#d4b26a] hover:underline focus:outline-none"
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;