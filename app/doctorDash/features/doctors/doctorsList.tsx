"use client";

import { useState, useMemo } from "react";
import { Clock } from "lucide-react";

const appointments = [
  {
    name: "محمد خالد",
    type: "زيارة",
    date: "2026-04-11",
    time: "09:00",
  },
  {
    name: "لبان محمد",
    type: "استشارة",
    date: "2026-04-11",
    time: "11:35",
  },
  {
    name: "بسنت محمد",
    type: "طوارئ",
    date: "2026-04-11",
    time: "20:35",
  },
  {
    name: "محمد السيد",
    type: "استشارة",
    date: "2026-04-11",
    time: "23:00",
  },
  {
    name: "محمد السيد",
    type: "استشارة",
    date: "2026-04-11",
    time: "23:00",
  },
  {
    name: "محمد السيد",
    type: "استشارة",
    date: "2026-04-11",
    time: "23:00",
  },
  {
    name: "محمد السيد",
    type: "استشارة",
    date: "2026-04-11",
    time: "23:00",
  },
  {
    name: "محمد السيد",
    type: "استشارة",
    date: "2026-04-11",
    time: "23:00",
  },
];

type TodayAppointment = {
  id?: number;
  name: string;
  type: string;
  date: string;
  time: string;
};

export default function TodayAppointments({
  appointments: appointmentsProp,
}: {
  appointments?: TodayAppointment[];
}) {
  const rows = appointmentsProp ?? appointments;
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

    const week = useMemo(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toISOString().split("T")[0],
        day: d.getDate(),
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return rows
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [rows, selectedDate]);

  const currentTime = new Date().toTimeString().slice(0, 5);

  const getStatus = (time: string) => {
    return time <= currentTime ? "جاري الكشف" : null;
  };
  const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
};

const { start, end } = getWeekRange(currentDate);
const formatRange = () => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };

  return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString(
    "en-US",
    options
  )}`;
};
const nextWeek = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + 7);
  setCurrentDate(newDate);
};

const prevWeek = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() - 7);
  setCurrentDate(newDate);
};
const weekDays = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(start);
  d.setDate(start.getDate() + i);

  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toISOString().split("T")[0],
    num: d.getDate(),
  };
});
  return (
    <div className=" flex flex-col bg-(--card-bg)  rounded-2xl border border-(--card-border) shadow-sm w-full h-155 ">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm sm:text-base text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          جميع المواعيد
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
         طلب حجز موعد
        </h1>
      </div>

      {/* Appointments */}
      <div className="space-y-4 flex-1 overflow-y-auto scroll p-6">
        {filtered.length === 0 && (
          <p className=" w-full h-full flex items-center justify-center  text-(--text-secondary) text-sm">
            لا يوجد مواعيد
          </p>
        )}

        {filtered.map((item, i) => {
          const status = getStatus(item.time);

          return (
            <div key={i} className="flex justify-between items-center">

              {/* Time */}
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                {status
                  ? <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded mt-1 inline-block">
                      {status}
                    </span>
                  : 
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock size={14} className=" text-(--text-secondary) " />
                      <span className=" text-(--text-secondary) ">{item.time}</span>
                    </div>  
                }
              </div>

              {/* Info */}
              <div className="text-right">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-(--text-secondary) ">{item.type}</p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Week Navigation */}
      <div className="mt-auto p-10">
        <div className="flex items-center justify-between mt-6">

          {/* Right arrow */}
          <button onClick={prevWeek} className="text-lg text-(--text-[primary]) cursor-pointer">
            ❮
          </button>

          {/* Range */}
          <p className="text-sm font-semibold text-(--text-primary)">
            {formatRange()}
          </p>

          {/* Left arrow */}
          <button onClick={nextWeek} className="text-lg text-(--text-primary) cursor-pointer">
            ❯
          </button>

        </div>
        <div className="flex justify-between mt-6 text-xs text-(--text-primary)">
          
          {weekDays.map((d, i) => (
            <div
              key={i}
              onClick={() => setSelectedDate(d.date)}
              className={`cursor-pointer text-center
                ${d.date === selectedDate ? "bg-blue-100 text-blue-600 rounded-xl p-1 -translate-y-4" : ""}`}
            >
              <p>{d.day}</p>

              <div
                className={`mt-1 w-8 h-8 flex items-center justify-center rounded-lg`}
              >
                {d.num}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
