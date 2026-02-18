"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/database";

export const useBookmarks = (userId: string) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBookmarks = useCallback(async () => {
    // Skip fetching if userId is not provided or is "skip"
    if (!userId || userId === "skip") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchBookmarks();

    // Skip real-time subscription if userId is not available
    if (!userId || userId === "skip") {
      return;
    }

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookmarks, supabase, userId]);

  return { bookmarks, loading, refetch: fetchBookmarks };
};
