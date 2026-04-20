import Link from "next/link";

type DoctorSummary = {
  name: string;
  specialization: string;
  price: number;
  currency: string;
};

type DateSelectorProps = {
  value: string;
};

type TimeSlotsProps = {
  slots: string[];
  selectedTime: string;
};

type BookingButtonProps = {
  disabled: boolean;
};

const DEFAULT_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const DEFAULT_DOCTOR: DoctorSummary = {
  name: "د. كريم محمد",
  specialization: "تخصص عيون",
  price: 350,
  currency: "ج.م",
};

const DEFAULT_DATE = "2026-10-01";
const DEFAULT_TIME = "11:30";

function DoctorSummaryCard({ doctor }: { doctor: DoctorSummary }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Doctor</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">
        {doctor.name}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{doctor.specialization}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-sm text-slate-500">Consultation Fee</p>
        <p className="text-xl font-semibold text-blue-700">
          {doctor.price.toLocaleString()} {doctor.currency}
        </p>
      </div>
    </section>
  );
}

function DateSelector({ value }: DateSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Select Date</h3>
      <div className="mt-4">
        <input
          type="date"
          value={value}
          readOnly
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </section>
  );
}

function TimeSlots({ slots, selectedTime }: TimeSlotsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Available Time Slots
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => {
          const active = selectedTime === slot;

          return (
            <button
              key={slot}
              type="button"
              disabled
              className={[
                "rounded-xl border px-3 py-2 text-sm font-medium transition",
                active
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",
              ].join(" ")}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BookingButton({ disabled }: BookingButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="w-full rounded-xl bg-blue-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      Confirm Booking
    </button>
  );
}

export default function BookAppointmentPage() {
  const doctor = DEFAULT_DOCTOR;
  const selectedDate = DEFAULT_DATE;
  const selectedTime = DEFAULT_TIME;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DoctorSummaryCard doctor={doctor} />
          <DateSelector value={selectedDate} />
          <TimeSlots slots={DEFAULT_TIME_SLOTS} selectedTime={selectedTime} />
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
          <h3 className="text-lg font-semibold text-slate-900">
            Booking Summary
          </h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              Date:{" "}
              <span className="font-medium text-slate-900">
                {selectedDate || "Not selected"}
              </span>
            </p>
            <p>
              Time:{" "}
              <span className="font-medium text-slate-900">
                {selectedTime || "Not selected"}
              </span>
            </p>
          </div>

          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            هذه نسخة Layout فقط بدون منطق حجز حقيقي حاليًا.
          </p>

          <div className="mt-6">
            <BookingButton disabled />
          </div>

          <div className="mt-3">
            <Link
              href="/appointments"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              الرجوع إلى المواعيد
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
