import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-zinc-800 mb-1">{title}</h3>
    <p className="text-zinc-500 text-sm max-w-sm mb-6">{description}</p>
    {action}
  </div>
);
