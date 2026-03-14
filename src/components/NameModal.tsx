"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export function NameModal({ onSave, onClose }: NameModalProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-slide">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Set your name
          </h2>
          <div className="w-[18px]" />
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
            Choose a name so others know who&apos;s posting
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 50))}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-[14px] transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                {name.length}/50
              </span>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98]"
            >
              Continue
            </button>

            <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
              Saved locally for future posts
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
