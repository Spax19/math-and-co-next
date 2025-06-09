
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-6">You don't have permission to access this page.</p>
      <Link href="/" className="px-4 py-2 bg-[#d4b26a] text-white rounded hover:bg-[#c4a25a]">
        Return Home
      </Link>
    </div>
  );
}