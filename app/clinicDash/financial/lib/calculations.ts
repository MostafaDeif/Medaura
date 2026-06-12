import type {
  RawBooking,
  RawStaffMember,
  DoctorFinancialRecord,
  AppointmentRecord,
  FinancialSummary,
  DailyRevenue,
  MonthlyRevenue,
  FinancialTransaction,
  FinancialFilters,
  ProfitSharingStore,
  AppointmentPaymentStore,
  PaymentStatus,
} from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────────

export const CURRENCY = "EGP";
export const DEFAULT_DOCTOR_PCT = 70;

/** Format number as Arabic currency string */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " ج.م";
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + "م ج.م";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1) + "ك ج.م";
  }
  return formatCurrency(amount);
}

/** Extract the numeric ID from a staff/booking record */
export function getDoctorId(member: RawStaffMember): string | number | null {
  const raw = member.id ?? member.staff_id ?? member.user_id;
  if (typeof raw === "string" || typeof raw === "number") return raw;
  return null;
}

/** Return today's date as "YYYY-MM-DD" */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Return current month as "YYYY-MM" */
export function currentMonthStr(): string {
  return new Date().toISOString().slice(0, 7);
}

/** Return current year as "YYYY" */
export function currentYearStr(): string {
  return String(new Date().getFullYear());
}

/** Get booking_date from a RawBooking */
function getBookingDate(b: RawBooking): string {
  return b.booking_date ?? b.created_at?.slice(0, 10) ?? "";
}

/**
 * Returns the appointment's scheduled DateTime as a Date object.
 * Uses booking_date + booking_from (time). Falls back to midnight.
 */
function getBookingDateTime(b: RawBooking): Date | null {
  const date = getBookingDate(b);
  if (!date) return null;
  const time = b.booking_from ?? "00:00";
  // Normalise to HH:MM (handle "HH:MM:SS" from backend)
  const normalised = time.slice(0, 5).padEnd(5, "0");
  return new Date(`${date}T${normalised}:00`);
}

/**
 * Returns true when the appointment's scheduled date+time is in the past.
 * Expired + unpaid → auto-cancelled.
 */
export function isBookingExpired(b: RawBooking): boolean {
  const dt = getBookingDateTime(b);
  if (!dt) return false;
  return dt < new Date();
}

/**
 * Derives the effective per-appointment payment status:
 *  "paid"      — explicitly marked paid in the store
 *  "cancelled" — explicitly cancelled OR past schedule without payment
 *  "pending"   — upcoming appointment, not yet marked
 */
export function getAppointmentPaymentStatus(
  b: RawBooking,
  apptStore: AppointmentPaymentStore
): PaymentStatus {
  const stored = apptStore[String(b.id)];
  if (stored === "paid") return "paid";
  if (stored === "cancelled") return "cancelled";
  // Auto-cancel when the appointment time has passed without being paid
  if (isBookingExpired(b)) return "cancelled";
  return "pending";
}

// ── Core Calculations ──────────────────────────────────────────────────────────

/**
 * Build per-appointment records for the Doctor Earnings Table.
 * Includes ALL appointments in the date range (paid, pending, and auto-cancelled).
 * Revenue fields (doctorShare / clinicShare) are non-zero only for paid appointments.
 */
export function computeAppointmentRecords(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  profitStore: ProfitSharingStore,
  apptStore: AppointmentPaymentStore,
  filters?: FinancialFilters
): AppointmentRecord[] {
  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  const records: AppointmentRecord[] = [];

  for (const b of bookings) {
    const date = getBookingDate(b);

    // Apply date range filters
    if (filters?.dateFrom && date < filters.dateFrom) continue;
    if (filters?.dateTo && date > filters.dateTo) continue;

    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;

    const member = staffMap.get(docId);
    if (!member) continue;

    // Apply specialty / doctor filters
    if (filters?.specialist && member.specialist !== filters.specialist) continue;
    if (filters?.doctorId && String(docId) !== String(filters.doctorId)) continue;

    const paymentStatus = getAppointmentPaymentStatus(b, apptStore);

    const config = profitStore[String(docId)] ?? { doctorPercentage: DEFAULT_DOCTOR_PCT, paid: [] };
    const fee = member.consultation_price ?? b.consultation_price ?? 0;
    const docPct = config.doctorPercentage;
    const clinicPct = 100 - docPct;

    // Revenue is only realised on paid appointments
    const isPaid = paymentStatus === "paid";
    const docShare = isPaid ? (fee * docPct) / 100 : 0;
    const clinicShare = isPaid ? (fee * clinicPct) / 100 : 0;

    records.push({
      bookingId: b.id,
      doctorId: docId,
      doctorName: member.full_name,
      specialist: member.specialist ?? "—",
      patientName: b.patient_name ?? `مريض #${b.patient_id ?? b.id}`,
      bookingDate: date,
      bookingFrom: b.booking_from ? b.booking_from.slice(0, 5) : "—",
      consultationFee: fee,
      doctorPercentage: docPct,
      clinicPercentage: clinicPct,
      doctorShare: docShare,
      clinicShare: clinicShare,
      paymentStatus,
    });
  }

  // Sort: paid first → pending → cancelled; within group, newest date first
  const statusOrder: Record<PaymentStatus, number> = { paid: 0, pending: 1, cancelled: 2 };
  return records.sort((a, b) => {
    const order = statusOrder[a.paymentStatus] - statusOrder[b.paymentStatus];
    if (order !== 0) return order;
    return b.bookingDate.localeCompare(a.bookingDate);
  });
}

/**
 * Join bookings + staff into DoctorFinancialRecord[] (per-doctor aggregates).
 * ONLY counts appointments whose paymentStatus === "paid".
 * Used by RevenueCharts, ExportButtons, and FinancialOverviewCards.
 */
export function computeDoctorRecords(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  profitStore: ProfitSharingStore,
  apptStore: AppointmentPaymentStore,
  filters?: FinancialFilters,
  period?: string
): DoctorFinancialRecord[] {
  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  // Only aggregate paid bookings
  const paidBookings = bookings.filter((b) => {
    const date = getBookingDate(b);
    if (filters?.dateFrom && date < filters.dateFrom) return false;
    if (filters?.dateTo && date > filters.dateTo) return false;

    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) return false;

    const member = staffMap.get(docId);
    if (!member) return false;

    if (filters?.specialist && member.specialist !== filters.specialist) return false;
    if (filters?.doctorId && String(docId) !== String(filters.doctorId)) return false;

    return getAppointmentPaymentStatus(b, apptStore) === "paid";
  });

  const agg = new Map<string | number, { count: number; member: RawStaffMember }>();
  for (const b of paidBookings) {
    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;
    const member = staffMap.get(docId);
    if (!member) continue;
    const existing = agg.get(docId);
    if (existing) {
      existing.count++;
    } else {
      agg.set(docId, { count: 1, member });
    }
  }

  const records: DoctorFinancialRecord[] = [];
  const now = period ?? currentMonthStr();

  for (const [docId, { count, member }] of agg) {
    const config = profitStore[String(docId)] ?? { doctorPercentage: DEFAULT_DOCTOR_PCT, paid: [] };
    const fee = member.consultation_price ?? 0;
    const total = fee * count;
    const docPct = config.doctorPercentage;
    const clinicPct = 100 - docPct;
    const docShare = (total * docPct) / 100;
    const clinicShare = (total * clinicPct) / 100;

    records.push({
      doctorId: docId,
      doctorName: member.full_name,
      specialist: member.specialist ?? "—",
      consultationFee: fee,
      completedAppointments: count,
      totalRevenue: total,
      doctorPercentage: docPct,
      clinicPercentage: clinicPct,
      doctorShare: docShare,
      clinicShare: clinicShare,
      paymentStatus: config.paid.includes(now) ? "paid" : "pending",
    });
  }

  return records.sort((a, b) => b.totalRevenue - a.totalRevenue);
}

/**
 * Compute the six financial summary KPIs.
 * Revenue figures are derived from PAID appointments only.
 * pendingPayments accumulates unpaid-but-pending doctor shares.
 */
export function computeSummary(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  profitStore: ProfitSharingStore,
  apptStore: AppointmentPaymentStore
): FinancialSummary {
  const today = todayStr();
  const monthStr = currentMonthStr();
  const yearStr = currentYearStr();

  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  let todayRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  let clinicProfit = 0;
  let doctorsTotalEarnings = 0;
  let pendingPayments = 0;

  for (const b of bookings) {
    const apptStatus = getAppointmentPaymentStatus(b, apptStore);
    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;

    const member = staffMap.get(docId);
    const fee = member?.consultation_price ?? 0;
    if (fee === 0) continue;

    const date = getBookingDate(b);
    const config = profitStore[String(docId)] ?? { doctorPercentage: DEFAULT_DOCTOR_PCT, paid: [] };
    const docPct = config.doctorPercentage;
    const clinicPct = 100 - docPct;

    if (apptStatus === "pending" && date.startsWith(yearStr)) {
      // Count pending doctor share for the "pending payments" KPI
      pendingPayments += (fee * docPct) / 100;
    }

    if (apptStatus !== "paid") continue;

    const docShare = (fee * docPct) / 100;
    const clinicShare = (fee * clinicPct) / 100;

    if (date === today) todayRevenue += fee;
    if (date.startsWith(monthStr)) monthlyRevenue += fee;
    if (date.startsWith(yearStr)) {
      yearlyRevenue += fee;
      clinicProfit += clinicShare;
      doctorsTotalEarnings += docShare;
    }
  }

  return { todayRevenue, monthlyRevenue, yearlyRevenue, clinicProfit, doctorsTotalEarnings, pendingPayments };
}

/**
 * Generate daily revenue data for the last N days (paid appointments only).
 */
export function computeDailyRevenue(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  apptStore: AppointmentPaymentStore,
  days = 30
): DailyRevenue[] {
  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);

  const map = new Map<string, number>();
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    map.set(d.toISOString().slice(0, 10), 0);
  }

  for (const b of bookings) {
    if (getAppointmentPaymentStatus(b, apptStore) !== "paid") continue;
    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;
    const fee = staffMap.get(docId)?.consultation_price ?? 0;
    const date = getBookingDate(b);
    if (map.has(date)) {
      map.set(date, (map.get(date) ?? 0) + fee);
    }
  }

  return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
}

/**
 * Generate monthly revenue for the last N months (paid appointments only).
 */
export function computeMonthlyRevenue(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  apptStore: AppointmentPaymentStore,
  months = 12
): MonthlyRevenue[] {
  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  const ARABIC_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

  const result: MonthlyRevenue[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${ARABIC_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    result.push({ month: key, label, revenue: 0 });
  }

  const monthMap = new Map(result.map((r) => [r.month, r]));

  for (const b of bookings) {
    if (getAppointmentPaymentStatus(b, apptStore) !== "paid") continue;
    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;
    const fee = staffMap.get(docId)?.consultation_price ?? 0;
    const month = getBookingDate(b).slice(0, 7);
    const entry = monthMap.get(month);
    if (entry) entry.revenue += fee;
  }

  return result;
}

/**
 * Build FinancialTransaction[] from PAID bookings only.
 */
export function computeTransactions(
  bookings: RawBooking[],
  staff: RawStaffMember[],
  profitStore: ProfitSharingStore,
  apptStore: AppointmentPaymentStore,
  filters?: FinancialFilters
): FinancialTransaction[] {
  const staffMap = new Map<string | number, RawStaffMember>();
  for (const s of staff) {
    const id = getDoctorId(s);
    if (id !== null) staffMap.set(id, s);
  }

  const txns: FinancialTransaction[] = [];

  for (const b of bookings) {
    // Only include paid appointments in transaction log
    if (getAppointmentPaymentStatus(b, apptStore) !== "paid") continue;

    const docId = b.doctor_id ?? b.staff_id;
    if (!docId) continue;

    const member = staffMap.get(docId);
    if (!member) continue;

    const date = getBookingDate(b);
    if (filters?.dateFrom && date < filters.dateFrom) continue;
    if (filters?.dateTo && date > filters.dateTo) continue;
    if (filters?.doctorId && String(docId) !== String(filters.doctorId)) continue;
    if (filters?.specialist && member.specialist !== filters.specialist) continue;

    const fee = member.consultation_price ?? 0;
    const config = profitStore[String(docId)] ?? { doctorPercentage: DEFAULT_DOCTOR_PCT, paid: [] };
    const docPct = config.doctorPercentage;
    const clinicPct = 100 - docPct;

    txns.push({
      id: `txn-${b.id}`,
      bookingId: b.id,
      doctorId: docId,
      doctorName: member.full_name,
      bookingDate: date,
      totalAmount: fee,
      doctorPercentage: docPct,
      clinicPercentage: clinicPct,
      doctorShare: (fee * docPct) / 100,
      clinicShare: (fee * clinicPct) / 100,
      status: "completed",
    });
  }

  return txns.sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));
}

/** Export data to CSV string (only paid appointments appear in doctor records) */
export function exportToCSV(records: DoctorFinancialRecord[], period: string): string {
  const headers = [
    "الطبيب", "التخصص", "سعر الاستشارة", "عدد المواعيد المدفوعة",
    "إجمالي الإيرادات", "نسبة الطبيب%", "نسبة العيادة%",
    "حصة الطبيب", "حصة العيادة", "حالة الدفع"
  ];

  const rows = records.map((r) => [
    r.doctorName,
    r.specialist,
    r.consultationFee,
    r.completedAppointments,
    r.totalRevenue,
    r.doctorPercentage,
    r.clinicPercentage,
    r.doctorShare.toFixed(2),
    r.clinicShare.toFixed(2),
    r.paymentStatus === "paid" ? "مدفوع" : r.paymentStatus === "cancelled" ? "ملغي" : "معلق",
  ]);

  const content = [
    `تقرير الإدارة المالية — ${period}`,
    "",
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  return content;
}
