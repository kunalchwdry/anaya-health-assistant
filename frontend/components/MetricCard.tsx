import { useEffect, useState } from 'react';
import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
  description?: string;
}

export const MetricCard = ({
  icon,
  title,
  value,
  trend = null,
  trendValue = '',
  description = '',
}: MetricCardProps) => {
  const trendClass =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  const valueClass = typeof value === 'number' ? 'text-2xl font-bold' : 'text-lg';

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className={trendClass} font-medium>
          {trendValue}
        </span>
      </div>
      <div className={valueClass}>{value}</div>
      <div className="text-left text-sm text-gray-500">{title}</div>
      {description ? <div className="text-sm text-gray-400">{description}</div> : null}
    </div>
  );
};

// Predefined icons for common metrics - using simple emoji placeholders
export const CallMetric = (props: Omit<MetricCardProps, 'icon'>) => (
  <MetricCard icon={<span className="text-blue-600">📞</span>} {...props} />
);

export const UserMetric = (props: Omit<MetricCardProps, 'icon'>) => (
  <MetricCard icon={<span className="text-green-600">👥</span>} {...props} />
);

export const EscalationMetric = (props: Omit<MetricCardProps, 'icon'>) => (
  <MetricCard icon={<span className="text-red-600">🆘</span>} {...props} />
);

export const DurationMetric = (props: Omit<MetricCardProps, 'icon'>) => (
  <MetricCard icon={<span className="text-purple-600">⏱️</span>} {...props} />
);
