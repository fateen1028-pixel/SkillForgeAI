"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Placeholder for auth check
    // In production, check auth state from store/cookies
    const isAuthenticated = true; // For demo, always true
    
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [router]);

  return children;
}
