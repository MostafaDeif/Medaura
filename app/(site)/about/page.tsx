import Image from "next/image";

const values = [
  "رعاية موثوقة",
  "حجز أسرع",
  "أطباء معتمدون",
];

export default function AboutPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-white pb-16 pt-28">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-12 px-4 py-12 md:flex-row-reverse md:gap-14 lg:py-20">
        <div className="relative w-full flex-1 md:min-h-[420px]">
          <Image
            src="/images/aboutus.png"
            alt="فريق أطباء ميداورا"
            width={1290}
            height={872}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="w-full flex-1 text-center md:text-right">
          <p className="mb-3 text-[15px] font-bold text-[#001a6e]">
            ميداورا
          </p>
          <h1 className="text-[38px] font-extrabold leading-tight text-[#111827] sm:text-[48px]">
            من نحن
          </h1>
          <p className="mt-6 text-[18px] font-medium leading-9 text-[#111827]">
            في ميداورا نؤمن أن الوصول للرعاية الصحية يجب أن يكون بسيطا
            وسريعا. نربط المرضى بأفضل الأطباء والعيادات، ونساعدهم على اختيار
            التخصص المناسب وحجز الموعد بثقة، بدون تعقيد أو انتظار.
          </p>
          <p className="mt-4 text-[18px] font-medium leading-9 text-[#111827]">
            هدفنا أن تكون تجربة البحث والحجز أكثر وضوحا، من مقارنة التقييمات
            ورسوم الكشف وحتى تأكيد الموعد، مع الحفاظ على جودة الخدمة وراحة
            المريض في كل خطوة.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-[6px] border border-[#d9e3ff] bg-[#f7f9ff] px-4 py-2 text-sm font-bold text-[#001a6e]"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
