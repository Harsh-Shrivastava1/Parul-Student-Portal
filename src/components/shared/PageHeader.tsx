import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-zinc-500 mb-2">
          {breadcrumbs.map((bc, i) => (
            <React.Fragment key={bc.label}>
              {i > 0 && <ChevronRight size={14} className="text-zinc-400" />}
              {bc.href ? (
                <Link to={bc.href} className="hover:text-blue-600 transition-colors">
                  {bc.label}
                </Link>
              ) : (
                <span className="text-zinc-700 font-medium">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
