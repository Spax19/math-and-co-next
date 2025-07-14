"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "../../../components/loadingSpinner";
import "react-toastify/dist/ReactToastify.css";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (email) {
      toast.info(`Verification email sent to ${email}`);
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0 && isResending) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isResending) {
      setIsResending(false);
      setCountdown(60);
    }
  }, [countdown, isResending]);

  const handleResendEmail = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setCountdown(60);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email resent successfully!");
      } else {
        throw new Error(data.message || "Failed to resend email");
      }
    } catch (error) {
      toast.error(error.message);
      setIsResending(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-email-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="verify-email-title">Verify Your Email</h1>

        <p className="verify-email-description">
          We've sent a verification link to{" "}
          <span className="verify-email-highlight">{email}</span>. Please check
          your inbox and click the link to complete your registration.
        </p>

        <div className="verify-email-notice">
          <p className="verify-email-notice-text">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`verify-email-resend-btn ${
                isResending ? "verify-email-resend-btn-disabled" : ""
              }`}
            >
              {isResending
                ? `Resend in ${countdown}s`
                : "resend verification email"}
            </button>
          </p>
        </div>

        <div className="verify-email-btn-group">
          <Link href="/login" className="verify-email-primary-btn">
            Back to Login
          </Link>
          <Link href="/" className="verify-email-secondary-btn">
            Go to Homepage
          </Link>
        </div>
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
