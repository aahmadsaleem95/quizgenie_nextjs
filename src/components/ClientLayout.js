"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { Footer } from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="App">
      <Header />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
