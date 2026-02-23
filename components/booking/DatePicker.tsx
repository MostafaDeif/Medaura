"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

interface DatePickerProps {
  onSelect: (date: string) => void;
  onClose: () => void;
}

export default function DatePicker({ onSelect, onClose }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 10)); // Default to June 10, 2026
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = locale === "ar" 
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const dayNames = locale === "ar"
    ? ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Mock booked dates
  const bookedDates = [11, 15, 20, 25];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTimeNavigation = (monthsOffset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsOffset, 1));
  };

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isBooked = bookedDates.includes(d);

    days.push(
      <button
        key={d}
        disabled={isBooked}
        onClick={() => {
          const formattedDate = `${d} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
          onSelect(formattedDate);
        }}
        className={`relative h-10 w-10 flex items-center justify-center rounded-lg text-sm transition-colors
          ${isBooked ? "text-gray-300 cursor-not-allowed" : "text-[#001A6E] hover:bg-blue-50"}
        `}
      >
        {d}
        {isBooked && (
          <div className="absolute w-6 h-[1px] bg-gray-300 rotate-[-45deg]"></div>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between">
          <button onClick={handlePrevMonth} className="p-2 text-gray-400 hover:text-[#001A6E]">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl font-bold text-[#001A6E]">
            {currentDate.getDate()} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="p-2 text-gray-400 hover:text-[#001A6E]">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mb-8 flex justify-between px-2 text-xs font-medium text-gray-500 gap-2">
          <button 
            onClick={() => handleTimeNavigation(-3)}
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {locale === "ar" ? "منذ 3 أشهر" : "3 months ago"}
          </button>
          <button 
            onClick={() => handleTimeNavigation(-6)}
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {locale === "ar" ? "منذ 6 أشهر" : "6 months ago"}
          </button>
          <button 
            onClick={() => handleTimeNavigation(-12)}
            className="px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {locale === "ar" ? "منذ عام" : "1 Year Ago"}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {dayNames.map((day) => (
            <div key={day} className="h-10 text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
          {days}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-[#001A6E] py-4 font-bold text-white hover:bg-[#001250]"
        >
          {t("booking.confirm", locale)}
        </button>
      </div>
    </div>
  );
}
