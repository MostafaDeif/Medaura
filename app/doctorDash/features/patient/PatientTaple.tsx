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
    <div className="bg-(--card-bg) rounded-2xl shadow-sm border border-(--card-border) w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-(--card-border) mb-6 p-6 gap-4">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-indigo-600 transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          سجل المريض
        </h1>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-hidden rounded-xl border border-(--card-border)">

          {/* Mobile */}
          <div className="sm:hidden space-y-4 p-4">
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
                        item.department
                      )}`}
                    >
                      {item.department}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-(--text-secondary)">
                    
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
            <table className="w-full min-w-max p-6 text-sm text-right">

              <thead className="bg-(--hover-bg) text-(--text-secondary)">
                <tr>
                  <th className="px-4 py-3">آخر زيارة</th>
                  <th className="px-4 py-3">الأقسام</th>
                  <th className="px-4 py-3">التشخيص</th>
                  <th className="px-4 py-3">اسم المريض</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-(--card-border) hover:bg-(--hover-bg) transition"
                  >
                    <td className="px-4 py-3 text-(--text-secondary)">
                      {item.date}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDeptColor(
                          item.department
                        )}`}
                      >
                        {item.department}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {item.gender}
                    </td>

                    <td className="px-4 py-3 font-medium text-(--text-primary)">
                      {item.name}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
