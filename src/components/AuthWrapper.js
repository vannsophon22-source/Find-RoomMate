"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for hydration
    
    // If no user AND not on auth pages, redirect to login
    if (!user && pathname !== "/login" && pathname !== "/register") {
      router.replace('/login');
    }
    
    // If user exists AND is on auth pages, redirect to home/dashboard
    if (user && (pathname === "/login" || pathname === "/register")) {
      router.replace('/'); // or '/dashboard'
    }
  }, [user, loading, pathname, router]);

  // Show loading state while checking authentication
  if (loading) {
    return null; // or return a loading spinner component
  }

  // For auth pages, always show them (redirection logic is in useEffect)
  if (pathname === "/login" || pathname === "/register") {
    return children;
  }

  // For protected pages, only show if user exists
  if (!user) {
    return null; // or a loading spinner
  }

  return children;
}