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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{isPositive ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-7 h-7 text-white" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;