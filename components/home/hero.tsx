// import Image from "next/image";

// export default function Hero() {
//   return (
//     <section
//       className="
//         relative w-full
//         min-h-[calc(95vh-80px)]
//         flex flex-col items-center justify-center
//         bg-cover bg-center
//       "
//       style={{ backgroundImage: "url('/image.png')" }}
//     >
//       {/* HERO CONTENT */}
//       <div className="relative w-full flex justify-center">
//         <div className="max-w-[600px] text-center text-text-dark -translate-x-[30%] md:translate-x-0">
//           <h1 className="text-[64px] md:text-[48px] font-extrabold mb-8">
//             علاجك فى رحلتك
//           </h1>

//           <div className="flex gap-6 mb-10 justify-center md:flex-col">
//             <a className="btn bg-primary text-white border border-primary">
//               احجز الآن
//             </a>
//             <a className="btn border border-border text-text-dark hover:border-primary hover:text-primary">
//               تصفح الأطباء
//             </a>
//           </div>

//           {/* STATS */}
//           <div className="flex gap-10 bg-white/80 p-5 rounded-2xl backdrop-blur md:flex-col md:gap-4">
//             <Stat num="10K+" label="عملاء سعداء" />
//             <Stat num="500+" label="المعالجون المرخصون" />
//             <Stat num="24/7" label="متوفر" />
//           </div>
//         </div>
//       </div>

//       {/* FLOATING CARDS */}
//       <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-5 z-10 md:hidden">
//         <FloatCard
//           title="لماذا تختارنا ؟"
//           items={[
//             "متخصصون مدربون",
//             "رعاية شخصية",
//             "خدمات علي مدار الساعة",
//             "أمان وراحة",
//           ]}
//         />

//         <FloatCard
//           title="ماذا نقدم ؟"
//           items={[
//             "العلاج الطبي",
//             "الرعاية اليومية",
//             "خدمات العلاج",
//             "المرافقة",
//           ]}
//         />
//       </div>

//       {/* SEARCH BAR */}
//       <div className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-full flex justify-center z-20">
//         <div className="w-[984px] h-[68px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-8 px-4 md:flex-col md:h-auto md:w-full md:gap-4">
//           <SearchItem text="اختر التخصص" />
//           <Divider />
//           <SearchItem text="اختر المحافظة" />
//           <Divider />
//           <SearchItem text="المستشفي" />
//           <Divider />
//           <SearchItem text="النوع" />

//           <button className="btn bg-primary text-white w-[143px] h-[44px] md:w-full">
//             <Image src="/Search.png" alt="" width={18} height={18} />
//             ابحث
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* COMPONENTS */

// function Stat({ num, label }: { num: string; label: string }) {
//   return (
//     <div className="flex flex-col items-center">
//       <span className="text-2xl font-bold">{num}</span>
//       <span className="text-sm text-text-gray">{label}</span>
//     </div>
//   );
// }

// function FloatCard({
//   title,
//   items,
// }: {
//   title: string;
//   items: string[];
// }) {
//   return (
//     <div className="w-[246px] p-4 rounded-[32px] bg-[#dee6fe] shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
//       <div className="bg-primary text-white py-3 px-6 rounded-2xl text-center font-bold mb-5">
//         {title}
//       </div>

//       <ul className="flex flex-col gap-3">
//         {items.map((item) => (
//           <li
//             key={item}
//             className="flex items-center gap-3 text-primary font-semibold"
//           >
//             <Image
//               src="/iconamoon_shield-yes-light.svg"
//               alt=""
//               width={18}
//               height={18}
//             />
//             {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function SearchItem({ text }: { text: string }) {
//   return (
//     <div className="flex items-center gap-2 text-primary font-semibold md:w-full">
//       {text}
//     </div>
//   );
// }

// function Divider() {
//   return <div className="w-px h-[30px] bg-border md:hidden" />;
// }
