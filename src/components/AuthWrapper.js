"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require login
  const publicRoutes = ["/login", "/register", "/forgot-password"];

  // If no user AND trying to access a protected page → redirect to /login
  if (!user && !publicRoutes.includes(pathname)) {
    router.push("/login");
    return null;
  }

  // If user exists AND trying to access login → redirect to dashboard
  if (user && pathname === "/login") {
    router.push("/dashboard"); // Change "/dashboard" to your app's main page
    return null;
  }

  // Otherwise, show the page
  return <>{children}</>;
}