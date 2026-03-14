"use client";

import { useState, useCallback } from "react";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useDeletePost, useLikePost, type Post } from "@/hooks/usePosts";
import { useUserStore } from "@/store/useUserStore";
import { getAvatarGradient, formatRelativeTime } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { CommentSection } from "./CommentSection";
import { NameModal } from "./NameModal";
import { useGetComments } from "@/hooks/useComments";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameModalCallback, setNameModalCallback] = useState<((name: string) => void) | null>(null);

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const hasLikedPost = useUserStore((s) => s.hasLikedPost);
  const addLikedPost = useUserStore((s) => s.addLikedPost);
  const setAuthorName = useUserStore((s) => s.setAuthorName);

  const { data: comments } = useGetComments(post.id);
  const commentCount = comments?.length ?? 0;

  const isLiked = hasLikedPost(post.id);
  const authorName = post.authorName || "Anonymous";
  const gradient = getAvatarGradient(authorName);
  const initials = authorName.charAt(0).toUpperCase();

  const handleLike = useCallback(() => {
    if (isLiking || isLiked) return;
    addLikedPost(post.id);
    likePost(post.id);
  }, [isLiking, isLiked, addLikedPost, likePost, post.id]);

  function handleDoubleTap() {
    if (!isLiked) handleLike();
    setShowDoubleTapHeart(true);
    setTimeout(() => setShowDoubleTapHeart(false), 800);
  }

  function handleDeleteClick() {
    if (isDeleting) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setShowMenu(false);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deletePost(post.id);
  }

  function handleNeedName(cb: (name: string) => void) {
    setNameModalCallback(() => cb);
    setShowNameModal(true);
  }

  function handleNameSave(name: string) {
    setAuthorName(name);
    setShowNameModal(false);
    if (nameModalCallback) {
      nameModalCallback(name);
      setNameModalCallback(null);
    }
  }

  return (
    <>
      {showNameModal && (
        <NameModal onSave={handleNameSave} onClose={() => setShowNameModal(false)} />
      )}

      <article className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-xs ring-[1.5px] ring-white dark:ring-gray-950`}>
                {initials}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white">{authorName}</span>
              <span className="text-gray-300 dark:text-gray-600 text-[10px]">&bull;</span>
              <time className="text-[12px] text-gray-400 dark:text-gray-500" dateTime={post.createdAt} title={new Date(post.createdAt).toLocaleString()}>
                {formatRelativeTime(post.createdAt)}
              </time>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-900 dark:text-white hover:opacity-60 transition-opacity p-1">
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden min-w-[160px] animate-fade-in">
                  <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isDeleting ? <Spinner size={14} /> : <Trash2 size={15} />}
                    Delete post
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Confirm delete banner */}
        {confirmDelete && (
          <div className="mx-4 mb-2 flex items-center justify-between bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 animate-fade-in">
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">Delete this post?</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium px-2 py-0.5">
                Cancel
              </button>
              <button
                onClick={() => deletePost(post.id)}
                disabled={isDeleting}
                className="text-xs text-red-600 dark:text-red-400 font-bold px-2 py-0.5 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {/* Caption — double tap to like */}
        <div className="px-4 pt-1 pb-2 relative cursor-pointer select-none" onDoubleClick={handleDoubleTap}>
          <span className="text-[13px] text-gray-900 dark:text-gray-200">{post.content}</span>

          {showDoubleTapHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart size={60} className="fill-red-500 text-red-500 drop-shadow-lg animate-double-tap-heart" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={isLiking || isLiked}
              className="group transition-transform active:scale-90"
              aria-label={`${isLiked ? "Liked" : "Like"} — ${post.likes} likes`}
            >
              <Heart
                size={24}
                className={`transition-all duration-200 ${
                  isLiked
                    ? "fill-red-500 text-red-500 animate-heart-pop"
                    : "text-gray-900 dark:text-white group-hover:opacity-60"
                }`}
              />
            </button>

            {/* Comment toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:opacity-60 transition-opacity"
              aria-label="Toggle comments"
            >
              <MessageCircle
                size={24}
                className={`transition-colors ${
                  showComments
                    ? "text-blue-500 fill-blue-100 dark:fill-blue-900/40"
                    : "text-gray-900 dark:text-white"
                }`}
              />
            </button>
          </div>

          {/* Like count */}
          {post.likes > 0 && (
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white mt-2">
              {post.likes.toLocaleString()} {post.likes === 1 ? "like" : "likes"}
            </p>
          )}

          {/* "View all X comments" link */}
          {commentCount > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="text-[13px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-1"
            >
              View all {commentCount} comment{commentCount === 1 ? "" : "s"}
            </button>
          )}
        </div>

        {/* Comment section */}
        {showComments && (
          <CommentSection postId={post.id} onNeedName={handleNeedName} />
        )}
      </article>
    </>
  );
}
