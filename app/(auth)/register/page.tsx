"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon } from "./utils";
import { useAuth } from "@/lib/hooks/useAuth";

export default function PatientRegisterPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "صيغة البريد غير صحيحة";
    if (!dateOfBirth) e.date_of_birth = "تاريخ الميلاد مطلوب";
    if (!gender) e.gender = "النوع مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\-()\s]{8,20}$/.test(phone))
      e.phone = "رقم الهاتف غير صحيح";
    if (!bloodType) e.blood_type = "فصيلة الدم مطلوبة";
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
      await signup({
        email,
        password,
        user_type: "patient",
        profile: {
          full_name: name,
          date_of_birth: dateOfBirth,
          gender,
          phone,
          blood_type: bloodType,
        },
      });
      setSubmitted(true);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل إنشاء الحساب";
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      setErrors({ form: "التسجيل عبر جوجل غير متاح حاليًا." });
    } finally {
      setGoogleLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-indigo-900 mb-2">
          تم إنشاء الحساب!
        </h2>
        <p className="text-zinc-600 mb-6">تم التسجيل بنجاح.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setDateOfBirth("");
            setGender("");
            setPhone("");
            setBloodType("");
            setPassword("");
            setConfirm("");
            setTerms(false);
            setErrors({});
            setShowPassword(false);
          }}
          className="px-6 py-2 bg-indigo-700 text-white rounded
            transition hover:bg-indigo-600 active:scale-95"
        >
          إنشاء حساب آخر
        </button>
      </div>
    );
  }

  return (
    <>
      {/* FORM */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {errors.form && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 p-3 rounded"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 p-3 rounded animate-[shake_0.3s_ease-in-out]"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-medium">يرجى تصحيح الأخطاء التالية:</p>
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors)
                .filter(([key]) => key !== "form")
                .map(([, e], i) => (
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
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
            errors.name ? "border-red-300" : "border-zinc-200"
          }`}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-red-700 mt-1">
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
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
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

        <label
          htmlFor="date_of_birth"
          className="block text-sm font-medium text-zinc-700 mb-1"
        >
          تاريخ الميلاد
        </label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          aria-invalid={!!errors.date_of_birth}
          aria-describedby={errors.date_of_birth ? "dob-error" : undefined}
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
            errors.date_of_birth ? "border-red-300" : "border-zinc-200"
          }`}
        />
        {errors.date_of_birth && (
          <p id="dob-error" role="alert" className="text-sm text-red-700 mt-1">
            {errors.date_of_birth}
          </p>
        )}

        <label
          htmlFor="gender"
          className="block text-sm font-medium text-zinc-700 mb-1"
        >
          النوع
        </label>
        <select
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          aria-invalid={!!errors.gender}
          aria-describedby={errors.gender ? "gender-error" : undefined}
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
            errors.gender ? "border-red-300" : "border-zinc-200"
          }`}
        >
          <option value="">اختر النوع</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        {errors.gender && (
          <p
            id="gender-error"
            role="alert"
            className="text-sm text-red-700 mt-1"
          >
            {errors.gender}
          </p>
        )}

        <label
          htmlFor="phone"
          className="block text-sm font-medium text-zinc-700 mb-1"
        >
          رقم الهاتف
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="01000000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
            errors.phone ? "border-red-300" : "border-zinc-200"
          }`}
        />
        {errors.phone && (
          <p
            id="phone-error"
            role="alert"
            className="text-sm text-red-700 mt-1"
          >
            {errors.phone}
          </p>
        )}

        <label
          htmlFor="blood_type"
          className="block text-sm font-medium text-zinc-700 mb-1"
        >
          فصيلة الدم
        </label>
        <select
          id="blood_type"
          name="blood_type"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          aria-invalid={!!errors.blood_type}
          aria-describedby={errors.blood_type ? "blood-error" : undefined}
          className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
            errors.blood_type ? "border-red-300" : "border-zinc-200"
          }`}
        >
          <option value="">اختر فصيلة الدم</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        {errors.blood_type && (
          <p
            id="blood-error"
            role="alert"
            className="text-sm text-red-700 mt-1"
          >
            {errors.blood_type}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
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
              <p className="text-sm text-red-700 mt-1">{errors.password}</p>
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
              <p className="text-sm text-red-700 mt-1">{errors.confirm}</p>
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
          className="w-full bg-indigo-900 text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "جاري التسجيل..." : "التسجيل"}
        </button>

        <div
          className="flex items-center gap-3 my-2 sm:my-3"
          aria-hidden="true"
        >
          <div className="h-px bg-zinc-200 flex-1" />
          <div className="text-sm text-zinc-500">أو</div>
          <div className="h-px bg-zinc-200 flex-1" />
        </div>

        <div className="mt-1 sm:mt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            aria-label="التسجيل عبر جوجل"
            className="w-full border border-zinc-200 rounded-md px-3 py-2 flex items-center justify-center gap-2 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
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
    </>
  );
}
