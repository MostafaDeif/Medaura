"use client";

import React from "react";

type Patient = {
  name: string;
  gender: string;
  department: string;
  date: string;
};

const data: Patient[] = [
  {
    name: "محمد خالد",
    gender: "ذكر",
    department: "عظام",
    date: "17 Jun 2026",
  },
  {
    name: "ريم السيد",
    gender: "أنثى",
    department: "قلب",
    date: "10 Dec 2025",
  },
  {
    name: "احمد محمد",
    gender: "ذكر",
    department: "جلدية",
    date: "22 Dec 2025",
  },
  {
    name: "ليلى محمد",
    gender: "أنثى",
    department: "عظام",
    date: "22 Dec 2025",
  },
  {
    name: "عمر محمد",
    gender: "ذكر",
    department: "قلب",
    date: "15 Jun 2025",
  },
  {
    name: "احمد السيد",
    gender: "ذكر",
    department: "جلدية",
    date: "30 Dec 2025",
  },
  {
    name: "محمد السيد",
    gender: "ذكر",
    department: "عظام",
    date: "30 Dec 2025",
  },
];

const getDeptColor = (dept: string) => {
  switch (dept) {
    case "عظام":
      return "bg-orange-100 text-orange-600";
    case "قلب":
      return "bg-blue-100 text-blue-600";
    case "جلدية":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function PatientsTable({ patients }: { patients?: Patient[] }) {
  const rows = patients ?? data;

  return (
    <div className="bg-(--card-bg) rounded-2xl shadow-[var(--shadow-soft)] border border-(--card-border) w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-(--card-border) mb-4 p-4 gap-3">
        <button className="w-full sm:w-auto border border-(--card-border) px-3 py-1.5 rounded-xl text-xs text-(--text-primary) font-medium cursor-pointer hover:text-white hover:bg-[color:var(--primary)] transition-colors duration-300">
          عرض الكل
        </button>

        <h1 className="text-lg font-semibold text-(--text-primary)">
          سجل المريض
        </h1>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="overflow-hidden rounded-xl border border-(--card-border)">
          {/* Mobile */}
          <div className="sm:hidden space-y-3 p-4">
            {rows.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--card-border) p-6 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                  لا يوجد سجلات مرضى بعد
                </p>
                <p className="text-xs text-(--text-secondary)">
                  أضف أول سجل ليظهر هنا.
                </p>
              </div>
            )}
            {rows.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-(--text-primary)">
                      {item.name}
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDeptColor(
                        item.department,
                      )}`}
                    >
                      {item.department}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-(--text-secondary)">
                    <span className="font-medium text-(--text-primary)">
                      الجنس
                    </span>
                    <span>{item.gender}</span>

                    <span className="font-medium text-(--text-primary)">
                      آخر زيارة
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            {rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                  لا يوجد سجلات مرضى بعد
                </p>
                <p className="text-xs text-(--text-secondary)">
                  أضف أول سجل ليظهر هنا.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-max text-xs sm:text-sm text-right">
                <thead className="bg-(--hover-bg) text-(--text-secondary) text-[11px] sm:text-xs">
                  <tr>
                    <th className="px-3 py-2">آخر زيارة</th>
                    <th className="px-3 py-2">الأقسام</th>
                    <th className="px-3 py-2">التشخيص</th>
                    <th className="px-3 py-2">اسم المريض</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-(--card-border) hover:bg-(--hover-bg) transition"
                    >
                      <td className="px-3 py-2 text-(--text-secondary)">
                        {item.date}
                      </td>

                      <td className="px-3 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDeptColor(
                            item.department,
                          )}`}
                        >
                          {item.department}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-(--text-secondary)">
                        {item.gender}
                      </td>

                      <td className="px-3 py-2 font-medium text-(--text-primary)">
                        {item.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
