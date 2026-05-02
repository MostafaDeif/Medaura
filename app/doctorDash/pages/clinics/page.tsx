"use client";

import { useState } from "react";
import type { ClinicRequest } from "@/lib/types/api";

export default function CreateClinicPage() {
  const [formData, setFormData] = useState<ClinicRequest>({
    name: "",
    address: "",
    location: "",
    phone: "",
    email: "",
    opening_hours: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/clinic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          opening_hours: formData.opening_hours || "10:00 - 18:00", // ✅ مهم
        }),
        credentials: "include", // ✅ علشان الكوكي
      });

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message || "فشل في إنشاء العيادة");
      }
      setSuccess(true);

      setFormData({
        name: "",
        address: "",
        location: "",
        phone: "",
        email: "",
        opening_hours: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في إنشاء العيادة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            تم إنشاء العيادة بنجاح!
          </h2>
          <p className="text-green-700">
            يمكنك الآن إدارة عيادتك من لوحة التحكم.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
          >
            إنشاء عيادة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          إنشاء عيادة جديدة
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              اسم العيادة *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل اسم العيادة"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              العنوان *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل عنوان العيادة"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              الموقع *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل الموقع (مثل: القاهرة)"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              رقم الهاتف *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل رقم الهاتف"
              dir="ltr"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل البريد الإلكتروني"
              dir="ltr"
            />
          </div>

          <div>
            <label
              htmlFor="opening_hours"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ساعات العمل
            </label>
            <textarea
              id="opening_hours"
              name="opening_hours"
              value={formData.opening_hours}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="أدخل ساعات العمل (اختياري)"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء العيادة"}
          </button>
        </form>
      </div>
    </div>
  );
}
