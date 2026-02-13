"use client";

import Link from "next/link";
import { FC, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar: FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/specialties", label: "التخصصات" },
    { href: "/doctors", label: "الأطباء" },
    { href: "/clinics", label: "العيادات" },
    { href: "/appointments", label: "المواعيد" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full bg-[#E8EDFF] border-b border-[#CBD5E1]">
      <div
        className="container mx-auto flex items-center justify-between py-4 px-6 relative"
        dir="rtl"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/LOGO.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold text-[#0F1A4F]">ميدورا</span>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1 z-20"
        >
          <span className={`h-0.5 w-6 bg-[#0F1A4F] transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`h-0.5 w-6 bg-[#0F1A4F] transition-all ${isOpen ? "opacity-0" : ""}`}></span>
          <span className={`h-0.5 w-6 bg-[#0F1A4F] transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>

        {/* Center Menu */}
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex md:items-center md:gap-8 absolute md:relative top-16 md:top-auto inset-x-0 md:inset-x-auto w-full md:w-auto flex-col md:flex-row bg-[#E8EDFF] md:bg-transparent p-4 md:p-0 text-[#0F1A4F] font-medium gap-2 border-t md:border-t-0 border-[#CBD5E1] shadow-md md:shadow-none z-10`}
        >
          {navItems.map((item) => (
            <li
              key={item.href}
              className={`relative hover:opacity-70 transition`}
            >
              <Link 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={`inline-block pb-1 ${
                  isActive(item.href)
                    ? "border-b-2 border-[#0F1A4F]"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[#0F1A4F] font-medium hover:opacity-70"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/register"
            className="bg-[#0F1A4F] text-white px-4 py-2 rounded-full font-medium hover:bg-[#1b2773] transition"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
