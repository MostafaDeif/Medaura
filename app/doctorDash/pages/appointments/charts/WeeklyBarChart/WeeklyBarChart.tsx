"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const weeklyData = [
  { day: 1, value: 45 },
  { day: 2, value: 60 },
  { day: 3, value: 70 },
  { day: 4, value: 90 },
  { day: 5, value: 80 },
  { day: 6, value: 50 },
  { day: 7, value: 40 },
];

export default function WeeklyAppointmentsChart() {
  const [mode, setMode] = useState<"current" | "last7">("current");

  const data = useMemo(() => {
    if (mode === "current") {
      return weeklyData;
    }

    // مثال: تزود random بسيط كأنها بيانات قديمة
    return weeklyData.map((d) => ({
      ...d,
      value: Math.floor(d.value * (0.7 + Math.random() * 0.6)),
    }));
  }, [mode]);

  const weekRange = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 7 }).map((_, i) => {
      const offset = i - 6;

      const d = new Date();
      d.setDate(now.getDate() + offset);

      return {
        label: d.toLocaleDateString("ar-EG", { weekday: "long" }),
        date: d.toISOString().split("T")[0],
        day: d.getDate(),
        month: d.toLocaleDateString("en-EG", { month: "long" }).slice(0, 3),
        fullDate: d.toLocaleDateString("en-EG", {
          day: "numeric",
          month: "long",
        }),
        isToday: d.toDateString() === now.toDateString(),
      };
    });
  }, []);
  const chartData = useMemo(() => {
    return weekRange.map((day, i) => ({
      label: day.label,
      day: day.day,
      month: day.month,
      value: weeklyData[i]?.value || 0,
    }));
  }, [weekRange, weeklyData]);
  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Filters */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setMode("last7")}
            className={` text-md font-semibold text-(--text-primary)`}
          >
            آخر 7 أيام
          </button>

          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full bg-[#1F2B6C] p-1}`} />
            <button
              onClick={() => setMode("current")}
              className={` text-md font-semibold text-(--text-primary)`}
            >
              الحالي
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-right">
          <h3 className="font-bold text-2xl text-(--text-primary)">
            اتجاهات المواعيد الأسبوعية
          </h3>
          <p className="text-md text-(--text-secondary)">
            مقارنة كثافة الزوار خلال الأسبوع الحالي
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className=" h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={30} barGap={-28}>
            <CartesianGrid
              strokeDasharray="0 0"
              vertical={false}
              stroke="var(--card-border)"
            />

            <XAxis
              dataKey="label"
              tickMargin={5}
              tick={{ fontSize: 12, fill: "var(--text-primary)" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              orientation="right"
              tick={{ fontSize: 12, fill: "var(--text-primary)" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                 console.log(data);
                  return `${data.day} ${data.month} - ${label}`;
                }
                return label;
              }}
              formatter={(value) => {
                return [
                  <span style={{  color: "var(--text2-bg)", fontWeight: "bold" }}>
                    <span className=" text-(--text-primary)">value : </span>
                    {value}
                  </span>,
                ];
              }}
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
                accentColor: "#1F2B6C",
              }}
            />
            <Bar
              dataKey="value"
              fill="#1F2B6C"
              barSize={28}
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
