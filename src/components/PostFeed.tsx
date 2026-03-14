"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Camera } from "lucide-react";
import { useGetPosts } from "@/hooks/usePosts";
import { PostCard } from "./PostCard";

function SkeletonCard() {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-3/5" />
      </div>
      <div className="px-4 pb-3 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function PostFeed() {
  const { data: posts, isLoading, isError, error } = useGetPosts();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-2 px-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <div className="px-4 py-12 text-center">
          <p className="text-red-500 text-sm font-medium">Failed to load posts</p>
          <p className="text-gray-400 text-xs mt-1">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      )}

      {!isLoading && !isError && posts && posts.length === 0 && (
        <div className="text-center py-20 px-4">
          <div className="w-20 h-20 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center mx-auto mb-4">
            <Camera size={36} className="text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-1">No Posts Yet</h3>
          <p className="text-gray-400 text-sm">Be the first to share something!</p>
        </div>
      )}

      {!isLoading && posts && posts.length > 0 && (
        <div className="flex flex-col gap-2 pb-16 px-2 pt-2">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl overflow-hidden shadow-sm">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform animate-fade-in-up"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
