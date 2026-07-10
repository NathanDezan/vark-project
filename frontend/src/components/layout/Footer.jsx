export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] items-start gap-4 text-[11px] leading-tight text-slate-500 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <div className="min-w-0">
            <p>
              Projeto criado por{" "}
              <a
                href="https://nathandezan.github.io/src/templates/pt-br/home.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit underline hover:underline"
              >
                Nathan Dezan
              </a>{" "}
              para estudo e publicação do artigo{" "}
              <a
                href="https://ojs.revistacontemporanea.com/ojs/index.php/home/article/view/1624"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit underline hover:underline"
              >
                DOI: 10.56083/RCV3N12-186
              </a>
              .
            </p>
          </div>
          <p className="justify-self-end text-right">Construído com React, Vite, FastAPI e ❤️</p>
        </div>
      </div>
    </footer>
  );
}
