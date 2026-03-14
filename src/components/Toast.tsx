"use client";

import { useToastStore } from "@/store/useToastStore";
import { X, CheckCircle2, XCircle, Info } from "lucide-react";

export function Toast() {
  const { toasts, removeToast } = useToastStore();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-slide-up ${
            toast.type === "success"
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={15} className="flex-shrink-0" />
          ) : toast.type === "error" ? (
            <XCircle size={15} className="flex-shrink-0" />
          ) : (
            <Info size={15} className="flex-shrink-0" />
          )}
          <span className="flex-1 whitespace-nowrap">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
