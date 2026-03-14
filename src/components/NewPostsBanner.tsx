"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type Post } from "@/hooks/usePosts";

const POSTS_KEY = ["posts"] as const;

export function NewPostsBanner() {
  const queryClient = useQueryClient();
  const [newCount, setNewCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.query.queryKey[0] === "posts" &&
        event.query.state.status === "success"
      ) {
        const posts = event.query.state.data as Post[] | undefined;
        if (!posts) return;

        if (!initializedRef.current) {
          posts.forEach((p) => knownIdsRef.current.add(p.id));
          initializedRef.current = true;
          return;
        }

        const fresh = posts.filter((p) => !knownIdsRef.current.has(p.id));
        if (fresh.length > 0) {
          setNewCount((c) => c + fresh.length);
          setVisible(true);
          fresh.forEach((p) => knownIdsRef.current.add(p.id));
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  function handleRefresh() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setVisible(false);
    setNewCount(0);
  }

  if (!visible) return null;

  return (
    <div className="fixed top-[60px] left-0 right-0 z-30 flex justify-center animate-slide-down">
      <button
        onClick={handleRefresh}
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-[13px] font-semibold transition-colors active:scale-95"
      >
        {newCount} new {newCount === 1 ? "post" : "posts"}
      </button>
    </div>
  );
}
