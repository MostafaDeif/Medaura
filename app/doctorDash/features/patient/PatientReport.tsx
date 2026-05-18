"use client";

import { Hospital, Download } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  status: "available" | "busy";
  description?: string;
}

const Clinics: Clinic[] = [
  { id: 1, name: " سيتى كلينك", status: "available" },
  { id: 2, name: " سيتى كلينك", status: "busy" },
  { id: 3, name: " سيتى كلينك", status: "available" },
  { id: 4, name: " سيتى كلينك", status: "available" },
  { id: 5, name: " سيتى كلينك", status: "busy" },
  { id: 6, name: " سيتى كلينك", status: "available" },
  { id: 7, name: " سيتى كلينك", status: "available" },
];

export default function ClinicsList({ reports }: { reports?: Clinic[] }) {
  const rows = reports ?? Clinics;

  return (
    <div className="bg-(--card-bg) h-auto rounded-2xl shadow-[var(--shadow-soft)] border border-(--card-border)">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-(--card-border) mb-4 p-4">
        <button className="w-full sm:w-auto border border-(--card-border) px-3 py-1.5 rounded-xl text-xs text-(--text-primary) font-medium cursor-pointer hover:text-white hover:bg-[color:var(--primary)] transition-colors duration-300">
          عرض الكل
        </button>

        <h1 className="text-lg font-semibold text-(--text-primary)">
          تقارير المرضي
        </h1>
      </div>

      {/* clinics */}
      <div className="space-y-2.5 px-4 sm:px-5 py-2 pb-4">
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--card-border) p-8 text-center">
            <p className="text-sm font-semibold text-(--text-primary)">
              لا توجد تقارير حتى الآن
            </p>
            <p className="text-xs text-(--text-secondary)">
              ستظهر تقارير المرضى هنا بمجرد توفرها.
            </p>
          </div>
        )}
        {rows.slice(0, 7).map((clinic) => (
          <div
            key={clinic.id}
            className="flex items-center justify-between p-3 bg-(--semi-card-bg) rounded-2xl hover:bg-(--hover-bg) transition-colors"
          >
            {/* Clinic Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <Hospital
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-(--text-primary) text-sm truncate">
                  {clinic.name}
                </p>

                <p className="text-[11px] text-(--text-secondary)">
                  {clinic.description || "تقرير المرضى"}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0">
              <Download
                size={16}
                strokeWidth={1.5}
                className="text-blue-600 dark:text-blue-400"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
