"use client";

import { useState } from "react";
import Link from "next/link";
// import { EyeIcon } from "lucide-react";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<
    "clinic" | "doctor" | "patient"
  >("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const EyeIcon = ({ off = false }: { off?: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 block"
    >
      {off ? (
        <>
          <path d="M17.94 17.94A10 10 0 0 1 12 19c-7 0-11-7-11-7a20.44 20.44 0 0 1 5-4" />
          <path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "صيغة البريد غير صحيحة";
    if (!password) e.password = "كلمة المرور مطلوبة";
    else if (password.length < 6)
      e.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    if (password !== confirm) e.confirm = "كلمات المرور غير متطابقة";
    if (!terms) e.terms = "يجب الموافقة على الشروط";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // simulate network call — replace with real API request later
      await new Promise((res) => setTimeout(res, 700));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      // TODO: replace with real Google OAuth (NextAuth / App Router auth route)
      await new Promise((res) => setTimeout(res, 800));
      // simulate success by treating it as submitted
      setSubmitted(true);
    } finally {
      setGoogleLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center p-6">
        <div
          className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center
          transition-all duration-500 ease-out
          opacity-100 translate-y-0"
        >
          <h2 className="text-2xl font-semibold text-indigo-900 mb-2">
            تم إنشاء الحساب!
          </h2>
          <p className="text-zinc-600 mb-6">تم التسجيل بنجاح (محلي فقط).</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setPassword("");
              setConfirm("");
              setTerms(false);
              setErrors({});
              setAccountType("patient");
              setShowPassword(false);
            }}
            className="px-6 py-2 bg-indigo-700 text-white rounded
              transition hover:bg-indigo-600 active:scale-95"
          >
            إنشاء حساب آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center p-6">
      <div
        className="max-w-6xl w-full rounded-xl shadow-lg overflow-hidden bg-white
        flex flex-col lg:flex-row
        transition-all duration-500 ease-out
        opacity-100 translate-y-0"
      >
        {/* LEFT */}
        <section className="w-full lg:w-1/2 p-8 lg:p-12" dir="rtl">
          <header className="flex flex-col items-center lg:items-start gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center
                text-white font-bold transition hover:scale-105"
              >
                م
              </div>
              <h1 className="text-xl font-semibold text-indigo-900">
                ميد كلينك
              </h1>
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
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { key: "clinic", label: "عيادة" },
                { key: "doctor", label: "طبيب" },
                { key: "patient", label: "مريض" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAccountType(item.key as any)}
                  aria-pressed={accountType === item.key}
                  aria-label={`نوع الحساب: ${item.label}`}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    accountType === item.key
                      ? "border-indigo-700 bg-indigo-50"
                      : "border-zinc-100 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-sm font-medium flex items-center gap-1">
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
                </button>
              ))}
            </div>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {Object.keys(errors).length > 0 && (
                <div
                  className="bg-red-50 border border-red-200 text-red-800 p-3 rounded animate-[shake_0.3s_ease-in-out]"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="font-medium">يرجى تصحيح الأخطاء التالية:</p>
                  <ul className="mt-2 list-disc list-inside">
                    {Object.values(errors).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                الاسم
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
                  errors.name ? "border-red-300" : "border-zinc-200"
                }`}
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="text-sm text-red-700 mt-1"
                >
                  {errors.name}
                </p>
              )}

              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
                  errors.email ? "border-red-300" : "border-zinc-200"
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-sm text-red-700 mt-1"
                >
                  {errors.email}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    كلمة المرور
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة المرور"
                      className={`w-full border rounded-md px-3 py-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
                        errors.name ? "border-red-300" : "border-zinc-200"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
               flex items-center justify-center
               text-zinc-500 hover:text-indigo-700"
                    >
                      <EyeIcon off={showPassword} />
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-700 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    تأكيد كلمة المرور
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="تأكيد كلمة المرور"
                      className={`w-full border rounded-md px-3 py-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
                        errors.name ? "border-red-300" : "border-zinc-200"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
               flex items-center justify-center
               text-zinc-500 hover:text-indigo-700"
                    >
                      <EyeIcon off={showConfirm} />
                    </button>
                  </div>

                  {errors.confirm && (
                    <p className="text-sm text-red-700 mt-1">
                      {errors.confirm}
                    </p>
                  )}
                </div>
              </div>

              <label
                htmlFor="terms"
                className="flex items-center gap-2 text-sm text-zinc-600"
              >
                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="accent-indigo-700"
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                />
                أوافق على الشروط
              </label>
              {errors.terms && (
                <p
                  id="terms-error"
                  role="alert"
                  className="text-sm text-red-700 mt-1"
                >
                  {errors.terms}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-900 text-white py-2 rounded-md transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "جاري التسجيل..." : "التسجيل"}
              </button>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  aria-label="التسجيل عبر جوجل"
                  className="w-full border border-zinc-200 rounded-md px-3 py-2 flex items-center justify-center gap-2 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.35 11.1h-9.18v2.92h5.28c-.23 1.61-1.33 2.95-2.84 3.63v3.02h4.6c2.69-2.49 4.21-6.14 3.14-10.57-.18-.68-.46-1.32-.99-1.9z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12.17 22c2.78 0 5.12-.92 6.82-2.5l-4.6-3.02c-1.1.74-2.5 1.18-4.22 1.18-3.26 0-6.02-2.2-7.01-5.15H.68v3.23C2.38 19.9 6.8 22 12.17 22z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.16 13.51c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28V5.72H.68A11.99 11.99 0 0 0 0 11.23c0 1.86.4 3.63 1.12 5.24l4.04-2.96z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.17 4.44c1.9 0 3.58.66 4.92 1.96l3.67-3.67C17.28.75 14.95 0 12.17 0 6.8 0 2.38 2.1.68 5.72l4.48 3.44c.99-2.95 3.75-5.15 7.01-5.15z"
                      fill="#EA4335"
                    />
                  </svg>
                  {googleLoading ? "جاري تسجيل الدخول..." : "التسجيل عبر جوجل"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* RIGHT */}
        <aside
          className="hidden lg:flex w-1/2 bg-indigo-50 items-center justify-center p-8
            transition-transform duration-500 hover:scale-[1.02]"
        >
          <div className="text-indigo-700 text-lg font-medium">
            <img src="/images/register.png" alt="register" />
          </div>
        </aside>
      </div>
    </div>
  );
}
