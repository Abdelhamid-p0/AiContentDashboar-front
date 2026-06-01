import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CoursesPage } from "./features/courses/pages/CoursesPage";
import { CourseQuizzesPage } from "./features/quizzes/pages/CourseQuizzesPage";
import { QuizQuestionsPage } from "./features/questions/pages/QuizQuestionsPage";
import { QuestionCorrectionChatPage } from "./features/questions/pages/QuestionCorrectionChatPage";
import { PromptSettingsPage } from "./features/prompts/pages/PromptSettingsPage";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
