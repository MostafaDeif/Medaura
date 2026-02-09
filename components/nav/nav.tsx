"use client";

import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar: FC = () => {
  const pathname = usePathname();

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
        className="container mx-auto flex items-center justify-between py-4 px-6"
        dir="rtl"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/LOGO.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold text-[#0F1A4F]">ميدورا</span>
        </div>

        {/* Center Menu */}
        <ul className="flex items-center gap-8 text-[#0F1A4F] font-medium">
          {navItems.map((item) => (
            <li
              key={item.href}
              className={`relative pb-1 ${
                isActive(item.href)
                  ? "border-b-2 border-[#0F1A4F]"
                  : ""
              }`}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
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
