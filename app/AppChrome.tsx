"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/doctorDash");

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="lg:px-12 xl:px-24">{children}</div>
      <Footer />
    </>
  );
}
