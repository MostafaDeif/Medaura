"use client";

import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPathByUserType } from "@/lib/utils/redirect";
import { t } from "@/i18n";

interface Notification {
  notification_id: number;
  title: string;
  message: string;
  is_read: boolean;
}

const Navbar: FC = () => {
  const pathname = usePathname();

  const { user, isAuthenticated, logout, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<string>("en");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );

  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("locale");

      if (stored) {
        setLocale(stored);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const navItems = [
    { href: "/", label: t("nav.home", locale) },
    { href: "/specialties", label: t("nav.specialties", locale) },
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

  const profileHref =
    user?.user_type?.toLowerCase() === "patient"
      ? "/patientProfile"
      : getDashboardPathByUserType(user?.user_type);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  async function loadNotifications() {
    setLoadingNotifications(true);
    setNotificationsError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/notifications/me",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      console.log("NOTIFICATIONS => ", result);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "فشل في جلب الإشعارات"
        );
      }

      setNotifications(result.notifications || []);
    } catch (error) {
      console.log(error);

      setNotificationsError(
        error instanceof Error
          ? error.message
          : "فشل في جلب الإشعارات"
      );
    } finally {
      setLoadingNotifications(false);
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      console.log("READ RESULT => ", result);

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.notification_id === notificationId
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [notificationsOpen]);

  useEffect(() => {
    if (notificationsOpen && notifications.length === 0) {
      loadNotifications();
    }
  }, [notificationsOpen, notifications.length]);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#d9e3ff] bg-[#edf2ff]">
      <div className="container relative mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12">
              <Image
                src="/images/Logo1.png"
                alt="logo"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>

            <span className="text-xl font-bold text-[#0f1a4f]">
              Medaura
            </span>
          </Link>
        </div>

        <button
          onClick={() =>
            setLocale(locale === "en" ? "ar" : "en")
          }
          aria-label="Toggle language"
          className="ml-3 rounded-full border px-2 py-1 text-sm font-medium text-[#0f1a4f] hover:opacity-80 md:hidden"
        >
          {locale === "en" ? "ع" : "EN"}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-20 flex flex-col gap-1 md:hidden"
          aria-label="Open menu"
        >
          <span
            className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />

          <span
            className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          />

          <span
            className={`h-0.5 w-6 bg-[#0f1a4f] transition-all ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>

        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute inset-x-0 top-16 z-10 w-full flex-col gap-2 border-t border-[#d6e0ff] bg-[#edf2ff] p-4 text-[#0f1a4f] shadow-md md:relative md:inset-x-auto md:top-auto md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-t-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navItems.map((item) => (
            <li
              key={item.href}
              className="relative transition hover:opacity-70"
            >
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`inline-block pb-1 ${
                  isActive(item.href)
                    ? "border-b-2 border-[#0f1a4f]"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="flex items-center gap-3"></div>
          ) : isAuthenticated ? (
            <div
              className="relative flex items-center gap-3"
              ref={notificationRef}
            >
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen((open) => !open)
                }
                className="relative rounded-full border border-[#0f1a4f] bg-white p-2 text-[#0f1a4f] transition hover:bg-[#d9e3ff]"
                aria-label="Open notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 2a6 6 0 0 0-6 6v4.586l-.707.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 12.586V8a6 6 0 0 0-6-6Z" />
                  <path d="M8 20a3 3 0 0 0 6 0h-6Z" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                  <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        الإشعارات
                      </h3>

                      {loadingNotifications && (
                        <span className="text-xs text-zinc-500">
                          جاري التحديث...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notificationsError ? (
                      <div className="p-4 text-sm text-red-700">
                        {notificationsError}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-sm text-zinc-600">
                        لا توجد إشعارات جديدة.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={
                            notification.notification_id
                          }
                          type="button"
                          onClick={() => {
                            if (notification.is_read)
                              return;

                            markAsRead(
                              notification.notification_id
                            );
                          }}
                          className={`w-full px-4 py-3 text-left transition hover:bg-zinc-50 ${
                            notification.is_read
                              ? "bg-white"
                              : "bg-indigo-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-zinc-900">
                              {notification.title}
                            </p>

                            {!notification.is_read && (
                              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                            )}
                          </div>

                          <p className="mt-1 text-sm text-zinc-600">
                            {notification.message}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <Link
                href={profileHref}
                className="rounded-full bg-[#0f1a4f] px-4 py-2 font-medium text-white transition hover:bg-[#1b2773]"
              >
                {t("nav.profile", locale)}
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-[#0f1a4f] px-4 py-2 text-sm font-medium text-[#0f1a4f] transition hover:bg-[#d9e3ff]"
              >
                {t("nav.logout", locale)}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-[#0f1a4f] hover:opacity-70"
              >
                {t("nav.login", locale)}
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#0f1a4f] px-4 py-2 font-medium text-white transition hover:bg-[#1b2773]"
              >
                {t("nav.createAccount", locale)}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;