"use client";

import { useEffect, useMemo, useState } from "react";

const initialAppointments = [
  {
    title: "جولة الصباح",
    start: "09:00",
    end: "11:00",
    status: 1,
  },
  {
    title: "معاينة مرضى العيادة",
    start: "11:00",
    end: "14:00",
    status: 2,
  },
  {
    title: "استشارة جراحة طارئة",
    start: "14:00",
    end: "24:30",
    status: 3,
  },
];

type Status = 1 | 2 | 3;
let status: Status = 1 ;
// console.log(status);
//  تحويل الوقت لـ Date
function timeToDate(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
function isInRange(start: string, end: string) {
  const now = Date.now();

  const s = timeToDate(start).getTime();
  const e = timeToDate(end).getTime();

  return now >= s && now <= e;
}
export default function TodaySchedule() {
  const [now, setNow] = useState(new Date());

  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  //  تحديد الحالة (done / current / upcoming)
  const appointments = useMemo(() => {
    return initialAppointments.map((a) => {
      const start = timeToDate(a.start).getTime();
      const end = timeToDate(a.end).getTime();
      const current = now.getTime();
      return { ...a };
    });
  }, [now]);
const liveStatus: Status = useMemo(() => {
  const found = initialAppointments.find(a => 
    isInRange(a.start, a.end)
  );

  return found?.status as Status ?? 1 as Status;
}, [now]);
console.log(liveStatus);
  //  حساب progress الحقيقي
  const progress = useMemo(() => {
    const total = initialAppointments.reduce((acc, a) => {
      const start = timeToDate(a.start).getTime();
      const end = timeToDate(a.end).getTime();
      return acc + (end - start);
    }, 0);

    const passed = initialAppointments.reduce((acc, a) => {
      const start = timeToDate(a.start).getTime();
      const end = timeToDate(a.end).getTime();
      const current = now.getTime();

      if (current >= end) return acc + (end - start);

      if (current > start) return acc + (current - start);

      return acc;
    }, 0);

    return Math.min(Math.round((passed / total) * 100), 100);
  }, [now]);
  const today = new Date();

  const formattedDate = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  //  circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colors: Record<Status, string> = {
    1: "#09800F",
    2: "#001A6E",
    3: "#828798",
  };
  return (
<div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-4 sm:p-6 w-full max-w-sm">

  {/* Header */}
  <div className="text-right mb-4">
    <h2 className="font-bold text-lg sm:text-xl">جدول اليوم</h2>
    <p className="text-xs sm:text-sm text-(--text-secondary) flex items-center gap-2 justify-end">
      {formattedDate}
      <span
        className="w-2.5 h-2.5 mt-1 rounded-full"
        style={{ backgroundColor: colors[liveStatus] }}
      ></span>
    </p>
  </div>

  {/* Circle */}
  <div className="flex justify-center mb-6 relative">
    <div className="w-37.5 sm:w-45 aspect-square">
      <svg viewBox="0 0 180 180" className="w-full h-full">
        
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="var(--card-bg)"
          strokeWidth="14"
          fill="none"
        />

        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke={colors[liveStatus]}
          strokeWidth="20"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
    </div>

    {/* center */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-lg sm:text-xl font-semibold">{progress}%</span>
      <span className="text-[10px] sm:text-xs text-gray-500">إنجاز يومي</span>
    </div>
  </div>

  {/* Timeline */}
  <div className="space-y-3 sm:space-y-4 text-right">
    {initialAppointments.map((a, i) => {
      return (
        <div key={i} className="flex items-start gap-3 justify-end">
          <div>
            <p className="text-sm sm:text-md font-medium text-(--text-primary)">
              {a.title}
            </p>
            <p
              className={`text-xs sm:text-sm font-semibold text-(--text-secondary) ${
                isInRange(a.start, a.end) ? "text-(--text2-bg)" : ""
              }`}
            >
              {isInRange(a.start, a.end)
                ? "الآن"
                : `${a.start} - ${a.end}`}
            </p>
          </div>

          <span
            className="w-2.5 h-2.5 mt-1 rounded-full"
            style={{ backgroundColor: colors[a.status as Status] }}
          ></span>
        </div>
      );
    })}
  </div>
</div>
  );
}
