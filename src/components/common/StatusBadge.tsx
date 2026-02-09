import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'active' | 'closed' | 'draft';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    new: {
      label: 'New',
      className: 'bg-accent/10 text-accent',
    },
    reviewed: {
      label: 'Reviewed',
      className: 'bg-warning/10 text-warning',
    },
    shortlisted: {
      label: 'Shortlisted',
      className: 'bg-success/10 text-success',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-destructive/10 text-destructive',
    },
    active: {
      label: 'Active',
      className: 'bg-success/10 text-success',
    },
    closed: {
      label: 'Closed',
      className: 'bg-muted text-muted-foreground',
    },
    draft: {
      label: 'Draft',
      className: 'bg-warning/10 text-warning',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
