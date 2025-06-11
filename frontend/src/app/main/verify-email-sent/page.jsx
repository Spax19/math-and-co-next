"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/loadingSpinner';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (email) {
            toast.info(`Please check ${email} for verification instructions`);
        }
    }, [email]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Verify Your Email
                </h1>
                <p className="text-gray-600 mb-6">
                    We've sent a verification link to <span className="font-semibold">{email}</span>.
                    Please check your inbox and click the link to verify your email address.
                </p>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <p className="text-blue-800">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                            className="text-blue-600 font-medium hover:underline"
                            onClick={() => {
                                // Add resend verification email logic here
                                toast.info('Resending verification email...');
                            }}
                        >
                            resend verification email
                        </button>
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailContent />
    </Suspense>
  );
}