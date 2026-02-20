import Link from 'next/link';
import { MessageCircle, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="text-blue-600" /> ChatPlatform
        </h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="px-4 py-2 hover:text-blue-600">Login</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl font-extrabold mb-6 animate-fade-in-up">
          Connect with anyone, <span className="text-blue-600">anywhere.</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Fast, secure, and modern chat platform for teams and friends. Experience real-time communication like never before.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/register" className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Chatting Now
          </Link>
          <Link href="#features" className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Learn More
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <Zap className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Real-time</h3>
            <p className="text-gray-600 dark:text-gray-400">Instant message delivery with Socket.io technology.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <Shield className="w-10 h-10 text-green-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-600 dark:text-gray-400">End-to-end encryption simulation and secure auth.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <MessageCircle className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Modern UI</h3>
            <p className="text-gray-600 dark:text-gray-400">Clean, responsive interface built with Tailwind CSS.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm border-t dark:border-gray-800">
        © 2026 ChatPlatform. All rights reserved.
      </footer>
    </div>
  );
}
