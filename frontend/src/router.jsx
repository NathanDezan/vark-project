import { createBrowserRouter } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultView from "./pages/ResultView.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "resultado", element: <ResultView /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
