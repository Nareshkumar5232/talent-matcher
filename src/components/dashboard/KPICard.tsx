import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'orange' | 'purple';
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon: Icon,
  variant = 'blue',
}: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const variantClasses = {
    blue: 'kpi-card-blue',
    green: 'kpi-card-green',
    orange: 'kpi-card-orange',
    purple: 'kpi-card-purple',
  };

  const iconBgClasses = {
    blue: 'bg-kpi-blue/10 text-kpi-blue',
    green: 'bg-kpi-green/10 text-kpi-green',
    orange: 'bg-kpi-orange/10 text-kpi-orange',
    purple: 'bg-kpi-purple/10 text-kpi-purple',
  };

  return (
    <div className={variantClasses[variant]}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {isPositive && (
                <>
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">+{change}%</span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">{change}%</span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="font-medium text-muted-foreground">0%</span>
              )}
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-3', iconBgClasses[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
