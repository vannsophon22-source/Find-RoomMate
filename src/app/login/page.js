"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { setUser } = useUser() || {};

  // Predefined demo Google accounts
  const demoGoogleAccounts = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      role: "tenant"
    },
    {
      id: 2,
      name: "Sam Wilson",
      email: "sam.wilson@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      role: "tenant"
    },
    {
      id: 3,
      name: "Taylor Swift",
      email: "taylor.swift@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
      role: "owner"
    },
    {
      id: 4,
      name: "Jordan Lee",
      email: "jordan.lee@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      role: "admin"
    },
    {
      id: 5,
      name: "Casey Kim",
      email: "casey.kim@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
      role: "tenant"
    }
  ];

  // Mock Google OAuth popup simulation
  const showGoogleAccountSelector = () => {
    return new Promise((resolve) => {
      // In a real app, this would be a Google OAuth popup
      // For demo, we'll simulate with a custom modal
      const selectedAccount = demoGoogleAccounts[
        Math.floor(Math.random() * demoGoogleAccounts.length)
      ];
      
      // Simulate network delay
      setTimeout(() => resolve(selectedAccount), 800);
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loading) return;

    setAlert(null);
    setLoading(true);

    if (!identifier || !password) {
      setAlert({ 
        message: "Please enter your email/Telegram ID and password!", 
        type: "error" 
      });
      setLoading(false);
      return;
    }

    // Validate password (demo purpose - minimum 6 chars)
    if (password.length < 6) {
      setAlert({ 
        message: "Password must be at least 6 characters!", 
        type: "error" 
      });
      setLoading(false);
      return;
    }

    // Determine role based on email
    let role = "tenant";
    if (identifier === "admin@property.com") role = "admin";
    else if (identifier === "owner@property.com") role = "owner";

    const userData = {
      id: Date.now(),
      name: identifier.split("@")[0] || identifier,
      email: identifier.includes("@") ? identifier : undefined,
      telegramId: !identifier.includes("@") ? identifier : undefined,
      identifier,
      role,
      avatar: "/users/default-avatar.svg",
      authMethod: "email",
      lastLogin: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    if (setUser) setUser(userData);

    setAlert({
      message: `Login successful! Welcome back, ${userData.name}. Role: ${role}.`,
      type: "success",
    });

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    
    setGoogleLoading(true);
    setAlert(null);

    try {
      // Show loading animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate Google OAuth popup
      console.log("Opening Google login popup...");
      
      const googleUser = await showGoogleAccountSelector();
      
      console.log("Google authentication successful:", googleUser);
      
      const userData = {
        id: googleUser.id * 1000 + Date.now(), // Unique ID
        name: googleUser.name,
        email: googleUser.email,
        identifier: googleUser.email,
        role: googleUser.role,
        avatar: googleUser.avatar,
        authMethod: "google",
        isGoogleUser: true,
        lastLogin: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authMethod", "google");

      if (setUser) setUser(userData);

      setAlert({
        message: `Google login successful! Welcome ${googleUser.name}.`,
        type: "success",
      });

    } catch (error) {
      console.error("Google login error:", error);
      setAlert({
        message: "Failed to login with Google. Please try again.",
        type: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Quick login for demo purposes
  const handleQuickLogin = (account) => {
    setIdentifier(account.email);
    setPassword("demo123"); // Default demo password
    
    // Auto-trigger login after a short delay
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleLogin(event);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-4 md:p-6">
      <div className="bg-white/20 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {alert && (
          <Alert 
            message={alert.message} 
            type={alert.type} 
            onClose={() => setAlert(null)} 
          />
        )}

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="w-24 h-20 md:w-32 md:h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80 text-sm md:text-base">Sign in to manage your properties</p>
        </div>

        {/* Google Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-2xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
          >
            {googleLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                <span className="text-base">Continue with Google</span>
              </>
            )}
          </button>
          
          <p className="text-white/70 text-xs mt-2 text-center">
            {googleLoading ? "Simulating Google OAuth popup..." : "No backend required - Demo mode"}
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-transparent text-white text-sm font-medium">OR</span>
          </div>
        </div>

        {/* Traditional Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium text-white flex items-center gap-2">
              <span>✉️</span>
              Email or Telegram ID
            </label>
            <input
              type="text"
              placeholder="admin@property.com / owner@property.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading || googleLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-70 disabled:cursor-not-allowed transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-70 disabled:cursor-not-allowed"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition"
                disabled={loading || googleLoading}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <p className="text-white/60 text-xs">Demo password: 6 characters minimum</p>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className={`w-full py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
              loading || googleLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Quick Login Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="text-white font-semibold mb-3 text-center">Quick Demo Login</h3>
          <div className="grid grid-cols-2 gap-2">
            {demoGoogleAccounts.slice(0, 4).map((account) => (
              <button
                key={account.id}
                onClick={() => handleQuickLogin(account)}
                disabled={loading || googleLoading}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs flex flex-col items-center justify-center gap-1 transition hover:scale-[1.02] disabled:opacity-50"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  {account.role === "admin" ? "👑" : account.role === "owner" ? "🏠" : "👤"}
                </div>
                <span className="truncate w-full text-center">{account.name.split(" ")[0]}</span>
                <span className="text-[10px] opacity-70">{account.role}</span>
              </button>
            ))}
          </div>
          <p className="text-white/60 text-xs mt-3 text-center">
            Click any account to auto-login (password: demo123)
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 space-y-3 text-center">
          <p className="text-white">
            New tenant?{" "}
            <a 
              href="/register" 
              className="text-yellow-300 hover:text-yellow-200 hover:underline font-medium transition"
            >
              Create an account
            </a>
          </p>
          
          <div className="text-white/80 text-sm">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
              <div className="bg-white/10 p-2 rounded">
                <span className="font-mono">admin@property.com</span>
                <div className="text-yellow-300 text-[10px]">Admin</div>
              </div>
              <div className="bg-white/10 p-2 rounded">
                <span className="font-mono">owner@property.com</span>
                <div className="text-yellow-300 text-[10px]">Owner</div>
              </div>
              <div className="bg-white/10 p-2 rounded">
                <span className="font-mono">any@gmail.com</span>
                <div className="text-yellow-300 text-[10px]">Tenant</div>
              </div>
            </div>
          </div>
          
          <p className="text-white/60 text-xs mt-4">
            🔒 This is a frontend-only demo. No real authentication.
          </p>
        </div>
      </div>
    </div>
  );
}

function Alert({ message, type = "success", onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const styles = {
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 left-4 md:left-auto md:right-4 md:w-96 px-4 py-3 rounded-xl shadow-2xl ${styles[type]} transform transition-all duration-300 z-50 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-[-20px] opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icons[type]}</span>
          <span className="font-medium">{message}</span>
        </div>
        <button 
          onClick={handleClose}
          className="text-white hover:text-gray-200 text-xl font-bold transition"
        >
          &times;
        </button>
      </div>
    </div>
  );
}