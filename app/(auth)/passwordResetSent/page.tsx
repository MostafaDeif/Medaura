"use client";

import Link from "next/link";

export default function PasswordResetSentPage() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-indigo-900">تم الإرسال!</h2>
      <p className="text-zinc-600">
        تحقق من بريدك الإلكتروني وقم بتغيير كلمة المرور
      </p>

      <Link
        href="/auth/login"
        className="inline-block w-full bg-indigo-900 text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95"
      >
        إعادة تعيين كلمة المرور
      </Link>
    </div>
  );
}
