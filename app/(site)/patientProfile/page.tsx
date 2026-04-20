"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/hooks/useApi";
import type { BookingResponse, Prescription } from "@/lib/types/api";

type ProfileForm = {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
};

type ProfileResponse = {
  status?: string;
  user?: {
    user_id: number;
    email: string;
    role: string;
    is_active: boolean;
    photo: string | null;
    updated_at?: string;
    profile?: {
      full_name?: string | null;
      date_of_birth?: string | null;
      gender?: string | null;
      phone?: string | null;
    };
  };
  email?: string;
  photo?: string | null;
  updated_at?: string;
  profile?: {
    full_name?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    phone?: string | null;
  };
};

const navItems = [
  { id: "profile", label: "الملف الشخصي" },
  { id: "history", label: "سجل الزيارات" },
  { id: "clinics", label: "العيادات التي زرت" },
  { id: "prescriptions", label: "الوصفات الطبية" },
  { id: "followup", label: "المتابعة" },
];

export default function PatientProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const profileApi = useApi<ProfileResponse>();
  const bookingsApi = useApi<BookingResponse[]>();
  const prescriptionsApi = useApi<Prescription[]>();

  const [activeSection, setActiveSection] = useState("profile");
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const profileUser = useMemo(() => {
    const data = profileApi.data;

    if (!data) return null;

    if (data.user) {
      return data.user;
    }

    return {
      user_id: user?.id || 0,
      email: data.email || user?.email || "",
      role: user?.user_type || "patient",
      is_active: true,
      photo: data.photo || null,
      updated_at: data.updated_at,
      profile: data.profile || {},
    };
  }, [profileApi.data, user]);

  useEffect(() => {
    if (!user) return;

    profileApi.execute("/api/user/me");
    bookingsApi.execute("/api/bookings/my-bookings");
    prescriptionsApi.execute("/api/prescriptions/my-prescriptions");
  }, [user]);

  useEffect(() => {
    if (!profileUser) return;

    // Keep the editable form in sync when the profile response arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      full_name: profileUser.profile?.full_name || "",
      email: profileUser.email || "",
      phone: profileUser.profile?.phone || "",
      date_of_birth: profileUser.profile?.date_of_birth || "",
      gender: profileUser.profile?.gender || "",
    });
  }, [profileUser]);

  const bookings = useMemo(
    () => (Array.isArray(bookingsApi.data) ? bookingsApi.data : []),
    [bookingsApi.data]
  );
  const prescriptions = useMemo(
    () => (Array.isArray(prescriptionsApi.data) ? prescriptionsApi.data : []),
    [prescriptionsApi.data]
  );

  const bookingCount = bookings.length;
  const prescriptionCount = prescriptions.length;

  const visitsSummary = useMemo(() => {
    return bookings.slice(0, 4).map((booking) => ({
      id: booking.id,
      title: booking.status === "completed" ? "زيارة مكتملة" : booking.status === "confirmed" ? "حجز مؤكد" : "حجز جديد",
      subtitle: booking.booking_date,
      extra: booking.booking_from,
      status: booking.status,
    }));
  }, [bookings]);

  const prescriptionsSummary = useMemo(() => {
    return prescriptions.slice(0, 4).map((prescription) => ({
      id: prescription.id,
      title: `وصفة طبية #${prescription.id}`,
      subtitle: prescription.created_at?.split("T")[0] || "",
      extra: prescription.content || "لا يوجد تفاصيل إضافية",
    }));
  }, [prescriptions]);

  const handleFieldChange = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError(null);
    setSaveState("idle");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaveState("saving");
    setFormError(null);

    try {
      const payload = {
        email: form.email,
        profile: {
          full_name: form.full_name,
          phone: form.phone,
          date_of_birth: form.date_of_birth || null,
          gender: form.gender || null,
        },
      };

      await profileApi.execute("/api/user/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setSaveState("success");
    } catch (error: unknown) {
      setSaveState("error");
      setFormError(error instanceof Error ? error.message : "حدث خطأ أثناء حفظ التغييرات.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-md border border-slate-200">
          جارٍ التحقق من حسابك...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-10">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">أنت بحاجة لتسجيل الدخول</h1>
          <p className="text-slate-600">يرجى تسجيل الدخول أولاً لعرض صفحتك الشخصية وسجل زياراتك.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-20">
      <div className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">مرحبًا بك في ملف المريض</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{form.full_name || "مستخدم مدورا"}</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">هنا تجد ملخص حسابك، سجل الزيارات، الوصفات الطبية، وكل ما تحتاجه لتتبع حالتك الصحية بسهولة.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">الزيارات</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{bookingCount}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">الوصفات</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{prescriptionCount}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">أحدث تحديث</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">{profileUser?.updated_at ? new Date(profileUser.updated_at).toLocaleDateString("ar-EG") : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#001A6E] text-white text-2xl font-semibold">
                  {form.full_name ? form.full_name.charAt(0) : "م"}
                </div>
                <div>
                  <p className="text-sm text-slate-500">اسم المريض</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{form.full_name || "غير متوفر"}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">البريد الإلكتروني</p>
                  <p className="mt-2 text-sm text-slate-900 break-all">{form.email || "غير متوفر"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">رقم الهاتف</p>
                  <p className="mt-2 text-sm text-slate-900">{form.phone || "غير متوفر"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">تاريخ الميلاد</p>
                  <p className="mt-2 text-sm text-slate-900">{form.date_of_birth || "غير متوفر"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">النوع</p>
                  <p className="mt-2 text-sm text-slate-900">{form.gender || "غير متوفر"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">القائمة السريعة</h3>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                      activeSection === item.id
                        ? "bg-[#001A6E] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">تحديث الملف الشخصي</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">نمذج بياناتك الصحية</h2>
                </div>
                <div className="inline-flex gap-3">
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{bookingCount} زيارات</div>
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{prescriptionCount} وصفات</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل</label>
                  <input
                    value={form.full_name}
                    onChange={(e) => handleFieldChange("full_name", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
                  <input
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">رقم الهاتف</label>
                  <input
                    value={form.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">النوع</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#001A6E] focus:ring-2 focus:ring-[#001A6E]/10"
                  >
                    <option value="">غير محدد</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>

              {formError && <p className="mt-4 text-sm text-red-700">{formError}</p>}
              {saveState === "success" && (
                <p className="mt-4 text-sm text-emerald-700">تم حفظ التغييرات بنجاح.</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="inline-flex items-center justify-center rounded-3xl bg-[#001A6E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00307e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveState === "saving" ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({
                    full_name: profileUser?.profile?.full_name || "",
                    email: profileUser?.email || "",
                    phone: profileUser?.profile?.phone || "",
                    date_of_birth: profileUser?.profile?.date_of_birth || "",
                    gender: profileUser?.profile?.gender || "",
                  })}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  إعادة تعيين
                </button>
              </div>
            </section>

            <section id="history" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">سجل زياراتك</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">آخر زيارات</h2>
                </div>
                <p className="text-sm text-slate-500">عرض {bookingCount} زيارة</p>
              </div>

              <div className="mt-6 space-y-4">
                {bookingsApi.loading ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">جارٍ تحميل السجل...</div>
                ) : bookings.length ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">رقم الحجز #{booking.id}</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">{booking.booking_date}</h3>
                          <p className="mt-1 text-sm text-slate-600">الوقت: {booking.booking_from}</p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white uppercase tracking-[0.12em]">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">لا توجد زيارات حتى الآن.</div>
                )}
              </div>
            </section>

            <section id="prescriptions" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">الوصفات الطبية</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">الوصفات الأخيرة</h2>
                </div>
                <p className="text-sm text-slate-500">عرض {prescriptionCount} وصفة</p>
              </div>

              <div className="mt-6 space-y-4">
                {prescriptionsApi.loading ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">جارٍ تحميل الوصفات...</div>
                ) : prescriptions.length ? (
                  prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">وصفة رقم {prescription.id}</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">{prescription.created_at?.split("T")[0] || "بدون تاريخ"}</h3>
                          <p className="mt-1 text-sm text-slate-600">{prescription.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">لا توجد وصفات طبية بعد.</div>
                )}
              </div>
            </section>

            <section id="followup" className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">متابعة الحالة</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">خطة المتابعة</h2>
                </div>
                <p className="text-sm text-slate-500">تحديث سريع لحالتك الصحية</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">التوصيات</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">تابع مع الطبيب بانتظام، احرص على تسجيل الأعراض، واحضر نتائج التحاليل في كل زيارة.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">نصائح مهمه</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">يمكنك تحديث رقم الهاتف والملاحظات الخاصة بك في أي وقت ثم الضغط على حفظ للتأكد من وصول الرسائل بسهولة.</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
