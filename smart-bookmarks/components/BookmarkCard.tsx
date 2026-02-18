"use client";

import { createClient } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/database";
import { useState } from "react";

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
        .hostname;
      return domain.replace("www.", "");
    } catch {
      return url;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group relative bg-white border-2 border-gray-300 rounded-xl p-6 hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Bookmark Title */}
          <a
            href={
              bookmark.url.startsWith("http")
                ? bookmark.url
                : `https://${bookmark.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="block group-hover:text-blue-600 transition-colors duration-200"
          >
            <h3 className="text-lg font-bold text-gray-900 truncate mb-2">
              {bookmark.title}
            </h3>
          </a>

          {/* URL Display */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full shrink-0"></div>
            <span className="text-sm text-gray-700 truncate font-medium">
              {getDomain(bookmark.url)}
            </span>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-500 font-medium">
            Added {formatDate(bookmark.created_at)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={
              bookmark.url.startsWith("http")
                ? bookmark.url
                : `https://${bookmark.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Open bookmark"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
          </a>
          <button
            onClick={remove}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Delete bookmark"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            ) : (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Hover Effect Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
}
