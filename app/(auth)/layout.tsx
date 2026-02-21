"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import authImg from "@/public/images/register.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Navigation items
const NAV_ITEMS = [
  { label: "إنشاء حساب", href: "/auth/register", key: "register" },
  { label: "تسجيل الدخول", href: "/auth/login", key: "login" },
];

// Register account types
const REGISTER_TYPES = [
  {
    key: "patient",
    label: "مريض",
    href: "/auth/register",
    icon: "customer-icon",
  },
  {
    key: "clinic",
    label: "عيادة",
    href: "/auth/register/clinic",
    icon: "clinic-icon",
  },
  {
    key: "doctor",
    label: "طبيب",
    href: "/auth/register/doctor",
    icon: "doctor-icon",
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  // Determine active nav item
  const getActiveNav = () => {
    if (pathname.includes("/register")) return "register";
    if (pathname.includes("/login")) return "login";
    return "login";
  };

  // Determine active register type
  const getActiveType = () => {
    if (pathname.includes("/clinic")) return "clinic";
    if (pathname.includes("/doctor")) return "doctor";
    return "patient";
  };

  const activeNav = getActiveNav();
  const activeType = getActiveType();
  const isRegisterPage = activeNav === "register";

  // If we are on the doctor documents page, do not render the auth layout wrapper
  if (pathname.startsWith("/auth/doctorDocument")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full rounded-xl shadow-lg overflow-hidden bg-white flex flex-col lg:flex-row transition-all duration-500 ease-out">
        {/* LEFT SECTION */}
        <section className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12" dir="rtl">
          {/* HEADER */}
          <header className="flex flex-col items-center lg:items-start gap-4 mb-6">
            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold transition hover:scale-105">
                M
              </div>
              <h1 className="text-xl font-semibold text-indigo-900">Medaura</h1>
            </div>

            {/* NAVIGATION TABS */}
            <nav className="flex items-center gap-2 bg-zinc-100 rounded-full p-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-4 py-2 rounded-full transition ${
                    activeNav === item.key
                      ? "bg-indigo-900 text-white"
                      : "text-zinc-700 hover:text-indigo-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          {/* CONTENT CONTAINER */}
          <div className="border border-zinc-100 rounded-lg p-6 shadow-sm">
            {/* REGISTER ACCOUNT TYPE SELECTOR */}
            {isRegisterPage && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {REGISTER_TYPES.map((type) => (
                  <Link
                    key={type.key}
                    href={type.href}
                    className={`p-2 sm:p-3 rounded-lg border flex items-center justify-center gap-2 w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      activeType === type.key
                        ? "border-indigo-700 bg-indigo-50 shadow-md"
                        : "border-zinc-100 hover:border-indigo-300"
                    }`}
                  >
                    <span className="text-sm md:text-base font-medium flex items-center gap-1">
                      <span>{type.label}</span>
                      {type.key !== "patient" && (
                        <img
                          src={`/images/${type.icon}.png`}
                          alt=""
                          aria-hidden="true"
                          className="h-4 w-4 inline-block"
                        />
                      )}
                      {type.key === "patient" && (
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
            )}

            {/* PAGE CONTENT */}
            {children}
          </div>
        </section>

        {/* RIGHT SECTION - IMAGE */}
        <aside className="hidden lg:flex w-1/2 bg-indigo-50 items-center justify-center p-8 transition-transform duration-500 hover:scale-[1.02]">
          <div className="text-indigo-700 text-lg font-medium">
            <Image
              src={authImg}
              alt="medaura authentication"
              className="max-w-xs sm:max-w-sm lg:max-w-md"
              priority
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
