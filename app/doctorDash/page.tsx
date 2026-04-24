"use client";

import StatsCard from "./components/ui/StatsCard";
import DashboardHeader from "./dashboardHeader/DashboardHeader";
import ChartBar from "./components/charts/ChartBar";
import AppointsmentRequests from "./features/appointments/AppointsmentRequests";
import VisitsGauge from "./components/charts/VisitsGauge";
import DoctorsList from "./features/doctors/doctorsList";
import ClinicsList from "./features/patient/PatientReport";
import DepartmentsChart from "./components/charts/DepartmentsChart";
import PatientsTable from "./features/patient/PatientTaple";
import AppointmentsTable from "./features/appointments/AppointmentsTable";

import React, { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  Users,
  Calendar,
  User,
  FileText,
  Activity,
  Wallet,
} from "lucide-react";

type DashboardApiData = {
  cards?: {
    appointments?: {
      value: number;
      percentage: number;
      trend: { value: number }[];
    };
    patients?: {
      value: number;
      percentage: number;
      trend: { value: number }[];
    };
  };
  weeklyPatients?: {
    date: string;
    exixiting: number;
    new: number;
  }[];
  genderStats?: {
    male: number;
    female: number;
    total: number;
  };
  appointmentRequests?: {
    id: number;
    name: string;
    specialty: string;
    time: string;
    image: string;
    status: "pending" | "approved" | "rejected";
  }[];
  appointments?: {
    id: string;
    name: string;
    type: string;
    doctor: string;
    status: string;
    date: string;
  }[];
  patients?: {
    name: string;
    gender: string;
    department: string;
    date: string;
  }[];
  reports?: {
    id: number;
    name: string;
    status: "available" | "busy";
    description?: string;
  }[];
  todayAppointments?: {
    id?: number;
    name: string;
    type: string;
    date: string;
    time: string;
  }[];
};

function Dashboard({ childern }: { childern: React.ReactNode }) {
  const [range, setRange] = useState<any>();
  const [dashboardData, setDashboardData] = useState<DashboardApiData | null>(null);

  const weeklyData = [
    { date: "2026-01-25", exixiting: 40, new: 20 },
    { date: "2026-01-26", exixiting: 50, new: 30 },
    { date: "2026-01-27", exixiting: 45, new: 25 },
    { date: "2026-01-28", exixiting: 60, new: 35 },
    { date: "2026-01-29", exixiting: 38, new: 22 },
    { date: "2026-01-30", exixiting: 55, new: 28 },
    { date: "2026-01-31", exixiting: 65, new: 32 },
  ];

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/doctor-dashboard", {
          credentials: "include",
        });
        const result = await response.json();

        if (active && response.ok && result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Failed to load doctor dashboard", error);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(
    () =>
      dashboardData?.weeklyPatients?.length
        ? dashboardData.weeklyPatients
        : weeklyData,
    [dashboardData]
  );

  const filteredData = chartData.filter((item) => {
    if (!range?.from || !range?.to) return true;
    const itemDate = new Date(item.date);
    return itemDate >= range.from && itemDate <= range.to;
  });

  const appointmentCard = dashboardData?.cards?.appointments;
  const patientCard = dashboardData?.cards?.patients;

  return (
    <div className="flex w-full">
      
      <div className="flex w-full flex-col bg-(--background) min-h-screen transition-colors duration-300">
        
        <div className="p-6">

          <DashboardHeader range={range} setRange={setRange} />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
            <StatsCard
              title="المواعيد"
              value={appointmentCard?.value ?? 659}
              percentage={appointmentCard?.percentage ?? -15}
              icon={<Calendar size={20} strokeWidth={2} className="text-white" />}
              iconBg="bg-[#E65100]"
              chartColor="#E65100"
              data={
                appointmentCard?.trend ?? [
                  { value: 15 },
                  { value: 18 },
                  { value: 12 },
                  { value: 20 },
                  { value: 16 },
                ]
              }
            />
            <StatsCard
              title="إجمالي المرضى"
              value={patientCard?.value ?? 108}
              percentage={patientCard?.percentage ?? 20}
              icon={<User size={20} strokeWidth={2} className="text-white" />}
              iconBg="bg-[#001A6E]"
              chartColor="#001A6E"
              data={
                patientCard?.trend ?? [
                  { value: 5 },
                  { value: 8 },
                  { value: 6 },
                  { value: 10 },
                  { value: 9 },
                ]
              }
            />
          </div>

          {/* Charts + Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            <div className="lg:col-span-1">
              <ChartBar data={filteredData} />
            </div>
            <AppointsmentRequests
              appointments={dashboardData?.appointmentRequests}
            />

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <VisitsGauge
              male={dashboardData?.genderStats?.male ?? 69}
              female={dashboardData?.genderStats?.female ?? 56}
              total={dashboardData?.genderStats?.total ?? 80}
            />
            <DoctorsList appointments={dashboardData?.todayAppointments} />
            <PatientsTable patients={dashboardData?.patients} />
          </div>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ClinicsList reports={dashboardData?.reports} />
          </div>
          {/* Appointments */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <AppointmentsTable appointments={dashboardData?.appointments} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
