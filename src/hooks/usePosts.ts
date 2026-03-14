"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostStore } from "@/store/usePostStore";
import { useToastStore } from "@/store/useToastStore";

export interface Post {
  id: string;
  content: string;
  authorName: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const POSTS_KEY = ["posts"] as const;

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function createPost({ content, authorName }: { content: string; authorName: string }): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorName }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}

async function likePost(id: string): Promise<Post> {
  const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to like post");
  return res.json();
}

export function useGetPosts() {
  const isTyping = usePostStore((s) => s.isTyping);
  const setLastUpdatedAt = usePostStore((s) => s.setLastUpdatedAt);
  return useQuery({
    queryKey: POSTS_KEY,
    queryFn: async () => {
      const data = await fetchPosts();
      setLastUpdatedAt(new Date());
      return data;
    },
    staleTime: 5000,
    refetchInterval: isTyping ? false : 10000,
    refetchIntervalInBackground: false,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const resetInput = usePostStore((s) => s.resetInput);
  const setIsPosting = usePostStore((s) => s.setIsPosting);

  return useMutation({
    mutationFn: createPost,
    onMutate: async ({ content, authorName }) => {
      setIsPosting(true);
      await queryClient.cancelQueries({ queryKey: POSTS_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_KEY);
      const optimistic: Post = {
        id: "opt-" + Date.now(),
        content,
        authorName,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Post[]>(POSTS_KEY, (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );
      return { previous };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: POSTS_KEY });
      resetInput();
      setIsPosting(false);
      useToastStore.getState().addToast("Post published!", "success");
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Post[]>(POSTS_KEY, context.previous);
      }
      setIsPosting(false);
      useToastStore.getState().addToast("Failed to publish post", "error");
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: POSTS_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_KEY);
      queryClient.setQueryData<Post[]>(POSTS_KEY, (old) =>
        old ? old.filter((p) => p.id !== id) : []
      );
      return { previous };
    },
    onSuccess: () => {
      useToastStore.getState().addToast("Post deleted", "info");
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Post[]>(POSTS_KEY, context.previous);
      }
      useToastStore.getState().addToast("Failed to delete post", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: POSTS_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_KEY);
      queryClient.setQueryData<Post[]>(POSTS_KEY, (old) =>
        old ? old.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)) : []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Post[]>(POSTS_KEY, context.previous);
      }
      useToastStore.getState().addToast("Failed to like post", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}
