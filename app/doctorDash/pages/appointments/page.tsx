import TodayOverview from "./charts/TodayOverview/TodayOverview";
import CasesDonut from "./charts/CasesDonut/CasesDonut";
import WeeklyBarChart from "./charts/WeeklyBarChart/WeeklyBarChart";
import TodayProgress from "./charts/TodayProgress/TodayProgress";
import TodayAppointmentsTaple from "./charts/TodayAppointmentsTaple/TodayAppointmentsTaple";
export default function Dashboard() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="col-span-1">
          <TodayProgress />
        </div>

        {/* Right Column */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">

          <TodayOverview />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            <CasesDonut />

            <div className="md:col-span-2 lg:col-span-2">
              <WeeklyBarChart />
            </div>

          </div>

        </div>
      </div>
      <div className="">
        <TodayAppointmentsTaple />
      </div>
    </div>
  );
}