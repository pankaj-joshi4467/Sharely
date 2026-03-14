"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/useToastStore";

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  postId: string;
  createdAt: string;
}

function commentsKey(postId: string) {
  return ["comments", postId] as const;
}

async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`/api/posts/${postId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

async function createComment({
  postId,
  content,
  authorName,
}: {
  postId: string;
  content: string;
  authorName: string;
}): Promise<Comment> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorName }),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

async function deleteComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}

export function useGetComments(postId: string) {
  return useQuery({
    queryKey: commentsKey(postId),
    queryFn: () => fetchComments(postId),
    staleTime: 10000,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onMutate: async ({ content, authorName }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previous = queryClient.getQueryData<Comment[]>(commentsKey(postId));
      const optimistic: Comment = {
        id: "opt-" + Date.now(),
        content,
        authorName,
        postId,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Comment[]>(commentsKey(postId), (old) =>
        old ? [...old, optimistic] : [optimistic]
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Comment[]>(commentsKey(postId), context.previous);
      }
      useToastStore.getState().addToast("Failed to post comment", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previous = queryClient.getQueryData<Comment[]>(commentsKey(postId));
      queryClient.setQueryData<Comment[]>(commentsKey(postId), (old) =>
        old ? old.filter((c) => c.id !== commentId) : []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Comment[]>(commentsKey(postId), context.previous);
      }
      useToastStore.getState().addToast("Failed to delete comment", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
    },
  });
}
