import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function AppShell() {
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-soft focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Pular para o conteúdo principal
      </a>
      <Header />
      <div id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
