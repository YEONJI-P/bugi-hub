import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, badge, actions }: PageHeaderProps) {
  return (
    <header className={`page-header${actions ? " page-header-with-actions" : ""}`}>
      <div className="page-header-title">
        <div className="page-header-meta">
          <span className="eyebrow">{eyebrow}</span>
          {badge}
        </div>
        <h1>{title}</h1>
      </div>
      <div className="page-header-content">
        <p className="page-header-description">{description}</p>
        {actions}
      </div>
    </header>
  );
}
