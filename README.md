# VARK — Questionário de Estilos de Aprendizagem

Aplicação web para aplicar o questionário VARK (Visual, Auditivo, Leitura/Escrita, Cinestésico) sem coleta de dados pessoais. Stack: **FastAPI** no backend (cálculo stateless) e **Vite + React 18 + Tailwind + React Router + Zustand + Zod + Recharts** no frontend.

## Funcionalidades

- Questionário VARK completo (16 questões, tradução PT-BR Nakamoto 2021 v8.01)
- Wizard de 4 blocos (sem etapa de dados pessoais)
- Cálculo server-side (seguro contra manipulação), sem persistência
- Resultado com gráfico de barras, perfil, e guia de estratégias personalizadas
- Privacidade por padrão: nenhum dado pessoal é solicitado, calculado ou armazenado

## Estrutura

```
vark-project/
├── vercel.json
├── README.md
├── backend/
│   ├── main.py
│   ├── pyproject.toml
│   ├── .env.example
│   ├── .python-version
│   ├── pytest.ini
│   ├── app/
│   │   ├── config.py
│   │   ├── data/vark_questions.json
│   │   ├── schemas/{questions,result,score}.py
│   │   ├── services/{scoring,learning_guide}.py
│   │   └── routers/{questions,score,health}.py
│   └── tests/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── router.jsx
        ├── lib/{api,utils}.js
        ├── schemas/quiz.js
        ├── store/quiz.js
        ├── hooks/useQuiz.js
        ├── components/
        │   ├── ui/{Button,Input,Card,RadioGroup,Checkbox,Progress,Alert}.jsx
        │   ├── layout/{AppShell,Header,Footer}.jsx
        │   ├── wizard/{WizardProgress,QuestionsStep,QuestionCard}.jsx
        │   └── result/{ProfileCard,ScoresChart,LearningGuide,ActionButtons}.jsx
        └── pages/{Home,Sobre,Quiz,ResultView,NotFound}Page.jsx
```

## API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/svc/api/status` | Health check com timestamp |
| `GET` | `/svc/api/healthz` | Liveness simples |
| `GET` | `/svc/api/questions` | Questionário canônico (16 questões + `mapVarkLetter`) |
| `POST` | `/svc/api/score` | Recebe 16 respostas e devolve o `ResultPayload` calculado (stateless) |

Documentação interativa: `GET /docs` (Swagger UI) e `GET /redoc`.

## Rodar localmente

Requisitos: **Python 3.12+**, **Node 18+**.

### Backend

```bash
cd backend
uv sync --extra dev
uv run uvicorn main:app --reload --port 8000
```

If you prefer `venv` + `pip`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn main:app --reload --port 8000
```

Endpoints disponíveis em <http://localhost:8000/svc/api/status>.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

App em <http://localhost:5173>. O Vite faz proxy de `/svc/api/*` para `http://localhost:8000` automaticamente (ver `vite.config.js`).

### Testes

Backend:

```bash
cd backend
uv run pytest
```

O `pytest.ini` falha o comando se a cobertura da API ficar abaixo de 80%.

## Variáveis de ambiente

### Backend (`backend/.env`)

```ini
APP_NAME=VARK Backend
APP_VERSION=0.1.0
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
QUESTIONS_FILE=./app/data/vark_questions.json
```

### Frontend (`frontend/.env.local`)

```ini
VITE_BACKEND_URL=/svc/api
VITE_APP_NAME=VARK
```

## Deploy (Vercel)

O `vercel.json` define dois Services:

- `/svc/api/*` → FastAPI backend
- `/(.*)` → frontend Vite/React

```bash
vercel --prod
```

## Algoritmo de scoring

Cada questão vale 1 ponto na modalidade que o usuário escolheu (radio button). A pontuação final é `ScoreBreakdown = {V, A, R, K}` (cada uma entre 0 e 16). O perfil é formado pelas modalidades empatadas na maior pontuação. Veja [`app/services/scoring.py`](backend/app/services/scoring.py) e o questionário canônico em [`app/data/vark_questions.json`](backend/app/data/vark_questions.json).

## Referências

- Fleming, N. D. — *VARK: a guide to learning styles* (vark-learn.com)
- Nakamoto, F. K. (2021) — Tradução e adaptação PT-BR, Centro Universitário São Camilo (versão 8.01)
