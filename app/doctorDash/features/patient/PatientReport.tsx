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
    <div className="bg-(--card-bg) h-auto rounded-xl shadow-sm">

      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-indigo-600 transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          تقارير المرضي
        </h1>
      </div>

      {/* clinics */}
      <div className="space-y-4 sm:space-y-2.5 px-4 sm:px-6 py-2 pb-6">
        {rows.slice(0, 7).map((clinic) => (
          <div
            key={clinic.id}
            className="flex items-center justify-between p-3 sm:p-4 bg-(--semi-card-bg) rounded-lg hover:bg-(--hover-bg) transition-colors"
          >
            
            {/* Clinic Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <Hospital
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-(--text-primary) text-sm sm:text-base truncate">
                  {clinic.name}
                </p>

                <p className="text-xs sm:text-sm text-(--text-secondary)">
                  {clinic.description || "تقرير المرضى"}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0">
              <Download
                size={18}
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
