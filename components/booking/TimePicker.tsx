"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

interface TimePickerProps {
  onSelect: (time: string) => void;
  onClose: () => void;
}

export default function TimePicker({ onSelect, onClose }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);
  }, []);

  // Mock booked times
  const bookedTimes = ["10:00 AM", "10:30 AM", "15:30 PM"];

  const timeSlots: Record<string, string[]> =
    locale === "ar"
      ? {
          "الصباح (09:00 - 12:00)": [
            "9:00 AM",
            "9:30 AM",
            "10:00 AM",
            "10:30 AM",
            "11:00 AM",
            "11:30 AM",
          ],
          "الظهر (12:00 - 17:00)": [
            "12:00 PM",
            "12:30 PM",
            "13:00 PM",
            "13:30 PM",
            "14:00 PM",
            "14:30 PM",
            "15:00 PM",
            "15:30 PM",
            "16:00 PM",
            "16:30 PM",
          ],
          "المساء (17:00 - 21:00)": [
            "17:00 PM",
            "17:30 PM",
            "18:00 PM",
            "18:30 PM",
            "19:00 PM",
            "19:30 PM",
            "20:00 PM",
            "20:30 PM",
          ],
        }
      : {
          "Morning (09:00 - 12:00)": [
            "9:00 AM",
            "9:30 AM",
            "10:00 AM",
            "10:30 AM",
            "11:00 AM",
            "11:30 AM",
          ],
          "Afternoon (12:00 - 17:00)": [
            "12:00 PM",
            "12:30 PM",
            "13:00 PM",
            "13:30 PM",
            "14:00 PM",
            "14:30 PM",
            "15:00 PM",
            "15:30 PM",
            "16:00 PM",
            "16:30 PM",
          ],
          "Evening (17:00 - 21:00)": [
            "17:00 PM",
            "17:30 PM",
            "18:00 PM",
            "18:30 PM",
            "19:00 PM",
            "19:30 PM",
            "20:00 PM",
            "20:30 PM",
          ],
        };
  const handleSelectTime = (time: string) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  const handleConfirm = () => {
    if (selectedTime) {
      onSelect(selectedTime);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-[#001A6E]">
            {t("booking.selectTime", locale)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#001A6E]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {Object.entries(timeSlots).map(([shift, times]) => (
            <div key={shift}>
              <h4
                className={`text-lg font-bold text-[#001A6E] mb-4 ${locale === "ar" ? "text-right" : "text-left"}`}
              >
                {shift}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {times.map((time) => {
                  const isBooked = bookedTimes.includes(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => handleSelectTime(time)}
                      className={`py-3 px-4 rounded-2xl font-semibold text-sm transition-all
                        ${
                          isBooked
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-[#001A6E] text-white shadow-lg"
                              : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#001A6E] hover:text-[#001A6E]"
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 py-4 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t("booking.cancel", locale)}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className={`flex-1 rounded-2xl py-4 font-bold transition-colors ${
              selectedTime
                ? "bg-[#001A6E] text-white hover:bg-[#001250]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t("booking.confirm", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
