import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/quiz", label: "Questionário" },
  { to: "/sobre", label: "Sobre" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div>
            <p className="font-display text-xl font-bold uppercase leading-none tracking-wider text-indigo-600">Projeto VARK</p>
            <p className="text-xs font-medium text-slate-500">Estilos de Aprendizagem</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
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
