import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon: Icon, color = "text-blue-500" }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-800 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;