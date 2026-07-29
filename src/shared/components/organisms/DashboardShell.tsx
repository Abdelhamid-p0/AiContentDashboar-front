import type { ReactNode } from "react";

import logo from "@/../public/favicon.svg";

import {
  BookOpen,
  Bot,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Plus,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";

type DashboardShellProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onExport?: () => void;
  onToggleSettings?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionDisabled?: boolean;
  variant?: "default" | "chat";
  hideHeader?: boolean;
  children: ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  actionLabel,
  onExport,
  onToggleSettings,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled,
  variant = "default",
  hideHeader = false,
  children,
}: DashboardShellProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { courseId, quizId, questionId } = useParams();

  const activeSection = pathname.includes("/assistant")
    ? "assistant"
    : pathname.includes("/prompts")
      ? "prompts"
      : pathname.includes("/chat")
        ? "chat"
        : pathname.includes("/questions")
          ? "questions"
          : pathname.includes("/quizzes")
            ? "quizzes"
            : "courses";

  const navItems = [
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      to: "/courses",
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: Layers,
      to: courseId ? `/courses/${courseId}/quizzes` : undefined,
    },
    {
      id: "questions",
      label: "Questions",
      icon: HelpCircle,
      to:
        courseId && quizId
          ? `/courses/${courseId}/quizzes/${quizId}/questions`
          : undefined,
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: Sparkles,
      to:
        courseId && quizId && questionId
          ? `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/chat`
          : undefined,
    },
    {
      id: "prompts",
      label: "Prompts",
      icon: SlidersHorizontal,
      to: "/prompts",
    },
    {
      id: "assistant",
      label: "Assistant",
      icon: Bot,
      to: "/assistant",
    },
  ];

  const shellClass =
    variant === "chat" ? "app-shell app-shell-chat" : "app-shell";
  const cardClass =
    variant === "chat" ? "page-card page-card-chat" : "page-card";
  const pageFrameClass =
    variant === "chat" ? "page-frame page-frame-chat" : "page-frame";

  return (
    <div className={shellClass}>
      <div className="app-layout">
        <aside className="app-sidebar">
          <Link to="/courses" className="sidebar-brand" aria-label="Go home">
            <span className="sidebar-logo">
              <img src={logo} alt="Bewise" />
            </span>
            <div className="sidebar-copy">
              <span className="sidebar-title">Bewise</span>
              <span className="sidebar-subtitle">AI Dashboard</span>
            </div>
          </Link>

          <nav className="sidebar-nav" aria-label="Primary">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className="sidebar-link"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  disabled={!item.to}
                  onClick={() => {
                    if (item.to) {
                      navigate(item.to);
                    }
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-pill">
              <span className="sidebar-dot" />
              AI assistant ready
            </div>
            <p className="sidebar-hint">Monitoring learning quality</p>
          </div>
        </aside>

        <div className="app-frame">
          <div className="app-main">
            <div className={pageFrameClass}>
              <div className={cardClass}>
                {!hideHeader ? (
                  <header className="page-header">
                    <div>
                      <h1 className="page-title">{title}</h1>
                      <p className="page-subtitle">{subtitle}</p>
                    </div>

                    <div className="page-actions">
                      {onExport ? (
                        <Button
                          variant="ghost"
                          icon={<FileSpreadsheet size={16} />}
                          onClick={onExport}
                        >
                          {actionLabel}
                        </Button>
                      ) : null}
                      {onToggleSettings ? (
                        <IconButton
                          icon={<Settings size={16} />}
                          label="Open settings"
                          onClick={onToggleSettings}
                        />
                      ) : null}
                      {primaryActionLabel ? (
                        <Button
                          variant="primary"
                          icon={<Plus size={16} />}
                          onClick={onPrimaryAction}
                          disabled={primaryActionDisabled || !onPrimaryAction}
                        >
                          {primaryActionLabel}
                        </Button>
                      ) : null}
                    </div>
                  </header>
                ) : null}

                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
