import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QuestionCorrectionChatView } from "../components";
import { useQuestionCorrectionChat } from "../hooks/useQuestionCorrectionChat";
import type { CorrectionChatLocationState } from "../model/question-correction-chat.types";

export function QuestionCorrectionChatPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const state = location.state as CorrectionChatLocationState | null;

  const courseId = params.courseId ?? state?.courseId ?? "";
  const quizId = params.quizId ?? state?.quizId ?? "";
  const questionId = params.questionId ?? "";
  const courseTitle = state?.courseTitle ?? "Course";
  const quizTitle = state?.quizTitle ?? "Question correction";

  const {
    originalQuestion,
    correctionResponse,
    loading,
    sending,
    error,
    messages,
    sendMessage,
    feedbackRating,
    feedbackComment,
    feedbackSending,
    feedbackSubmitted,
    feedbackError,
    setFeedbackRating,
    setFeedbackComment,
    submitFeedback,
  } = useQuestionCorrectionChat(questionId, {
    originalQuestion: state?.originalQuestion ?? null,
    correction: state?.correction ?? null,
  });

  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    const sent = await sendMessage(message);
    if (sent) {
      setMessage("");
    }
  };

  const handleBack = () => {
    navigate(`/courses/${courseId}/quizzes/${quizId}/questions`, {
      state: { courseId, courseTitle, quizTitle },
    });
  };

  const sendDisabled =
    sending || !message.trim() || !correctionResponse || loading || !questionId;

  return (
    <QuestionCorrectionChatView
      title="Personnaliser la correction"
      subtitle={`${courseTitle} / ${quizTitle}`}
      questionId={questionId}
      originalQuestion={originalQuestion}
      correctedQuestion={correctionResponse?.improved_question ?? null}
      corrections={correctionResponse?.corrections ?? null}
      explanation={correctionResponse?.explanation ?? null}
      detectedErrors={correctionResponse?.detected_errors ?? null}
      ragContext={correctionResponse?.rag_context ?? null}
      correctionResponse={correctionResponse}
      loading={loading}
      error={error}
      messages={messages}
      messageValue={message}
      sending={sending}
      sendDisabled={sendDisabled}
      onMessageChange={setMessage}
      onSendMessage={handleSend}
      feedbackRating={feedbackRating}
      feedbackComment={feedbackComment}
      feedbackSending={feedbackSending}
      feedbackSubmitted={feedbackSubmitted}
      feedbackError={feedbackError}
      onFeedbackRatingChange={setFeedbackRating}
      onFeedbackCommentChange={setFeedbackComment}
      onSubmitFeedback={submitFeedback}
      onBack={handleBack}
    />
  );
}
