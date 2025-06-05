// components/VerificationModal.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function VerificationModal({ success, message, onClose }) {
    // Auto-close the modal after 5 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const router = useRouter();
    const handleContinue = () => {
        onClose(); // Close the modal
        router.push('/'); // Redirect to home page
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                <div className="text-center">
                    {/* Success/Error Icon */}
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${success ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
                        {success ? (
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-2 ${success ? 'text-green-800' : 'text-red-800'}`}>
                        {success ? 'Verification Successful!' : 'Verification Failed'}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Button */}
                    <button
                        onClick={handleContinue}
                        className={`px-4 py-2 rounded-md font-medium ${success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
                    >
                        {success ? 'Continue to Login' : 'Try Again'}
                    </button>
                </div>
            </div>
        </div>
    );
}