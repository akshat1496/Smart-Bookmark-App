import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-3xl inline-block mb-6">
            <svg
              className="w-16 h-16 text-white mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              ></path>
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Smart
            <span className="block bg-linear-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Bookmarks
            </span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Organize and manage your favorite websites with ease.
            <br />
            Never lose a valuable link again.
          </p>
        </div>

        <div className="space-y-6">
          <AuthButton />

          <div className="flex items-center justify-center space-x-8 text-sm text-indigo-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Secure Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Easy Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Cloud Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
