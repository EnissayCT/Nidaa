import clsx from 'clsx';

const urgencyStyles = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function BloodTypeBadge({ type, size = 'md', urgency }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-bold',
  };

  if (urgency) {
    return (
      <span className={clsx('inline-flex items-center rounded-lg border font-semibold', sizeClasses[size], urgencyStyles[urgency])}>
        {type}
      </span>
    );
  }

  return (
    <span className={clsx(
      'inline-flex items-center rounded-lg font-bold bg-red-50 text-red-700 border border-red-200',
      sizeClasses[size]
    )}>
      {type}
    </span>
  );
}
