import { useEffect, useState } from 'react';
import clsx from 'clsx';
import React from 'react';

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
  const trendClass = trend === 'up' 
    ? 'text-green-600' 
    : trend === 'down' 
      ? 'text-red-600' 
      : 'text-gray-500';

  const valueClass = typeof value === 'number' ? 'text-2xl font-bold' : 'text-lg';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className={trendClass} font-medium>{trendValue}</span>
      </div>
      <div className={valueClass}>{value}</div>
      <div className="text-sm text-gray-500 text-left">{title}</div>
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