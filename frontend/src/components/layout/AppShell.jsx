import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function AppShell() {
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
