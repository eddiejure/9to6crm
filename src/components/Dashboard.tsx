import React from 'react';
import Header from './layout/Header';
import DashboardStats from './dashboard/DashboardStats';
import RecentActivity from './dashboard/RecentActivity';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Dashboard" subtitle="Willkommen zurück! Hier ist eine Übersicht Ihrer aktuellen Projekte und Finanzen." />
      
      <div className="p-6">
        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Info & Upcoming */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Anstehende Termine
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Angebot Müller GmbH</p>
                      <p className="text-xs text-gray-600">Gültig bis {formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Projekt TechStart</p>
                      <p className="text-xs text-gray-600">Abgabe am {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Kundentermin Digital Solutions</p>
                      <p className="text-xs text-gray-600">Morgen um 14:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Finanzübersicht
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Offene Rechnungen</span>
                    <span className="font-medium text-red-600">{formatCurrency(3250)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Erwartete Zahlungen</span>
                    <span className="font-medium text-green-600">{formatCurrency(8900)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Laufende Projekte</span>
                    <span className="font-medium text-blue-600">{formatCurrency(15600)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Prognostizierter Monatsumsatz</span>
                      <span className="font-bold text-gray-900">{formatCurrency(18750)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Wichtige Hinweise
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">2 Angebote laufen ab</p>
                      <p className="text-xs text-yellow-600">In den nächsten 7 Tagen</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">1 Rechnung überfällig</p>
                      <p className="text-xs text-red-600">Schmidt & Partner - {formatCurrency(1200)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;