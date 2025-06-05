'use client';

const SocialAuth = () => (
    <div className="auth-social-buttons">
        <button type="button" className="auth-social-btn">
            <svg className="auth-social-icon" viewBox="0 0 24 24">
                {/* Google icon SVG */}
            </svg>
            Continue with Google
        </button>
        <button type="button" className="auth-social-btn">
            <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                {/* Apple icon SVG */}
            </svg>
            Continue with Apple
        </button>
    </div>
);

export default SocialAuth;