"use client";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  status: "available" | "busy";
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "available",
  },
  {
    id: 2,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "available",
  },
  {
    id: 3,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "available",
  },
  {
    id: 4,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "busy",
  },
  {
    id: 5,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "busy",
  },
  {
    id: 6,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "busy",
  },
  {
    id: 7,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "busy",
  },
  {
    id: 8,
    name: "محمد خالد",
    specialty: "مخ واعصاب",
    image: "https://i.pravatar.cc/40?img=1",
    status: "busy",
  },
];

export default function doctorsList() {
  return (
    <div className=" bg-(--card-bg) border border-(--card-border) h-max rounded-xl shadow-sm">

      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-(--card-border) mb-6 p-6">
        
        <button className="w-full sm:w-auto border-2 border-(--card-border) px-3 py-2 rounded-[5px] text-sm text-(--text-primary) font-normal cursor-pointer hover:text-white hover:bg-[#1F2B6C] transition-colors duration-500">
          عرض الكل
        </button>

        <h1 className="text-2xl font-bold text-(--text-primary)">
          الأطباء
        </h1>
      </div>

      {/* Doctors */}
      <div className="space-y-4 sm:space-y-2.5 px-4 sm:px-6 py-2 pb-6">
        {doctors.slice(0, 7).map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center justify-between p-3 sm:p-4 bg-(--semi-card-bg) rounded-lg hover:bg-(--hover-bg) transition-colors"
          >
            
            {/* Doctor Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              
              <img
                src={doctor.image}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                alt={doctor.name}
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-(--text-primary) text-sm sm:text-base truncate">
                  {doctor.name}
                </p>

                <p className="text-xs sm:text-sm text-(--text-secondary) truncate">
                  {doctor.specialty}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                doctor.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {doctor.status === "available" ? "متاح" : "غير متاح"}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}