"use client";

import {
  Star,
  Mail,
  Phone,
  MapPin,
  Pencil,
  BadgeCheck,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DoctorProfile() {
  const { user } = useAuth();
  const fullName = (user?.profile?.full_name as string) || "د.محمد إسماعيل";
  const specialist = (user?.profile?.specialist as string) || "طبيب قلب";

  return (
    <div className="space-y-4 flex flex-col items-center gap-10">

      {/* Top Card */}
      <div className="bg-(--card-bg) rounded-2xl border border-(--card-border) shadow-sm p-5 w-11/12">

        {/* Header */}
        <div className="flex items-center justify-between">

          {/* Edit */}
          <button className="flex items-center gap-2 text-xl text-(--text-primary) hover:text-black cursor-pointer">
            <Pencil size={16} />
            تعديل الملف الشخصي
          </button>

          {/* Doctor Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h2 className="font-semibold text-2xl text-(--text-primary)">{fullName}</h2>
              <p className="text-xl text-(--text-secondary)">{specialist}</p>
            </div>

            <img
              src="https://avatars.githubusercontent.com/u/1047807?v=4"
              alt="doctor"
              className="w-44 h-44 rounded-full object-cover"
            />
          </div>

        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-5 pt-5 ">

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[24px] ">4.9</span>
              <Star size={25} fill="gold" className=" text-yellow-400" />
            </div>
            <span className="text-[20px] text-gray-500">130 تقييمًا</span>
          </div>

          {/* Experience */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-4 justify-center">
                <span className="text-[24px] font-medium">خبرة</span>
                <User size={25} className="text-green-600" />
            </div>
            <span className="text-[20px] text-gray-500">12 عامًا</span>
          </div>

          {/* Verification */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-4 justify-center">
                <span className="text-[24px] font-medium">التوثيق</span>
                <BadgeCheck size={25} className="text-blue-600" />
            </div>
            <span className="text-[20px] text-gray-500">معتمد</span>
          </div>

        </div>
      </div>

      {/*  Bottom Section */}
      <div className="grid  md:grid-cols-3 gap-24 w-11/12 justify-end " >

        {/*  Working Hours */}
        <div className="bg-(--card-bg) col-span-2 rounded-2xl border h-fit border-(--card-border) shadow-sm p-5">
          <h3 className="font-bold text-2xl mb-4 text-right text-(--text-primary)">ساعات العمل</h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between text-xl font-semibold text-(--text-primary)">
              <span className="">9:00 صباحاً  5:00 _مساءً</span>
              <span className="">الإثنين - الجمعة</span>
            </div>

            <div className="flex justify-between text-xl font-semibold text-(--text-primary)">
              <span className="">10:00 صباحاً  2:00 _مساءً</span>
              <span className="">السبت</span>
            </div>

            <div className="flex justify-between text-xl font-semibold text-(--text-primary)">
              <span className="text-[#B71C1C] font-bold">مغلق</span>
              <span className="font-medium">الأحد</span>
            </div>

          </div>
        </div>

        {/*  Personal Info */}
        <div className="bg-(--card-bg) col-span-1 rounded-2xl border border-(--card-border) shadow-sm p-10 w-fit">
          <h3 className="font-bold text-2xl mb-10 text-right">المعلومات الشخصية</h3>

          <div className="space-y-4 text-sm flex flex-col items-end gap-5">

            <div className="flex  flex-col items-end justify-between text-xl gap-3 text-(--text-primary) ">
              <div className="flex items-center gap-2 font-bold ">
                <span className=" ">البريد الإلكتروني</span>
                <Mail size={20} />
              </div>
              <span className="text-(--text-secondary)">mohamed65@gmail.com</span>
            </div>

            <div className="flex flex-col items-end justify-between text-xl gap-3 text-(--text-primary) ">
              <div className="flex items-center gap-2 font-bold ">
                <span className=" ">رقم الهاتف</span>
                <Phone size={20} />
              </div>
                <span className="text-(--text-secondary)">+156584848485</span>
            </div>

            <div className="flex flex-col items-end justify-between text-xl gap-3 text-(--text-primary) ">
              <div className="flex items-end gap-2 font-bold ">
                <span className="">العنوان</span>
                <MapPin size={20} />
              </div>
              <span className="text-(--text-secondary) ">
                123 شارع صلاح الدين، المنصورة
              </span>
            </div>

          </div>
        </div>
        

      </div>
    </div>
  );
}