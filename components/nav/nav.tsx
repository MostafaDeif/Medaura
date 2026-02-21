"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { t } from "@/i18n";

const Navbar: FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<string>(() => {
    try {
      return localStorage.getItem("locale") || "en";
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      // notify other components about locale change
      try {
        window.dispatchEvent(new CustomEvent("localeChange", { detail: locale }));
      } catch (e) {
        // noop
      }
    } catch (e) {
      // noop
    }
  }, [locale]);

  const navItems = [
    { href: "/", label: t("nav.home", locale) },
    { href: "/site/specialties", label: t("nav.specialties", locale) },
    { href: "/doctors", label: t("nav.doctors", locale) },
    { href: "/clinics", label: t("nav.clinics", locale) },
    { href: "/appointments", label: t("nav.appointments", locale) },
    { href: "/about", label: t("nav.about", locale) },
    { href: "/contact", label: t("nav.contact", locale) },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full border-b border-[#d9e3ff] bg-[#edf2ff]">
      <div
        className="container relative mx-auto flex items-center justify-between px-6 py-4"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-2">
          <Image src="/images/LOGO.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold text-[#0f1a4f]">Medaura</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-20 flex flex-col gap-1 md:hidden"
          aria-label="Open menu"
        >
          <span className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>

        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute inset-x-0 top-16 z-10 w-full flex-col gap-2 border-t border-[#d6e0ff] bg-[#edf2ff] p-4 text-[#0f1a4f] shadow-md md:relative md:inset-x-auto md:top-auto md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-t-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navItems.map((item) => (
            <li key={item.href} className="relative transition hover:opacity-70">
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`inline-block pb-1 ${isActive(item.href) ? "border-b-2 border-[#0f1a4f]" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            aria-label="Toggle language"
            className="rounded-full border px-3 py-1 text-sm font-medium text-[#0f1a4f] hover:opacity-80"
          >
            {locale === "en" ? "ع" : "EN"}
          </button>

          <Link href="/auth/login" className="font-medium text-[#0f1a4f] hover:opacity-70">
            {t("nav.login", locale)}
          </Link>

          <Link
            href="/auth/register"
            className="rounded-full bg-[#0f1a4f] px-4 py-2 font-medium text-white transition hover:bg-[#1b2773]"
          >
            {t("nav.createAccount", locale)}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
