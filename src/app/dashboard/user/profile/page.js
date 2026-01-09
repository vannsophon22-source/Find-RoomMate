"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, User, Mail, UserCircle, Edit2, ChevronLeft, CheckCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const { setUser } = useUser() || {};
  const fileInputRef = useRef(null);

  // State variables
  const [initialUser, setInitialUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/users/default-avatar.svg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage - only once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setInitialUser(parsedUser);
      setName(parsedUser.name || "");
      setEmail(parsedUser.email || parsedUser.identifier || "");
      setGender(parsedUser.gender || "");
      setAvatarPreview(parsedUser.avatar || "/users/default-avatar.svg");
    }
    setIsLoading(false);
  }, []);

  // Redirect to login if no user is found - using useEffect
  useEffect(() => {
    if (!isLoading && !initialUser && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [initialUser, isLoading, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File size must be less than 5MB");
    if (!file.type.startsWith("image/")) return alert("Please select an image file");

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = () => {
    if (!avatarFile) return alert("Please select an image first.");
    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { 
        ...initialUser, 
        avatar: reader.result,
        name,
        email,
        gender
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      setInitialUser(updatedUser);
      setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    };
    reader.readAsDataURL(avatarFile);
  };

  const handleProfileUpdate = () => {
    setIsSaving(true);
    
    const updatedUser = { 
      ...initialUser, 
      name, 
      email: email || initialUser?.email || initialUser?.identifier, 
      gender 
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (setUser) setUser(updatedUser);
    
    setInitialUser(updatedUser);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 500);
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authMethod");
    
    // Clear context
    if (setUser) setUser(null);
    
    // Show logout message briefly
    setSaveSuccess(true);
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 500);
  };

  const confirmSignOut = () => {
    setShowLogoutConfirm(true);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting (the useEffect will handle it)
  if (!initialUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Out</h3>
              <p className="text-gray-600">Are you sure you want to sign out?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            {saveSuccess && !showLogoutConfirm && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle size={18} />
                <span className="font-medium">Saved!</span>
              </div>
            )}
            <button
              onClick={confirmSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && !showLogoutConfirm && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <span className="text-green-700 font-medium">Profile updated successfully!</span>
              <p className="text-green-600 text-sm mt-1">Your changes have been saved.</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar & Info */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6 relative">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group">
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center transition-opacity duration-300 pb-4 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex items-center gap-2 text-white">
                    <Camera size={20} />
                    <span className="text-sm font-medium">Change Photo</span>
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
            </div>

            {avatarFile && (
              <div className="space-y-4 animate-fade-in">
                <button
                  onClick={handleAvatarUpload}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Upload New Avatar
                </button>
                <p className="text-sm text-gray-500 text-center truncate">
                  Selected: {avatarFile.name}
                </p>
              </div>
            )}

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{initialUser?.name || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email/Telegram</p>
                  <p className="font-medium text-gray-800">{initialUser?.email || initialUser?.identifier || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCircle size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800 capitalize">{initialUser?.gender || "Not specified"}</p>
                </div>
              </div>
              {initialUser?.role && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {initialUser.role === "admin" ? "👑" : initialUser.role === "owner" ? "🏠" : "👤"}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-800 capitalize">{initialUser.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <p className="text-gray-600 mt-2">Update your personal information and preferences</p>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  Email or Telegram ID
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your email or Telegram ID"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This will be used for login and notifications
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <UserCircle size={16} className="text-gray-400" />
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-4 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isSaving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Your profile information is stored locally in your browser
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `}</style>
    </div>
  );
}