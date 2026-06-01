import type { ReactNode } from "react";
import {
  BookOpen,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/atoms/Button";

type DashboardShellProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onExport?: () => void;
  onToggleSettings?: () => void;
  children: ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  actionLabel,
  onExport,
  onToggleSettings,
  children,
}: DashboardShellProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { courseId, quizId, questionId } = useParams();

  const activeSection = pathname.includes("/prompts")
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
  ];

  return (
    <div className="app-shell">
      <div className="app-layout">
        <aside className="app-sidebar">
          <Link to="/courses" className="sidebar-brand" aria-label="Go home">
            <span className="sidebar-logo">
              <img src="/favicon.svg" alt="Bewise" />
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

        <div className="app-main">
          <div className="page-frame section-stack">
            <header className="topbar">
              <div className="topbar-left">
                <span className="topbar-kicker">Bewise AI Workspace</span>
                <h1 className="hero-title">{title}</h1>
                <p className="hero-description">{subtitle}</p>
              </div>

              <div className="topbar-actions">
                {onToggleSettings ? (
                  <Button
                    variant="ghost"
                    icon={<Settings size={16} />}
                    onClick={onToggleSettings}
                  >
                    Settings
                  </Button>
                ) : null}
                {onExport ? (
                  <Button
                    variant="secondary"
                    icon={<FileSpreadsheet size={16} />}
                    onClick={onExport}
                  >
                    {actionLabel}
                  </Button>
                ) : null}
              </div>
            </header>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
