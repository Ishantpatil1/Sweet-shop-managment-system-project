import React from 'react';

const colorClasses = {
  primary: 'bg-[#FFF3E0]',
  accent: 'bg-[#E8F5F0]',
  secondary: 'bg-[#F5F0E8]',
};

const colorIconClasses = {
  primary: 'text-[#F4A261]',
  accent: 'text-[#2A9D8F]',
  secondary: 'text-[#3A2E2A]',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#6B6B6B] text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-[#1F1F1F]">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.direction === 'up' ? 'text-[#2A9D8F]' : 'text-[#D84A4A]'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}% from last week
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <div className={`${colorIconClasses[color]} text-2xl`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
