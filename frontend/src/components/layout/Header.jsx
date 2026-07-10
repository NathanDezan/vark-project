import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/quiz", label: "Questionário" },
  { to: "/about", label: "Sobre" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-3">
        <Link to="/" className="flex items-center gap-2">
          <div>
            <p className="font-display text-lg font-bold uppercase leading-none tracking-wider text-indigo-600 sm:text-xl">
              Projeto VARK
            </p>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">Estilos de Aprendizagem</p>
          </div>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 sm:py-2 ${
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
