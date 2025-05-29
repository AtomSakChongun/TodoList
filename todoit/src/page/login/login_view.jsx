import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { GetLogin } from '../../service/user_service';
import { showError } from '../../componet/alertCustom/alertcusrom';

export default function Login_View() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Attempt to login and wait for result
            await handleLogIn();
            console.log("Login success!");
    
            // Navigate after successful login
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            showError(error.message); // You can customize this to show error messages
        }
    };
    
    const handleLogIn = async () => {
        try {
            const response = await GetLogin(email, password);
            // console.log("Login successful:", response);
    
            const token = response.token;
            const user_id = response.id
    
            // Save token based on rememberMe
            if (rememberMe) {
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);
                localStorage.setItem("user_id",user_id)
            } else {
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("user_id",user_id)
            }
    
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Rethrow to be caught in handleSubmit
        }
    };    
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
                {/* แมวส้มที่มีแอนิเมชัน */}
                <div className="relative flex justify-center mb-6">
                    <div
                        className="w-32 h-32 bg-orange-400 rounded-full overflow-hidden relative transition-all duration-300"
                        style={{
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {/* หน้าแมว */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center">
                            {/* หูซ้าย */}
                            <div className="absolute w-12 h-12 bg-orange-400 rounded-full -top-3 -left-2 transform rotate-45 before:content-[''] before:absolute before:w-8 before:h-8 before:bg-orange-200 before:rounded-full before:top-2 before:left-2"></div>
                            {/* หูขวา */}
                            <div className="absolute w-12 h-12 bg-orange-400 rounded-full -top-3 -right-2 transform -rotate-45 before:content-[''] before:absolute before:w-8 before:h-8 before:bg-orange-200 before:rounded-full before:top-2 before:right-2"></div>
                        </div>

                        {/* ตา */}
                        <div className="absolute top-12 left-0 right-0 flex justify-center space-x-8">
                            <div className={`w-4 h-${isHovering ? '1' : '4'} bg-black rounded-full transition-all duration-300`}></div>
                            <div className={`w-4 h-${isHovering ? '1' : '4'} bg-black rounded-full transition-all duration-300`}></div>
                        </div>

                        {/* จมูก */}
                        <div className="absolute top-16 left-0 right-0 flex justify-center">
                            <div className="w-3 h-2 bg-pink-400 rounded-full"></div>
                        </div>

                        {/* ปาก */}
                        <div className="absolute top-18 left-0 right-0 flex justify-center">
                            <div className="w-8 h-2 flex justify-center">
                                <div className="border-b border-black w-2"></div>
                                <div className="border-b border-black w-2"></div>
                            </div>
                        </div>

                        {/* หนวด */}
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
                    Cat Task Manager
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
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
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div></div>
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={()=>setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
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
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-orange-600 hover:text-orange-500" onClick={()=>{navigate('/resgister')}}>
                            Register now
                        </a>
                    </p>
                </div>

                {/* เท้าแมวที่เคลื่อนไหวได้ */}
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