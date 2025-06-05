"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        userType: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,13}$/;
        return re.test(password);
    };

    const validateUsername = (username) => {
        const re = /^[A-Za-z\s]{2,50}$/;
        return re.test(username);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.username.trim()) {
            newErrors.username = "Name is required";
        } else if (!isLogin && !validateUsername(formData.username)) {
            newErrors.username = "Name must be 2-50 letters and spaces only";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be 8-13 characters with at least one uppercase letter, one number, and one special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validateForm()) {
            return;
        }

        let userType;
        if (formData.password.includes("web@admin")) {
            userType = "webAdmin";
        } else if (formData.password.includes("math@co")) {
            userType = "admin";
        } else {
            userType = "user";
        }

        const updatedformData = { ...formData, userType };

        setIsLoading(true);
        axios.post("http://localhost:5174/register", updatedformData)
            .then((res) => {
                if (res.data.success) {
                    setTimeout(() => router.replace("/"), 2000);
                }
            })
            .catch((err) => {
                const errorMessage = err.response
                    ? err.response.data.message
                    : "Registration failed. Please try again.";
                setErrors({ form: errorMessage });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/http:localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user data in context/state/localStorage
                localStorage.setItem('user', JSON.stringify(data.userData));

                // Redirect based on user type
                if (data.userType === 'admin') {
                    router.push('/app/admin/dashboard');
                } else if (data.userType === 'webAdmin') {
                    router.push('/web-admin/console');
                } else {
                    router.push('http://localhost:3000');
                }

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="auth-modal-overlay">
                <div className="auth-modal-container">
                    <div className="auth-modal-content">
                        <div className="auth-modal-header">
                            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
                            <button onClick={onClose} className="auth-modal-close-btn">
                                <svg className="auth-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="auth-social-buttons">
                            <button type="button" className="auth-social-btn">
                                <svg className="auth-social-icon" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                            <button type="button" className="auth-social-btn">
                                <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        <div className="auth-divider">
                            <div className="auth-divider-line"></div>
                            <span className="auth-divider-text">or</span>
                            <div className="auth-divider-line"></div>
                        </div>

                        <form onSubmit={isLogin ? handleSignInSubmit : handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="auth-form-group">
                                    <label htmlFor="name" className="auth-form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="username"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        className={`auth-form-input ${isSubmitted && errors.username ? 'auth-form-input-error' : ''}`}
                                        required
                                    />
                                    {isSubmitted && errors.username && (
                                        <p className="auth-form-error">{errors.username}</p>
                                    )}
                                </div>
                            )}
                            <div className="auth-form-group">
                                <label htmlFor="email" className="auth-form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className={`auth-form-input ${isSubmitted && errors.email ? 'auth-form-input-error' : ''}`}
                                    required
                                />
                                {isSubmitted && errors.email && (
                                    <p className="auth-form-error">{errors.email}</p>
                                )}
                            </div>
                            <div className="auth-form-group">
                                <label htmlFor="password" className="auth-form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className={`auth-form-input ${isSubmitted && errors.password ? 'auth-form-input-error' : ''}`}
                                    required
                                    minLength="8"
                                />
                                {isSubmitted && errors.password && (
                                    <p className="auth-form-error">{errors.password}</p>
                                )}
                            </div>
                            {isLogin && (
                                <div className="auth-form-options">
                                    <div className="auth-remember-me">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="auth-checkbox"
                                        />
                                        <label htmlFor="remember-me" className="auth-checkbox-label">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link href="/forgot-password" className="auth-forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
                            <button
                                type="submit"
                                className={`auth-submit-btn ${isLoading ? 'auth-submit-btn-loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        {isSubmitted && errors.form && (
                            <div className="auth-form-general-error">
                                {errors.form}
                            </div>
                        )}

                        <div className="auth-form-footer">
                            {isLogin ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(false);
                                            setIsSubmitted(false);
                                            setErrors({});
                                        }}
                                        className="auth-form-toggle"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(true);
                                            setIsSubmitted(false);
                                            setErrors({});
                                        }}
                                        className="auth-form-toggle"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                    padding: 1rem;
                }

                .auth-modal-container {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    width: 100%;
                    max-width: 28rem;
                }

                .auth-modal-content {
                    padding: 1.5rem;
                }

                .auth-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .auth-modal-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .auth-modal-close-btn {
                    color: #6b7280;
                    transition: color 0.2s;
                }

                .auth-modal-close-btn:hover {
                    color: #374151;
                }

                .auth-modal-close-icon {
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .auth-social-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .auth-social-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    background-color: white;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: background-color 0.2s;
                }

                .auth-social-btn:hover {
                    background-color: #f9fafb;
                }

                .auth-social-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-right: 0.5rem;
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background-color: #d1d5db;
                }

                .auth-divider-text {
                    padding: 0 1rem;
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .auth-form-group {
                    display: flex;
                    flex-direction: column;
                }

                .auth-form-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.25rem;
                }

                .auth-form-input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .auth-form-input:focus {
                    outline: none;
                    border-color: #d4b26a;
                    box-shadow: 0 0 0 3px rgba(212, 178, 106, 0.5);
                }

                .auth-form-input-error {
                    border-color: #ef4444;
                }

                .auth-form-input-error:focus {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
                }

                .auth-form-error {
                    margin-top: 0.25rem;
                    font-size: 0.75rem;
                    color: #ef4444;
                }

                .auth-form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .auth-remember-me {
                    display: flex;
                    align-items: center;
                }

                .auth-checkbox {
                    width: 1rem;
                    height: 1rem;
                    color: #d4b26a;
                    border-color: #d1d5db;
                    border-radius: 0.25rem;
                }

                .auth-checkbox-label {
                    margin-left: 0.5rem;
                    font-size: 0.875rem;
                    color: #374151;
                }

                .auth-forgot-password {
                    font-size: 0.875rem;
                    color: #d4b26a;
                    text-decoration: none;
                    transition: text-decoration 0.2s;
                }

                .auth-forgot-password:hover {
                    text-decoration: underline;
                }

                .auth-submit-btn {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    border: 1px solid transparent;
                    border-radius: 0.375rem;
                    background-color: #d4b26a;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: white;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: background-color 0.2s;
                }

                .auth-submit-btn:hover {
                    background-color: #c4a25a;
                }

                .auth-submit-btn:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(212, 178, 106, 0.5);
                }

                .auth-submit-btn-loading {
                    opacity: 0.75;
                    cursor: not-allowed;
                }

                .auth-form-general-error {
                    margin-top: 1rem;
                    text-align: center;
                    font-size: 0.875rem;
                    color: #ef4444;
                }

                .auth-form-footer {
                    margin-top: 1rem;
                    text-align: center;
                    font-size: 0.875rem;
                    color: #4b5563;
                }

                .auth-form-toggle {
                    font-weight: 500;
                    color: #d4b26a;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    transition: text-decoration 0.2s;
                }

                .auth-form-toggle:hover {
                    text-decoration: underline;
                }
            `}</style>
        </>
    );
};

export default AuthModal;