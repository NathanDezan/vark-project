export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/60 bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs">
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
          <p className="text-xs">Construído com React, Vite, FastAPI e ❤️</p>
        </div>
      </div>
    </footer>
  );
}
