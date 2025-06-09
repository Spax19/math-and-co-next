"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({onSuccess, switchToRegister }) => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
    const { login } = useAuth();
    //const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Login failed");

            // Call login from auth context
            login({
                id: data.user.id,
                email: data.user.email,
                userType: data.user.role
            });

            toast.success("Login successful!");

            // Redirect based on role
            const redirectPath = data.user.role === 'admin' ? '/admin/dashboard' :
                data.user.role === 'webadmin' ? '/webadmin/dashboard' : '/main/profile';
            router.push(redirectPath);

            if (onSuccess) onSuccess();

        } catch (err) {
            toast.error(err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);

    //     try {
    //         const response = await fetch('/api/auth/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 email: formData.email.trim(),
    //                 password: formData.password.trim()
    //             }),
    //         });

    //         const data = await response.json();

    //         if (!response.ok) throw new Error(data.error || "Login failed");

    //         // Update auth context
    //         login({
    //             id: data.user.id,
    //             email: data.user.email,
    //             userType: data.user.role
    //         });

    //         toast.success("Login successful!");

    //         // Redirect based on role
    //         switch (data.user.role) {
    //             case 'admin':
    //                 router.push('/admin/dashboard');
    //                 break;
    //             case 'webadmin':
    //                 router.push('/webadmin/dashboard');
    //                 break;
    //             default:
    //                 router.push('/profile');
    //         }

    //         if (onSuccess) onSuccess();

    //     } catch (err) {
    //         toast.error(err.message || "Login failed");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setError('');

    //     try {
    //         const response = await fetch('/api/auth/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 email: formData.email.trim(),
    //                 password: formData.password.trim()
    //             }),
    //         });

    //         // Check if response is JSON
    //         const contentType = response.headers.get('content-type');
    //         if (!contentType || !contentType.includes('application/json')) {
    //             const text = await response.text();
    //             throw new Error(`Expected JSON, got: ${text.substring(0, 100)}...`);
    //         }

    //         const data = await response.json();

    //         if (!response.ok) {
    //             if (data.unverified) {
    //                 toast.error(data.error);
    //                 router.push(`/verify-email-sent?email=${encodeURIComponent(formData.email)}`);
    //                 return;
    //             }
    //             throw new Error(data.error || "Login failed");
    //         }

    //         //Successful login
    //         toast.success("Welcome.");

    //         // Redirect based on user role
    //         switch (data.user.role) {
    //             case 'admin':
    //                 router.push('/admin/dashboard');
    //                 break;
    //             case 'webadmin':
    //                 router.push('/webadmin/dashboard');
    //                 break;
    //             default:
    //                 router.push('/main/profile');
    //         }

    //     } catch (err) {
    //         console.error('Login error:', err);
    //         setError(err.message.includes('<!DOCTYPE')
    //             ? 'Server returned an error page'
    //             : err.message);
    //         toast.error(err.message.includes('<!DOCTYPE')
    //             ? 'Server error occurred'
    //             : err.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setError('');

    //     try {
    //         const response = await fetch('/api/auth/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 email: formData.email.trim(),
    //                 password: formData.password.trim()
    //             }),
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             if (data.unverified) {
    //                 // Special handling for unverified email
    //                 toast.error(data.error);
    //                 router.push(`/verify-email-sent?email=${encodeURIComponent(formData.email)}`);
    //                 return;
    //             }
    //             throw new Error(data.error || "Login failed");
    //         }

    //         // Successful login
    //         toast.success("Login successful!");

    //         // Redirect based on user role
    //         switch (data.user.role) {
    //             case 'admin':
    //                 router.push('/admin/dashboard');
    //                 break;
    //             case 'webadmin':
    //                 router.push('/webadmin/dashboard');
    //                 break;
    //             default:
    //                 router.push('/dashboard');
    //         }

    //     } catch (err) {
    //         setError(err.message || "Login failed. Please try again.");
    //         toast.error(err.message || "Login failed. Please try again.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

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
                    />
                </div>

                {error && (
                    <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                    ) : 'Sign in'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                    onClick={switchToRegister}
                    className="font-medium text-indigo-600 hover:underline focus:outline-none"
                >
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;