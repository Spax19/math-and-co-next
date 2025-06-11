"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VerificationModal from '../../../components/verificationModal';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../../components/loadingSpinner';


function VerifyEmailPageContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [verificationStatus, setVerificationStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus({
                        loading: false,
                        success: true,
                        message: 'Email verified successfully! You can now log in.'
                    });
                } else {
                    throw new Error(data.message || 'Verification failed');
                }
            } catch (error) {
                setVerificationStatus({
                    loading: false,
                    success: false,
                    message: error.message || 'Invalid or expired verification link'
                });
            }
        };

        if (token) {
            verifyToken();
        } else {
            setVerificationStatus({
                loading: false,
                success: false,
                message: 'Missing verification token'
            });
        }
    }, [token]);
    const router = useRouter();
    const handleClose = () => {
        router.push('/'); // Redirect to home when modal closes
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            {/* Background page content (can be simple) */}
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                <p className="text-gray-600">
                    {verificationStatus.loading
                        ? 'Verifying your email...'
                        : 'You can close this window now.'}
                </p>
            </div>

            {/* The modal that will pop up */}
            {!verificationStatus.loading && (
                <VerificationModal
                    success={verificationStatus.success}
                    message={verificationStatus.message}
                    onClose={handleClose} // Close the tab/window when modal is closed
                />
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}