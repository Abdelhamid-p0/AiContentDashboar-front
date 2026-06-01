import { X } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";

type SettingsItem = {
  label: string;
  value: string;
};

type SettingsDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  items: SettingsItem[];
  onClose: () => void;
};

export function SettingsDialog({
  open,
  title = "Settings",
  description,
  items,
  onClose,
}: SettingsDialogProps) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {description ? <p className="modal-text">{description}</p> : null}

        <div className="settings-grid">
          {items.map((item) => (
            <div key={item.label} className="settings-row">
              <span className="settings-label">{item.label}</span>
              <div className="settings-value">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
