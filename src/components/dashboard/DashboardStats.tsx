import React from 'react';
import { TrendingUp, TrendingDown, Users, FolderOpen, FileText, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change && change > 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  // Mock data - replace with real data from Supabase
  const stats = [
    {
      title: 'Monatsumsatz',
      value: formatCurrency(12450),
      change: 12.5,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Aktive Projekte',
      value: 8,
      change: 25,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Kunden',
      value: 24,
      change: 8.3,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Offene Angebote',
      value: 5,
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'Unbezahlte Rechnungen',
      value: formatCurrency(3250),
      change: -5.2,
      icon: Receipt,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;