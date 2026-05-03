"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface Doctor {
  id: number;
  name?: string;
  full_name?: string;
  specialty?: string;
  specialist?: string;
  image?: string;
  photo?: string;
  status?: "available" | "busy";
  verified?: boolean;
}

const DOCTOR_FALLBACK_IMAGE = "/images/blank-profile-picture.png";

export default function DoctorsList({ doctors: doctorsProp }: { doctors?: Doctor[] }) {
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsProp || []);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (doctorsProp) {
      setDoctors(doctorsProp);
    }
  }, [doctorsProp]);

  const handleVerify = async (id: number, verify: boolean) => {
    setLoadingId(id);
    try {
      const endpoint = verify ? `/api/admin/${id}/verify` : `/api/admin/${id}/unverify`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === id ? { ...d, verified: verify } : d))
        );
      }
    } catch (error) {
      console.error("Failed to update doctor verification:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className=" bg-(--card-bg) border border-(--card-border) h-max rounded-xl shadow-sm">

      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          الأطباء
        </h1>
      </div>

      {/* Doctors */}
      <div className="space-y-4 sm:space-y-2.5 px-4 sm:px-6 py-2 pb-6">
        {doctors.slice(0, 7).map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center justify-between p-3 sm:p-4 bg-(--semi-card-bg) rounded-lg hover:bg-(--hover-bg) transition-colors"
          >
            
            {/* Doctor Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              
              <img
                src={doctor.photo?.trim() || doctor.image?.trim() || DOCTOR_FALLBACK_IMAGE}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                alt={doctor.name || doctor.full_name}
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-(--text-primary) text-sm sm:text-base truncate">
                  {doctor.name || doctor.full_name}
                </p>

                <p className="text-xs sm:text-sm text-(--text-secondary) truncate">
                  {doctor.specialty || doctor.specialist}
                </p>
              </div>
            </div>

            {/* Status Badge & Actions */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  doctor.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.verified ? "مفعل" : "غير مفعل"}
              </span>

              <button
                onClick={() => handleVerify(doctor.id, !doctor.verified)}
                disabled={loadingId === doctor.id}
                className={`p-1.5 rounded-lg transition-colors ${
                  doctor.verified
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                } disabled:opacity-50`}
                title={doctor.verified ? "إلغاء التفعيل" : "تفعيل"}
              >
                {doctor.verified ? <X size={16} /> : <Check size={16} />}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
