"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

const quickLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.specialties", href: "/site/specialties" },
  { key: "nav.doctors", href: "/doctors" },
  { key: "nav.clinics", href: "/clinics" },
];

export default function Footer() {
  const [locale, setLocale] = useState(() => {
    try {
      return (
        document.documentElement.lang || localStorage.getItem("locale") || "en"
      );
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    function onLocale(e: any) {
      setLocale(e?.detail || document.documentElement.lang || "en");
    }
    window.addEventListener("localeChange", onLocale as EventListener);
    return () =>
      window.removeEventListener("localeChange", onLocale as EventListener);
  }, []);

  return (
    <footer className="rounded-[30px] border border-[#d8e3ff] bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-extrabold text-[#001a6e]">
            {t("footer.title", locale)}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#5b6d9c]">
            {t("footer.description", locale)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4c6dd1]">
            {t("footer.quickLinks", locale)}
          </h4>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[#213976] transition hover:text-[#163fb8]"
                >
                  {t(link.key, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4c6dd1]">
            {t("footer.contact", locale)}
          </h4>
          <p className="mt-3 text-sm text-[#5b6d9c]">
            {t("footer.email", locale)}
          </p>
          <p className="mt-1 text-sm text-[#5b6d9c]">
            {t("footer.phone", locale)}
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-[#e2e9ff] pt-4 text-xs text-[#7c8fbf]">
        {t("footer.copyright", locale)}
      </div>
    </footer>
  );
}
