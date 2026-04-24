"use client";

import StatCard from "./charts/StatsCard";
import DonutChart from "./charts/DonutChart";
import PatientProgress from "./charts/PatientProgress";
import PatientsTable from "./charts/PatientTaple";
import { Download } from "lucide-react";
import { useMemo } from "react";
export default function PatientsStats() {
  const stats = [
    {
      title: "إجمالي المرضى",
      value: 108,
      change: 11,
    },
    {
      title: "مرضى جدد",
      value: 20,
      change: 5,
    },
    {
      title: "تحت العلاج",
      value: 10,
      change: -2,
    },
    {
      title: "بدون زيارة",
      value: 18,
      change: 1,
    },
  ];
  const data = [
  { name: "نشط", value: 700, color: "#0B8A13" },
  { name: "متعافى", value: 300, color: "#0F2A7A" },
  { name: "تحت العلاج", value: 200, color: "#7B1FA2" },
];
  const weeklyData = [
    { month:1, exciting: 40 },
    { month:2, exciting: 50 },
    { month:3, exciting: 45 },
    { month:4, exciting: 60 },
    { month:5, exciting: 38 },
    { month:6, exciting: 55 },
    { month:7, exciting: 65 },
    { month:8, exciting: 65 },
    { month:9, exciting: 65 },
    { month:10, exciting: 65 },
    { month:11, exciting: 65 },
    { month:12,exciting: 65 }
  ];

return (
    <div className="space-y-4 ">

      {/* Header */}
      <div className="flex items-center justify-between">

        <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-(--input-bg) border border-(--input-border) hover:bg-(--input-hover)">
          <Download size={16} />
          تصدير البيانات
        </button>

        <div className="text-right flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-(--text-primary)">إدارة المرضى</h2>
          <p className="text-xs text-(--text-secondary)">
            عرض ومتابعة جميع سجلات المرضى في العيادة
          </p>
        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8">
        <div className=" col-span-1">
          <DonutChart data={data}  />
        </div>
        <div className=" col-span-2">
          <PatientProgress data={weeklyData}  /> 
        </div>
      </div>
      <div>
        <PatientsTable />
      </div>
    </div>
  );
}