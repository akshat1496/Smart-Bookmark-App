"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get bookmarks count - only fetch when user is available
  const { bookmarks, refetch } = useBookmarks(user?.id || "skip");

  const handleBookmarkAdded = () => {
    // Force refresh bookmarks
    refetch();
  };

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="bg-linear-to-br from-white to-purple-50 p-8 rounded-xl shadow-xl border border-purple-200">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <div className="text-xl font-semibold text-gray-700">
              Loading your bookmarks...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="bg-linear-to-br from-white to-purple-50 p-8 rounded-xl shadow-xl border border-purple-200">
          <div className="text-xl font-semibold text-gray-700">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-100/20 via-transparent to-purple-100/20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-linear-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-linear-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-linear-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-linear-to-r from-white/90 to-gray-50/90 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
                <div className="bg-linear-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    ></path>
                  </svg>
                </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Bookmarks
                </h1>
                <p className="text-sm text-gray-500">
                  Organize your digital life
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.name ||
                    user.email?.split("@")[0] ||
                    "User"}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {(user.user_metadata?.name ||
                    user.email ||
                    "U")[0].toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-6 py-2.5 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Bookmark Section - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-200 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg relative group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-black group-hover:animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      ></path>
                    </svg>
                    <div className="absolute -top-1 -right-1 bg-emerald-300 rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                      <svg
                        className="w-2.5 h-2.5 text-emerald-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Add New Bookmark
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <BookmarkForm
                  userId={user.id}
                  onBookmarkAdded={handleBookmarkAdded}
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-6">
              <div className="text-center">
                <div className="bg-linear-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Collection
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {user ? bookmarks.length : 0}
                </p>
                <p className="text-sm text-gray-500">Total bookmarks</p>
              </div>
            </div>
          </div>

          {/* Bookmarks List Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-linear-to-r from-blue-500 to-purple-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg relative group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="w-6 h-6 text-black group-hover:animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        ></path>
                      </svg>
                      {user && bookmarks.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-300 rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                          <span className="text-xs font-bold text-blue-800">
                            {bookmarks.length > 99 ? "99+" : bookmarks.length}
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Your Bookmarks
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-black">
                        Recently Added
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BookmarkList userId={user.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
