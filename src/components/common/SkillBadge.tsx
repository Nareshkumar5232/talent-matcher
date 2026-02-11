import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'matched' | 'missing' | 'required';
}

export function SkillBadge({ skill, variant = 'default' }: SkillBadgeProps) {
  const variantClasses = {
    default: '',
    required: 'skill-tag-required',
    matched: 'skill-tag-matched',
    missing: 'skill-tag-missing',
  };

  return (
    <span className={cn('skill-tag', variantClasses[variant])}>
      {skill}
    </span>
  );
}

interface SkillListProps {
  skills: string[];
  variant?: 'default' | 'matched' | 'missing' | 'required';
  maxVisible?: number;
}

export function SkillList({ skills, variant = 'default', maxVisible }: SkillListProps) {
  const visibleSkills = maxVisible ? skills.slice(0, maxVisible) : skills;
  const remaining = maxVisible ? skills.length - maxVisible : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleSkills.map((skill) => (
        <SkillBadge key={skill} skill={skill} variant={variant} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
