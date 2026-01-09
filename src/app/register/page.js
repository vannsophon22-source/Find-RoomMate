"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { FaEye, FaEyeSlash, FaTelegram, FaUser, FaEnvelope, FaLock, FaVenusMars } from "react-icons/fa";

// ---------------- Alert Component ----------------
function Alert({ message, type = "success", onClose }) {
  const styles = type === "success" 
    ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
    : "bg-gradient-to-r from-red-500 to-red-600 text-white";

  return (
    <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl ${styles} z-50`}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="text-xl font-bold hover:text-gray-200 transition">
          &times;
        </button>
      </div>
    </div>
  );
}

// ---------------- Input Component ----------------
function InputField({ 
  label, 
  placeholder, 
  value, 
  setValue, 
  type = "text", 
  disabled = false,
  icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword
}) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-white flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 pl-12 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-70 disabled:cursor-not-allowed transition"
          required
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
          {icon}
        </div>
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition"
            disabled={disabled}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------- Page ----------------
export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2
  const [telegramId, setTelegramId] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ---------------- Step 1 ----------------
  const goNext = () => {
    setAlert(null);

    if (!name || !email || !password || !confirmPassword || !gender) {
      setAlert({ message: "Please fill in all fields", type: "error" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: "Please enter a valid email address", type: "error" });
      return;
    }

    // Password validation
    if (password.length < 6) {
      setAlert({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match", type: "error" });
      return;
    }

    // Check if email is already taken (demo purpose)
    if (email === "admin@property.com" || email === "owner@property.com") {
      setAlert({ message: "Email is already registered. Please use a different email.", type: "error" });
      return;
    }

    setAlert(null);
    setStep(2);
  };

  // ---------------- Fake OTP ----------------
  const sendOTP = () => {
    setAlert(null);
    
    if (!telegramId) {
      setAlert({ message: "Telegram ID is required", type: "error" });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setAlert({ 
        message: `OTP sent to Telegram ID: ${telegramId}! Use 1234 to verify.`, 
        type: "success" 
      });
      setLoading(false);
    }, 1000);
  };

  // ---------------- Fake Register ----------------
  const register = () => {
    setAlert(null);

    if (!otp) {
      setAlert({ message: "OTP is required", type: "error" });
      return;
    }

    if (otp !== "1234") {
      setAlert({ message: "Invalid OTP. Use 1234 to register.", type: "error" });
      return;
    }

    setLoading(true);

    // Simulate registration API call
    setTimeout(() => {
      // Determine role based on email (demo purpose)
      let role = "tenant";
      if (email.includes("admin")) role = "admin";
      else if (email.includes("owner")) role = "owner";

      const user = {
        id: Date.now(),
        name,
        email,
        telegramId,
        telegramUsername,
        gender,
        role,
        avatar: "/users/default-avatar.svg",
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      if (setUser) setUser(user);

      setAlert({ 
        message: `Registration successful! Welcome ${name}. You are registered as a ${role}.`, 
        type: "success" 
      });

      setLoading(false);

      // Redirect after success message
      setTimeout(() => {
        router.push("/dashboard/user/homepage");
      }, 1500);
    }, 1500);
  };

  // ---------------- UI ----------------
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {step === 1 ? "Create Account" : "Verify Telegram"}
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            {step === 1 ? "Join our property management platform" : "Connect your Telegram for updates"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? "bg-yellow-400 text-black" : "bg-green-500 text-white"}`}>
              1
            </div>
            <div className={`h-1 w-16 ${step === 2 ? "bg-green-500" : "bg-white/30"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? "bg-yellow-400 text-black" : "bg-white/30 text-white"}`}>
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              setValue={setName}
              type="text"
              disabled={loading}
              icon={<FaUser />}
            />

            <InputField
              label="Email Address"
              placeholder="example@email.com"
              value={email}
              setValue={setEmail}
              type="email"
              disabled={loading}
              icon={<FaEnvelope />}
            />

            <InputField
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              setValue={setPassword}
              type={showPassword ? "text" : "password"}
              disabled={loading}
              icon={<FaLock />}
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              type={showConfirmPassword ? "text" : "password"}
              disabled={loading}
              icon={<FaLock />}
              showPasswordToggle={true}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <div className="space-y-2">
              <label className="block font-medium text-white flex items-center gap-2">
                <FaVenusMars />
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g.toLowerCase())}
                    className={`p-3 rounded-xl text-center transition ${
                      gender === g.toLowerCase()
                        ? "bg-yellow-400 text-black font-bold"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    disabled={loading}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={goNext}
              disabled={loading}
              className={`w-full py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
              }`}
            >
              {loading ? "Processing..." : "Continue to Verification"}
            </button>

            <p className="text-center text-white mt-4">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-yellow-300 hover:text-yellow-200 hover:underline font-medium transition"
              >
                Sign in here
              </a>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <InputField
              label="Telegram ID"
              placeholder="@username or phone number"
              value={telegramId}
              setValue={setTelegramId}
              type="text"
              disabled={loading || otpSent}
              icon={<FaTelegram />}
            />

            <InputField
              label="Telegram Username (Optional)"
              placeholder="username without @"
              value={telegramUsername}
              setValue={setTelegramUsername}
              type="text"
              disabled={loading || otpSent}
              icon={<FaUser />}
            />

            {!otpSent ? (
              <button
                onClick={sendOTP}
                disabled={loading}
                className={`w-full py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
                  loading
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            ) : (
              <>
                <InputField
                  label="Verification Code"
                  placeholder="Enter 1234 to verify"
                  value={otp}
                  setValue={setOtp}
                  type="text"
                  disabled={loading}
                  icon={<span className="text-lg">🔒</span>}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setAlert(null);
                    }}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition disabled:opacity-70"
                  >
                    Resend OTP
                  </button>
                  
                  <button
                    onClick={register}
                    disabled={loading}
                    className={`flex-1 py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
                      loading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setStep(1)}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition disabled:opacity-70"
            >
              ← Back to Account Details
            </button>
          </div>
        )}

        {/* Demo Info */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-white/60 text-xs">
          <p>🔐 This is a demo registration. No real data is stored.</p>
          <p className="mt-1">Use OTP: <span className="font-bold text-yellow-300">1234</span> for verification</p>
        </div>
      </div>
    </div>
  );
}