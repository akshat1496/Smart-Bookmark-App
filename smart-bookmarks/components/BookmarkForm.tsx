"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

interface BookmarkFormProps {
  userId: string;
  onBookmarkAdded?: () => void;
}

export default function BookmarkForm({
  userId,
  onBookmarkAdded,
}: BookmarkFormProps) {
  const supabase = createClient();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addBookmark = async () => {
    if (!url.trim() || !title.trim()) {
      alert("Please fill in both title and URL fields");
      return;
    }

    setIsLoading(true);
    try {
      await supabase.from("bookmarks").insert({
        url: url.startsWith("http") ? url : `https://${url}`,
        title: title.trim(),
        user_id: userId,
      });

      setUrl("");
      setTitle("");

      // Call the callback to refresh parent component
      if (onBookmarkAdded) {
        onBookmarkAdded();
      }

      alert("Bookmark added successfully!");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Failed to add bookmark. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      addBookmark();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center space-x-2 text-sm font-bold text-emerald-800 mb-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            ></path>
          </svg>
          <span>Bookmark Title</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-400 text-gray-900 placeholder-gray-600 shadow-sm focus:shadow-md font-medium"
            placeholder="Enter a descriptive title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm font-bold text-blue-800 mb-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            ></path>
          </svg>
          <span>Website URL</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
              ></path>
            </svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-400 text-gray-900 placeholder-gray-600 shadow-sm focus:shadow-md font-medium"
            placeholder="https://example.com or example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <button
        onClick={addBookmark}
        disabled={isLoading}
        className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:from-emerald-400 disabled:to-teal-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Add Bookmark</span>
          </>
        )}
      </button>
    </div>
  );
}
