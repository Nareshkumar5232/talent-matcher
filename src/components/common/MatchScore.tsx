import { cn } from '@/lib/utils';

interface MatchScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScoreBadge({ score, showLabel = false, size = 'md' }: MatchScoreBadgeProps) {
  const getVariant = () => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  };

  const variant = getVariant();

  const variantClasses = {
    excellent: 'match-excellent',
    good: 'match-good',
    fair: 'match-fair',
    poor: 'match-poor',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md',
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {score}%
      {showLabel && <span className="ml-1 font-normal">({labels[variant]})</span>}
    </span>
  );
}

interface SkillProgressBarProps {
  label: string;
  value: number;
  showPercentage?: boolean;
}

export function SkillProgressBar({ label, value, showPercentage = true }: SkillProgressBarProps) {
  const getColor = () => {
    if (value >= 90) return 'bg-success';
    if (value >= 75) return 'bg-accent';
    if (value >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        {showPercentage && (
          <span className="text-muted-foreground">{value}%</span>
        )}
      </div>
      <div className="skill-progress">
        <div
          className={cn('skill-progress-bar', getColor())}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
