"use client";

import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // If user is already logged in, redirect to dashboard
      if (session?.user) {
        router.push("/dashboard");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect to dashboard after successful login
      if (session?.user) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const login = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p className="text-white">Welcome, {user.email}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
    >
      Sign in with Google
    </button>
  );
}
