import Image from "next/image";

type DoctorCardProps = {
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
};

export default function DoctorCard({
  name,
  specialty,
  rating,
  price,
  experience,
}: DoctorCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
      {/* Image */}
      <div className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-sm overflow-hidden">
        <Image
          src="/images/DOC.png"
          alt="صورة الطبيب"
          width={112}
          height={112}
          className="object-cover"
          priority
        />
      </div>

      {/* Name */}
      <h4 className="font-semibold text-[#001A6E]">{name}</h4>

      {/* Specialty */}
      <p className="text-sm text-gray-500 mb-2">استشاري {specialty}</p>

      {/* Rating */}
      <div className="flex justify-center items-center gap-1 text-sm mb-4">
        <span className="text-yellow-400">★</span>
        <span>{rating}</span>
      </div>

      {/* Info */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div>
          <p className="font-medium">سعر الجلسة</p>
          <p>{price} ج.م</p>
        </div>

        <div>
          <p className="font-medium">الخبرة</p>
          <p>{experience} سنوات</p>
        </div>
      </div>

      {/* Button */}
      <button className="w-full border border-[#001A6E] text-[#001A6E] py-2 rounded-lg hover:bg-[#001A6E] hover:text-white transition">
        احجز الآن
      </button>
    </div>
  );
}
