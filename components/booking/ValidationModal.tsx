"use client";

import { AlertCircle, CheckCircle, X } from "lucide-react";

import { useEffect, useState } from "react";
import { t } from "@/i18n";

interface ValidationModalProps {
  type: "success" | "warning";
  title: string;
  message: string;
  onClose: () => void;
}

export default function ValidationModal({
  type,
  title,
  message,
  onClose,
}: ValidationModalProps) {
  const isSuccess = type === "success";
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          ) : (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-10 w-10 text-yellow-600" />
            </div>
          )}

          <h3
            className={`mb-3 text-2xl font-bold ${
              isSuccess ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {title}
          </h3>

          <p className="mb-8 text-gray-600 leading-relaxed">{message}</p>

          <button
            onClick={onClose}
            className={`w-full rounded-2xl py-4 font-bold text-white transition-colors ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {t("booking.validation.ok", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
