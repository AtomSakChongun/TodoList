import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showError, showSuccess } from '../../componet/alertCustom/alertcusrom';

export default function ForgotPassword_View() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = Array(6).fill(0).map(() => React.createRef());

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Attempt to request password reset and send OTP
            setIsEmailSubmitted(true);
            showSuccess("OTP sent to your email!");
            startCountdown();
        } catch (error) {
            console.error("Password reset request error:", error);
            showError(error.message);
        }
    };

    const startCountdown = () => {
        setIsResendDisabled(true);
        setCountdown(60);
        
        const timer = setInterval(() => {
            setCountdown(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
    };

    const handleResendOtp = () => {
        showSuccess("OTP resent to your email!");
        startCountdown();
    };

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character if pasting multiple digits
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // On backspace, clear current field and focus previous if empty
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        // Check if pasted content is numeric and not longer than 6 digits
        if (!/^\d+$/.test(pastedData) || pastedData.length > 6) return;
        
        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        
        // Focus the appropriate input after paste
        if (pastedData.length < 6) {
            inputRefs[pastedData.length].current.focus();
        }
    };

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            showError("Please enter a complete 6-digit OTP");
            return;
        }

        // Here you would typically verify the OTP with your backend
        // For this example, we'll simulate a successful verification
        setIsOtpVerified(true);
        showSuccess("OTP verified successfully!");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
                {/* Sleepy Cat Animation */}
                <div className="relative flex justify-center mb-6">
                    <div
                        className="w-32 h-32 bg-orange-400 rounded-full overflow-hidden relative transition-all duration-300"
                        style={{
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {/* Face */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center">
                            {/* Left ear */}
                            <div className="absolute w-12 h-12 bg-orange-400 rounded-full -top-3 -left-2 transform rotate-45 before:content-[''] before:absolute before:w-8 before:h-8 before:bg-orange-200 before:rounded-full before:top-2 before:left-2"></div>
                            {/* Right ear */}
                            <div className="absolute w-12 h-12 bg-orange-400 rounded-full -top-3 -right-2 transform -rotate-45 before:content-[''] before:absolute before:w-8 before:h-8 before:bg-orange-200 before:rounded-full before:top-2 before:right-2"></div>
                        </div>

                        {/* Eyes - sleepy Z's when hovering */}
                        <div className="absolute top-12 left-0 right-0 flex justify-center space-x-8">
                            {isHovering ? (
                                <>
                                    <div className="relative w-4 h-4">
                                        <div className="absolute w-2 h-2 bg-transparent border-t border-r border-black transform rotate-45 -top-1 -left-1"></div>
                                        <div className="absolute w-3 h-3 bg-transparent border-t border-r border-black transform rotate-45 top-0 left-0"></div>
                                        <div className="absolute w-4 h-4 bg-transparent border-t border-r border-black transform rotate-45 top-1 left-1"></div>
                                    </div>
                                    <div className="relative w-4 h-4">
                                        <div className="absolute w-2 h-2 bg-transparent border-t border-r border-black transform rotate-45 -top-1 -left-1"></div>
                                        <div className="absolute w-3 h-3 bg-transparent border-t border-r border-black transform rotate-45 top-0 left-0"></div>
                                        <div className="absolute w-4 h-4 bg-transparent border-t border-r border-black transform rotate-45 top-1 left-1"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-1 bg-black rounded-full"></div>
                                    <div className="w-4 h-1 bg-black rounded-full"></div>
                                </>
                            )}
                        </div>

                        {/* Nose */}
                        <div className="absolute top-16 left-0 right-0 flex justify-center">
                            <div className="w-3 h-2 bg-pink-400 rounded-full"></div>
                        </div>

                        {/* Mouth - slightly open and snoring when hovering */}
                        <div className="absolute top-18 left-0 right-0 flex justify-center">
                            {isHovering ? (
                                <div className="w-6 h-3 bg-pink-200 rounded-full"></div>
                            ) : (
                                <div className="w-8 h-2 flex justify-center">
                                    <div className="border-b border-black w-2"></div>
                                    <div className="border-b border-black w-2"></div>
                                </div>
                            )}
                        </div>

                        {/* Whiskers */}
                        <div className="absolute top-16 left-6 right-0 flex flex-col space-y-2">
                            <div className="w-12 h-px bg-gray-600 transform rotate-6"></div>
                            <div className="w-12 h-px bg-gray-600"></div>
                            <div className="w-12 h-px bg-gray-600 transform -rotate-6"></div>
                        </div>
                        <div className="absolute top-16 right-6 left-auto flex flex-col space-y-2">
                            <div className="w-12 h-px bg-gray-600 transform -rotate-6"></div>
                            <div className="w-12 h-px bg-gray-600"></div>
                            <div className="w-12 h-px bg-gray-600 transform rotate-6"></div>
                        </div>
                    </div>
                </div>

                <h2 className="text-center text-3xl font-extrabold text-orange-600">
                    {!isEmailSubmitted ? "Forgot Your Password?" : !isOtpVerified ? "Enter OTP" : "Password Reset Link Sent"}
                </h2>
                
                <p className="text-center text-sm text-gray-600">
                    {!isEmailSubmitted 
                        ? "Don't worry! Enter your email address and we'll send you an OTP to verify your identity."
                        : !isOtpVerified 
                        ? `We've sent a 6-digit OTP to ${email}. Please enter it below.`
                        : `We've sent a password reset link to ${email}. Please check your email and follow the instructions.`
                    }
                </p>

                {!isEmailSubmitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                        <div className="rounded-md shadow-sm">
                            <div className="mb-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ${isButtonHovered ? 'shadow-lg transform -translate-y-1' : ''}`}
                                onMouseEnter={() => setIsButtonHovered(true)}
                                onMouseLeave={() => setIsButtonHovered(false)}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className={`h-5 w-5 text-orange-300 group-hover:text-orange-200 transition-all duration-300 ${isButtonHovered ? 'animate-bounce' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                Send OTP
                            </button>
                        </div>
                    </form>
                ) : !isOtpVerified ? (
                    <div className="mt-6">
                        {/* OTP Input Fields */}
                        <div className="flex justify-center space-x-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={inputRefs[index]}
                                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                />
                            ))}
                        </div>

                        {/* Resend OTP */}
                        <div className="text-center mb-6">
                            <button
                                className={`text-sm font-medium ${isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:text-orange-500'}`}
                                onClick={handleResendOtp}
                                disabled={isResendDisabled}
                            >
                                {isResendDisabled 
                                    ? `Resend OTP in ${countdown}s` 
                                    : "Resend OTP"}
                            </button>
                        </div>

                        {/* Verify Button */}
                        <button
                            className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300`}
                            onClick={handleVerifyOtp}
                        >
                            Verify OTP
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 text-center">
                        <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700">
                                OTP verified successfully! We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-green-600 mt-2">
                                Please check your email and follow the instructions to reset your password.
                            </p>
                        </div>
                        
                        <button
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            onClick={() => navigate('/login')}
                        >
                            Return to Login
                        </button>
                    </div>
                )}

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <a href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                            Sign in
                        </a>
                    </p>
                </div>

                {/* Cat paw animation */}
                <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-6 h-6 bg-orange-300 rounded-full relative transition-transform duration-300 hover:scale-110"
                                style={{
                                    animation: `pawAnimation ${0.8 + i * 0.1}s infinite alternate`
                                }}
                            >
                                <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-200 rounded-full"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-200 rounded-full"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-200 rounded-full"></div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-200 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pawAnimation {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
}