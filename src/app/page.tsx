import { PostFeed } from "@/components/PostFeed";
import { CreatePost } from "@/components/CreatePost";
import { NewPostsBanner } from "@/components/NewPostsBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <NewPostsBanner />

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-purple-200/50 dark:border-gray-800" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(245,235,255,0.92) 50%, rgba(255,235,245,0.92) 100%)" }}>
        <div className="w-full max-w-[700px] mx-auto px-4 h-[58px] flex items-center justify-center relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-200/60">
              <span className="text-white font-black text-[14px] tracking-tight">S</span>
            </div>
            <h1 className="text-[22px] font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Sharely
            </h1>
          </div>
        </div>
      </header>

      <div className="w-[92%] sm:w-[80%] md:w-[70%] lg:w-[65%] max-w-[700px] mx-auto shadow-xl shadow-purple-200/40 dark:shadow-purple-900/20 min-h-screen">
        <CreatePost />
        <PostFeed />
      </div>
    </main>
  );
}
