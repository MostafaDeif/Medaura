"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import registerImg from "@/public/images/register.png";

const COUNTRY_CODES = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "Korea" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+971", country: "UAE" },
  { code: "+20", country: "Egypt" },
  { code: "+212", country: "Morocco" },
  { code: "+216", country: "Tunisia" },
  { code: "+62", country: "Indonesia" },
  { code: "+60", country: "Malaysia" },
  { code: "+66", country: "Thailand" },
  { code: "+39", country: "Italy" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
];

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  const pathname = usePathname();

  const getActiveType = () => {
    if (pathname.includes("/clinic")) return "clinic";
    if (pathname.includes("/doctor")) return "doctor";
    return "patient";
  };

  const activeType = getActiveType();

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
              <button className="px-4 py-2 rounded-full bg-indigo-900 text-white">
                إنشاء حساب
              </button>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full text-zinc-700 transition hover:text-indigo-800"
              >
                تسجيل الدخول
              </Link>
            </nav>
          </header>

          <div className="border border-zinc-100 rounded-lg p-6 shadow-sm">
            {/* ACCOUNT TYPE */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { key: "patient", label: "مريض", href: "/auth/register" },
                {
                  key: "clinic",
                  label: "عيادة",
                  href: "/auth/register/clinic",
                },
                { key: "doctor", label: "طبيب", href: "/auth/register/doctor" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`p-2 sm:p-3 rounded-lg border flex items-center justify-center gap-2 w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    activeType === item.key
                      ? "border-indigo-700 bg-indigo-50 shadow-md"
                      : "border-zinc-100 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-sm md:text-base font-medium flex items-center gap-1">
                    <span>{item.label}</span>
                    {item.key === "clinic" && (
                      <img
                        src="/images/clinic-icon.png"
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-4 inline-block"
                      />
                    )}
                    {item.key === "doctor" && (
                      <img
                        src="/images/doctor-icon.png"
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-4 inline-block"
                      />
                    )}
                    {item.key === "patient" && (
                      <img
                        src="/images/customer-icon.png"
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-4 inline-block"
                      />
                    )}
                  </span>
                </Link>
              ))}
            </div>

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
              src={registerImg}
              alt="register"
              className="max-w-xs sm:max-w-sm lg:max-w-md"
              priority
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
