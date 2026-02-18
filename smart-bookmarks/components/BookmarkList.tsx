"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import BookmarkCard from "@/components/BookmarkCard";

export default function BookmarkList({ userId }: { userId: string }) {
  const { bookmarks, loading } = useBookmarks(userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-linear-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
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
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No bookmarks yet!
        </h3>
        <p className="text-gray-700 font-medium mb-6 max-w-md mx-auto">
          Start building your collection by adding your first bookmark. Save
          interesting articles, useful tools, or any website you want to
          remember.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Organize</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Access anywhere</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Never lose a link</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
