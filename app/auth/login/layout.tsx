"use client";

import Link from "next/link";
import Image from "next/image";
import loginImg from "@/public/images/register.png";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="max-w-6xl w-full rounded-xl shadow-lg overflow-hidden bg-white
        flex flex-col lg:flex-row
        transition-all duration-500 ease-out
        opacity-100 translate-y-0"
      >
        {/* LEFT */}
        <section className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12" dir="rtl">
          <header className="flex flex-col items-center lg:items-start gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center
                text-white font-bold transition hover:scale-105 "
              >
                M
              </div>
              <h1 className="text-xl font-semibold text-indigo-900">Medaura</h1>
            </div>

            <nav className="flex items-center gap-2 bg-zinc-100 rounded-full p-1">
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-full text-zinc-700 transition hover:text-indigo-800"
              >
                إنشاء حساب
              </Link>
              <button className="px-4 py-2 rounded-full bg-indigo-900 text-white">
                تسجيل الدخول
              </button>
            </nav>
          </header>

          <div className="border border-zinc-100 rounded-lg p-6 shadow-sm">
            {/* CONTENT FROM CHILDREN */}
            {children}
          </div>
        </section>

        {/* RIGHT */}
        <aside
          className="hidden lg:flex w-1/2 bg-indigo-50 items-center justify-center p-8
            transition-transform duration-500 hover:scale-[1.02]"
        >
          <div className="text-indigo-700 text-lg font-medium">
            <Image
              src={loginImg}
              alt="login"
              className="max-w-xs sm:max-w-sm lg:max-w-md"
              priority
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
