"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // wait until user state is loaded

    const publicRoutes = ["/login", "/register", "/forgot-password"];

    // Redirect non-logged in users away from dashboard
    if (!user && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }

    // Redirect logged in users away from login/register pages
    if (user && publicRoutes.includes(pathname)) {
      router.replace("/dashboard/user/homepage");
    }
  }, [user, loading, pathname, router]);

  if (loading) return null; // optional: add loading spinner here

  return children;
}
