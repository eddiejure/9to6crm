import React from 'react';
import { Clock, User, FileText, Receipt, FolderOpen } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ActivityItem {
  id: string;
  type: 'quote' | 'invoice' | 'project' | 'client';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const RecentActivity: React.FC = () => {
  // Mock data - replace with real data from Supabase
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'quote',
      title: 'Angebot AN-20250115-1234',
      description: 'Neues Angebot für Müller GmbH erstellt',
      timestamp: '2025-01-15T10:30:00Z',
      status: 'sent'
    },
    {
      id: '2',
      type: 'invoice',
      title: 'Rechnung RE-20250114-5678',
      description: 'Rechnung für Schmidt & Partner bezahlt',
      timestamp: '2025-01-14T15:45:00Z',
      status: 'paid'
    },
    {
      id: '3',
      type: 'project',
      title: 'Website Relaunch - TechStart',
      description: 'Projekt in Überprüfungsphase verschoben',
      timestamp: '2025-01-14T09:15:00Z',
      status: 'review'
    },
    {
      id: '4',
      type: 'client',
      title: 'Neuer Kunde',
      description: 'Digital Solutions AG hinzugefügt',
      timestamp: '2025-01-13T16:20:00Z'
    },
    {
      id: '5',
      type: 'project',
      title: 'E-Commerce Shop - Fashion Co',
      description: 'Projekt erfolgreich abgeschlossen',
      timestamp: '2025-01-13T14:00:00Z',
      status: 'completed'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return FileText;
      case 'invoice':
        return Receipt;
      case 'project':
        return FolderOpen;
      case 'client':
        return User;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sent':
        return 'text-blue-600 bg-blue-100';
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sent':
        return 'Versendet';
      case 'paid':
        return 'Bezahlt';
      case 'review':
        return 'Überprüfung';
      case 'completed':
        return 'Abgeschlossen';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Letzte Aktivitäten</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {activity.status && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusText(activity.status)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors duration-150">
          Alle Aktivitäten anzeigen
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;