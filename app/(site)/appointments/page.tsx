import Link from "next/link";
import { useMemo } from "react";

type AppointmentItem = {
  id: number;
  doctor_id: number;
  booking_date: string;
  booking_from: string;
  status: string;
};

const APPOINTMENTS_SAMPLE: AppointmentItem[] = [
  {
    id: 1042,
    doctor_id: 12,
    booking_date: "2026-10-01",
    booking_from: "11:30",
    status: "confirmed",
  },
  {
    id: 1043,
    doctor_id: 7,
    booking_date: "2026-10-05",
    booking_from: "09:00",
    status: "pending",
  },
  {
    id: 1044,
    doctor_id: 3,
    booking_date: "2026-10-09",
    booking_from: "15:00",
    status: "completed",
  },
];

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

function StatusBadge({ status }: { status: string }) {
  const className = useMemo(() => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }, [status]);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status || "unknown"}
    </span>
  );
}

export default function AppointmentsPage() {
  const appointments = APPOINTMENTS_SAMPLE;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">المواعيد</h1>
              <p className="mt-2 text-sm text-slate-600">
                Layout مبدئي لعرض المواعيد قبل ربط البيانات الفعلية.
              </p>
            </div>
            <Link
              href="/appointments/book"
              className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              حجز موعد جديد
            </Link>
          </div>
        </header>

        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            لا توجد مواعيد حاليًا. يمكنك البدء بحجز موعد جديد.
          </div>
        ) : null}

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-900">
                        رقم الحجز:
                      </span>{" "}
                      #{appointment.id}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        الطبيب:
                      </span>{" "}
                      {appointment.doctor_id}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        التاريخ:
                      </span>{" "}
                      {formatDate(appointment.booking_date)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        الوقت:
                      </span>{" "}
                      {appointment.booking_from || "-"}
                    </p>
                  </div>

                  <StatusBadge status={appointment.status} />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
