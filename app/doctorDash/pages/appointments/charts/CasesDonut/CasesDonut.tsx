"use client";

import {
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";

const data = [
  { name: "كشف عام", value: 90, color: "#0F2A7A" },
  { name: "متابعة", value: 60, color: "#0B8A13" },
  { name: "استشارة", value: 50, color: "#E65100" },
];

const totalPatients = data.reduce((sum, d) => sum + d.value, 0);

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  const expandedOuter = outerRadius + 10;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={expandedOuter}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--text-primary)"
        strokeWidth={4}
        cornerRadius={5}
      />
    </g>
  );
};

export default function CasesDonut() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);

  const totalAppointments = useMemo(
    () => data.reduce((sum, dep) => sum + dep.value, 0),
    []
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const { name, value, color } = payload[0].payload;
    const percentage = ((value / totalAppointments) * 100).toFixed(1);

    return (
      <div className="min-w-28 sm:min-w-32 p-3 sm:p-4 rounded-2xl bg-(--card-bg) backdrop-blur-md shadow-2xl border border-(--card-border)">
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 pb-2 border-b border-(--card-border)">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md ring-2 ring-white/50"
              style={{ backgroundColor: color }}
            />
            <span className="font-bold text-sm sm:text-lg text-(--text-primary)">
              {name}
            </span>
          </div>
          <span
            className="px-2 sm:px-3 py-1 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-md"
            style={{ backgroundColor: color }}
          >
            {percentage}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-(--text-secondary) text-xs sm:text-sm font-medium">
            عدد المرضى
          </span>
          <span className="text-lg sm:text-2xl font-black text-(--text-primary)">
            {value.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const pieProps: any = {
    data,
    dataKey: "value",
    cx: "50%",
    cy: "50%",
    innerRadius: 50,
    outerRadius: 75,
    cornerRadius: 4,
    paddingAngle: 8,
    activeIndex,
    activeShape: renderActiveShape,
    isAnimationActive: true,
    onMouseEnter: (_: any, index: number) => {
      setActiveIndex(index);
      setTooltipActive(true);
    },
    onMouseLeave: () => {
      setActiveIndex(-1);
      setTooltipActive(false);
    },
  };

  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-4 sm:p-5 w-full">

      <h3 className="text-right font-semibold mb-4 text-sm sm:text-base">
        توزيع الحالات الطبية
      </h3>

      <div className="relative w-full h-62.5 sm:h-75">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie {...pieProps}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  stroke="var(--text-primary)"
                  strokeWidth={4}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
            tooltipActive ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        >
          <span className="text-lg sm:text-3xl flex flex-col items-center font-bold text-(--text-primary)">
            {totalAppointments.toLocaleString()}
          </span>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap justify-center sm:justify-between gap-2 mt-4 text-[10px] sm:text-xs text-gray-500">
        {data.map((d, i) => (
          <div key={i} className="flex items-center flex-col gap-1">
            <div className=" flex gap-2 items-center text-xs sm:text-sm text-(--text-primary)">
              <span>{d.name}</span>
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            </div>
            <span className=" text-lg sm:text-xl font-bold text-(--text-primary)">
              {((d.value / totalPatients) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}