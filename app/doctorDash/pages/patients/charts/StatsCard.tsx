import {TrendingUp, TrendingDown} from "lucide-react";
type Props = {
  title: string;
  value: number;
  change: number;
};

export default function StatCard({ title, value, change }: Props) {
  const isPositive = change >= 0;

  return (
    <div className="bg-(--card-bg) rounded-xl border border-(--card-border) px-4 py-3 w-full  flex flex-col items-end gap-2 hover:-translate-y-1  hover:shadow-[0_2px_10px_var(--status-hover)] duration-400 transition-all ease-in-out">

      {/* title */}
      <p className="text-xl text-(--text-secondary)">{title}</p>

        {/* number */}
        <h2 className="text-2xl font-bold text-(--text-primary)">
          {value.toLocaleString()}
        </h2>

        {/* change */}
        <div
          className={`flex items-center  gap-1 text-xl ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          <span>{isPositive ? "+" : ""}{change}%</span>
          <span className="">
            {isPositive ? <TrendingUp size={17} /> : <TrendingDown size={17} />}
          </span>
        </div>

      
    </div>
  );
}