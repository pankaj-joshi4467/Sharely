"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, Send } from "lucide-react";
import { useGetComments, useCreateComment, useDeleteComment } from "@/hooks/useComments";
import { useUserStore } from "@/store/useUserStore";
import { getAvatarGradient, formatRelativeTime } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface CommentSectionProps {
  postId: string;
  onNeedName: (cb: (name: string) => void) => void;
}

export function CommentSection({ postId, onNeedName }: CommentSectionProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const authorName = useUserStore((s) => s.authorName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: comments = [], isLoading } = useGetComments(postId);
  const { mutate: createComment, isPending: isPosting } = useCreateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isPosting) return;

    const name = mounted ? authorName : "";
    if (!name) {
      onNeedName((savedName) => {
        createComment({ postId, content: trimmed, authorName: savedName });
        setInput("");
      });
      return;
    }
    createComment({ postId, content: trimmed, authorName: name });
    setInput("");
  }

  return (
    <div className="border-t border-purple-100/70 dark:border-gray-800">
      {/* Comment list */}
      {isLoading ? (
        <div className="px-4 py-3 flex items-center gap-2 text-gray-400 text-xs">
          <Spinner size={12} />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="px-4 py-3 text-[12px] text-gray-400 dark:text-gray-500">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="px-4 pt-2 pb-1 space-y-3">
          {comments.map((comment) => {
            const grad = getAvatarGradient(comment.authorName);
            const initial = comment.authorName.charAt(0).toUpperCase();
            const isOptimistic = comment.id.startsWith("opt-");
            return (
              <div key={comment.id} className={`flex items-start gap-2 group ${isOptimistic ? "opacity-60" : ""}`}>
                {/* Mini avatar */}
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0 mt-0.5`}>
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-900 dark:text-gray-100 leading-snug">
                    <span className="font-semibold mr-1.5">{comment.authorName}</span>
                    {comment.content}
                  </p>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                {/* Delete button — always visible on mobile, hover on desktop */}
                {!isOptimistic && (
                  <button
                    onClick={() => deleteComment({ postId, commentId: comment.id })}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-0.5"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comment input — Instagram style */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-2.5 border-t border-purple-100/70 dark:border-gray-800">
        {/* Current user avatar */}
        {mounted && authorName ? (
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient(authorName)} flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0`}>
            {authorName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 300))}
          placeholder="Add a comment..."
          className="flex-1 text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 bg-transparent focus:outline-none"
          disabled={isPosting}
        />

        {input.trim().length > 0 && (
          <button
            type="submit"
            disabled={isPosting}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-[13px] disabled:opacity-40 transition-colors flex-shrink-0"
          >
            {isPosting ? <Spinner size={14} /> : <Send size={15} />}
          </button>
        )}
      </form>
    </div>
  );
}
