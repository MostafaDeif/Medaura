"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { simulateApiCall } from "../validators";
import { ErrorAlert } from "../components";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (otp.some((digit) => !digit)) {
      e.otp = "يرجى إدخال رمز التحقق الكامل";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await simulateApiCall();
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
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
        <h2 className="text-2xl font-semibold text-indigo-900">
          تم التحقق بنجاح!
        </h2>
        <p className="text-zinc-600">تم تفعيل حسابك بنجاح</p>
        <Link
          href="/auth/login"
          className="inline-block w-full bg-indigo-900 text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95"
        >
          الذهاب إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-indigo-900 mb-2">
        التحقق من البريد الإلكتروني
      </h2>
      <p className="text-sm text-zinc-600 mb-4">
        إرسلنا الرمز إلى info@example.com
      </p>

      <ErrorAlert errors={errors} />

      <div className="flex gap-2 justify-center my-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            className="w-12 h-12 text-center border-2 border-indigo-300 rounded-lg text-2xl font-bold focus:outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200"
            inputMode="numeric"
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-red-600 font-medium">
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </span>
        {timeLeft === 0 ? (
          <button
            type="button"
            onClick={() => {
              setTimeLeft(45);
              setOtp(["", "", "", ""]);
            }}
            className="text-indigo-700 hover:text-indigo-900 font-medium transition"
          >
            إعادة إرسال الرمز
          </button>
        ) : (
          <span className="text-zinc-600">لم يتم استلام الرمز؟</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-900 text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "جاري التحقق..." : "تحقق وتابع"}
      </button>
    </form>
  );
}
