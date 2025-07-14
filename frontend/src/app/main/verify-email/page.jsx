"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../components/loadingSpinner"; // 


const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="verify-email-icon"
  >
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.67 6.47a3 3 0 0 1-3.66 0L1.5 8.67Z" />
    <path d="M22.5 6.47L12 1.96 1.5 6.47a3 3 0 0 0-.64 1.13L12 16.03l11.14-8.43a3 3 0 0 0-.64-1.13Z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="verify-email-success-icon"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = () => (
  // Icon for error/failure
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="verify-email-icon" 
    style={{ color: "#EF4444" }} 
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
      clipRule="evenodd"
    />
  </svg>
);

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: "",
  });
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); 

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus({
            loading: false,
            success: true,
            message:
              "Email verified successfully! You will be redirected shortly.",
          });
        } else {
          throw new Error(
            data.message || "Verification failed. Please try again."
          );
        }
      } catch (error) {
        setVerificationStatus({
          loading: false,
          success: false,
          message: error.message || "Invalid or expired verification link.",
        });
      }
    };

    if (token) {
      verifyToken();
    } else {
      setVerificationStatus({
        loading: false,
        success: false,
        message:
          "Missing verification token. Please use the link from your email.",
      });
    }
  }, [token]);

  // Handle redirect after successful verification
  useEffect(() => {
    let timer;
    if (verificationStatus.success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (verificationStatus.success && countdown === 0) {
      router.push("/"); 
    }
    return () => clearTimeout(timer);
  }, [verificationStatus.success, countdown, router]);

  // Render different content based on verification status
  if (verificationStatus.loading) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <LoadingSpinner /> {/* Use your actual LoadingSpinner component */}
          <h2 className="verify-email-title">Verifying your email...</h2>
          <p className="verify-email-description">
            Please wait while we confirm your account.
          </p>
        </div>
      </div>
    );
  }

  // If not loading, display success or failure
  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {verificationStatus.success ? (
          <>
            <CheckCircleIcon />
            <h2 className="verify-email-success-title">Email Verified!</h2>
            <p className="verify-email-success-description">
              {verificationStatus.message}
            </p>
            <p className="verify-email-countdown">
              Redirecting in {countdown} seconds...
            </p>
            <div
              className="verify-email-btn-group"
              style={{ marginTop: "1.5rem" }}
            >
              <a href="/" className="verify-email-primary-btn">
                Return Home
              </a>
            </div>
          </>
        ) : (
          <>
            <XCircleIcon /> {/* Or another appropriate icon for failure */}
            <h2 className="verify-email-title" style={{ color: "#DC2626" }}>
              Verification Failed!
            </h2>{" "}
            {/* Red color for error title */}
            <p className="verify-email-description">
              {verificationStatus.message}
            </p>
            <div className="verify-email-btn-group">
              <a href="/" className="verify-email-secondary-btn">
                Return Home
              </a>
            </div>
          </>
        )}
      </div>
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
