"use client";

import { Hospital, Download, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Clinic {
  id: number;
  name: string;
  status?: "available" | "busy";
  verified?: boolean;
}

export default function ClinicsList({ clinics: clinicsProp }: { clinics?: Clinic[] }) {
  const [clinics, setClinics] = useState<Clinic[]>(clinicsProp || []);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (clinicsProp) {
      setClinics(clinicsProp);
    }
  }, [clinicsProp]);

  const handleApprove = async (id: number, approve: boolean) => {
    setLoadingId(id);
    try {
      const endpoint = approve ? `/api/admin/clinics/${id}/approve` : `/api/admin/clinics/${id}/reject`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setClinics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, verified: approve } : c))
        );
      }
    } catch (error) {
      console.error("Failed to update clinic status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className=" bg-(--card-bg) border border-(--card-border) h-auto rounded-xl shadow-sm">

      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          تقارير المرضي
        </h1>
      </div>

      {/* clinics */}
      <div className="space-y-4 sm:space-y-2.5 px-4 sm:px-6 py-2 pb-6">
        {clinics.slice(0, 7).map((clinic) => (
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
                  تقرير المرضى
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleApprove(clinic.id, true)}
                disabled={loadingId === clinic.id || clinic.verified}
                className={`p-1.5 rounded-lg transition-colors ${
                  clinic.verified
                    ? "bg-green-100 text-green-600"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                } disabled:opacity-50`}
                title="تفعيل"
              >
                <Check size={18} />
              </button>

              <button
                onClick={() => handleApprove(clinic.id, false)}
                disabled={loadingId === clinic.id}
                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                title="رفض"
              >
                <X size={18} />
              </button>

              <button className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0">
                <Download
                  size={18}
                  strokeWidth={1.5}
                  className="text-blue-600 dark:text-blue-400"
                />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}