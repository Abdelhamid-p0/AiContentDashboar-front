import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AiFloatingButton } from "./shared/components/molecules/AiFloatingButton";

const CoursesPage = lazy(() =>
  import("./features/courses/pages/CoursesPage").then((module) => ({
    default: module.CoursesPage,
  })),
);

const CourseQuizzesPage = lazy(() =>
  import("./features/quizzes/pages/CourseQuizzesPage").then((module) => ({
    default: module.CourseQuizzesPage,
  })),
);

const QuizQuestionsPage = lazy(() =>
  import("./features/questions/pages/QuizQuestionsPage").then((module) => ({
    default: module.QuizQuestionsPage,
  })),
);

const QuestionCorrectionChatPage = lazy(() =>
  import("./features/questions/pages/QuestionCorrectionChatPage").then(
    (module) => ({
      default: module.QuestionCorrectionChatPage,
    }),
  ),
);

const PromptSettingsPage = lazy(() =>
  import("./features/prompts/pages/PromptSettingsPage").then((module) => ({
    default: module.PromptSettingsPage,
  })),
);

const AssistantPage = lazy(() =>
  import("./features/assistant/pages/AssistantPage").then((module) => ({
    default: module.AssistantPage,
  })),
);

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div className="loading-state">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/courses/:courseId/quizzes"
            element={<CourseQuizzesPage />}
          />
          <Route
            path="/courses/:courseId/quizzes/:quizId/questions"
            element={<QuizQuestionsPage />}
          />
          <Route
            path="/courses/:courseId/quizzes/:quizId/questions/:questionId/chat"
            element={<QuestionCorrectionChatPage />}
          />
          <Route path="/prompts" element={<PromptSettingsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </Suspense>
      <AiFloatingButton />
    </BrowserRouter>
  );
}

export default App;
