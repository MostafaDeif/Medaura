"use client";

import { useState } from "react";
import { ArrowLeft, Router, X } from "lucide-react";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useParams } from "next/navigation";
const patient = {
  name: "محمد احمد",
  img: "https://i.pravatar.cc/100",
  lastVisit: "15/5/2025",
  diagnosis: "ارتفاع طفيف في ضغط الدم",
  meds: ["ليسينوبريل 10 ملغ", "كلاريتين"],
  notes:
    "يشكو المريض من صداع صباحي متقطع. كان ضغط الدم 135/85.",
  phone: "+156565848",
  email: "mohamed@gmail.com",
  history: [
    {
      title: "فحص روتيني",
      doctor: "د. محمد اسماعيل",
      date: "9 أكتوبر",
    },
    {
      title: "فحص روتيني",
      doctor: "د. محمد اسماعيل",
      date: "28 أكتوبر",
    },
  ],
};
export default function PatientDetails() {
  const [notes, setNotes] = useState(patient.notes);
  const [open, setOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    
    setNotes((prev) => prev + "\n\n" + newNote);
    setNewNote("");
    setOpen(false);
  };
  const link = useParams()
  console.log(link)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 ">

      {/*  Left */}
      <div className="lg:col-span-2 space-y-6">

        {/* Diagnosis */}
        <div className="bg-(--card-bg)  rounded-2xl border border-(--card-border) p-6">

          <div className="flex justify-end gap-70 mb-4">
            <div className="text-right flex flex-col gap-5">
              <p className=" text-(--text2-bg) text-sm font-bold">التشخيص</p>
              <h2 className="font-semibold text-lg">
                {patient.diagnosis}
              </h2>
            </div>

            <div className="text-right flex flex-col gap-5">
              <p className="text-sm text-(--text2-bg) font-bold ">آخر زيارة</p>
              <p className="font-medium">{patient.lastVisit}</p>
            </div>
          </div>

          {/* meds */}
          <div className="text-right mb-4">
            <p className="text-sm text-(--text2-bg) font-bold mb-2">
              الأدوية الموصى بها
            </p>

            <div className="flex gap-2 items-end flex-col ">
              {patient.meds.map((m, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md w-fit"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* notes */}
          <p className="text-sm text-(--primary) text-right whitespace-pre-line">
            {notes}
          </p>

        </div>

        {/* History */}
        <div className="bg-(--card-bg) rounded-2xl border border-(--card-border) p-6">

          <h3 className="font-bold text-2xl mb-4 text-right">
            التاريخ الطبي السابق
          </h3>

          <div className="space-y-4 flex flex-col gap-5">
            {patient.history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between  p-4 hover:bg-(--hover-bg) hover:rounded-lg  transition cursor-pointer"
              >
                <ArrowLeft size={20} className="text-(--text-secondary)" />
                <div className=" flex gap-20 text-xl items-center">
                    <div className="text-right">
                    <p className="font-medium">{h.title}</p>
                    <p className="text-xs text-(--text-secondary)">
                        {h.doctor}
                    </p>
                    </div>
                    <p className="text-sm text-(--text-secondary)">{h.date}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/*  Right */}
      <div className="space-y-6 border rounded-2xl p-6 bg-(--card-bg) border-(--card-border)">

        {/* Profile */}
        <div className="bg-(--card-bg) p-6 text-center flex flex-col gap-3 ">

          <img
            src={patient.img}
            className="w-20 h-20 rounded-full mx-auto mb-3"
          />

          <h3 className="font-bold text-xl ">{patient.name}</h3>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 bg-[#1F2B6C] text-white cursor-pointer px-4 py-2 rounded-2xl text-xl flex items-center gap-2 justify-center hover:bg-(--text2-bg) transition"
          >
            + إضافة ملاحظة
          </button>

        </div>

        {/* Contact */}
        <div className=" p-6 text-right flex flex-col gap-3 ">

          <h3 className="font-bold text-2xl mb-3">
            معلومات الاتصال
          </h3>

          <div className=" flex justify-end gap-2 items-center">
            <p className="text-sm text-(--text-secondary) ">
                {patient.phone}
            </p>
            <p className="text-xl text-(--text-secondary) ">
               : الهاتف
            </p>
          </div>
          <div className=" flex justify-end items-center gap-2">
            <p className="text-sm text-(--text-secondary) ">
              {patient.email}
            </p>
            <p className="text-xl text-(--text-secondary) flex items-center gap-2 ">
               : الإيميل 
            </p>
          </div>

        </div>

      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            <div className="flex justify-between mb-4">
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
              <h3 className="font-semibold">إضافة ملاحظة</h3>
            </div>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg outline-none text-sm"
              placeholder="اكتب الملاحظة..."
            />

            <button
              onClick={addNote}
              className="mt-4 w-full bg-[#1F2B6C] text-white py-2 rounded-lg"
            >
              حفظ
            </button>

          </div>

        </div>
      )}

    </div>
  );
}