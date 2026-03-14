"use client";

import { useState, useEffect, useRef } from "react";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { useCreatePost } from "@/hooks/usePosts";
import { NameModal } from "./NameModal";
import { getAvatarGradient } from "@/lib/utils";

const MAX_CHARS = 280;

export function CreatePost() {
  const inputValue = usePostStore((s) => s.inputValue);
  const isPosting = usePostStore((s) => s.isPosting);
  const setInputValue = usePostStore((s) => s.setInputValue);
  const setIsTyping = usePostStore((s) => s.setIsTyping);
  const authorName = useUserStore((s) => s.authorName);
  const setAuthorName = useUserStore((s) => s.setAuthorName);
  const { mutate: createPost } = useCreatePost();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const remaining = MAX_CHARS - inputValue.length;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) setInputValue(val);
  }

  function handleBlur() {
    setIsTyping(false);
  }

  function submit(name: string) {
    const trimmed = inputValue.trim();
    if (!trimmed || isPosting) return;
    createPost({ content: trimmed, authorName: name });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isPosting) return;
    const name = mounted ? authorName : "";
    if (!name) {
      setShowNameModal(true);
      return;
    }
    submit(name);
  }

  function handleNameSave(name: string) {
    setAuthorName(name);
    setShowNameModal(false);
    submit(name);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const isDisabled = inputValue.trim().length === 0 || isPosting;
  const displayName = mounted ? authorName : "";
  const avatarGradient = displayName
    ? getAvatarGradient(displayName)
    : "from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700";
  const initials = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <>
      {showNameModal && (
        <NameModal onSave={handleNameSave} onClose={() => setShowNameModal(false)} />
      )}

      {/* Instagram-style create post */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm mx-2 mt-2 mb-0 rounded-xl shadow-sm px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Avatar with IG gradient ring */}
          <button
            onClick={() => setShowNameModal(true)}
            className="flex-shrink-0 relative group"
          >
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white dark:ring-gray-950`}>
                {initials}
              </div>
            </div>
          </button>

          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-2 mb-1">
              {displayName ? (
                <button
                  onClick={() => setShowNameModal(true)}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
                >
                  {displayName}
                </button>
              ) : (
                <button
                  onClick={() => setShowNameModal(true)}
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Set your name...
                </button>
              )}
            </div>

            {/* Text input */}
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                rows={2}
                className="w-full resize-none bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none leading-relaxed"
                disabled={isPosting}
              />

              {/* Bottom bar */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  {inputValue.length > 0 && (
                    <span className={`text-xs tabular-nums ${
                      remaining <= 10
                        ? "text-red-500 font-bold"
                        : remaining <= 40
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}>
                      {remaining}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-300 dark:text-gray-700 hidden sm:block">
                    Ctrl+Enter
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="text-[14px] font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {isPosting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sharing...
                    </>
                  ) : "Share"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
