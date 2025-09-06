import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import QuoteBuilder from './components/quotes/QuoteBuilder';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'quotes':
        return (
          <div className="flex-1 bg-gray-50">
            <QuoteBuilder />
          </div>
        );
      case 'clients':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kundenverwaltung</h2>
              <p className="text-gray-600">Hier werden alle Kundendaten verwaltet.</p>
              <p className="text-sm text-gray-500 mt-2">Wird in der nächsten Version implementiert.</p>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Projektverwaltung</h2>
              <p className="text-gray-600">Hier werden alle Projekte verwaltet.</p>
              <p className="text-sm text-gray-500 mt-2">Wird in der nächsten Version implementiert.</p>
            </div>
          </div>
        );
      case 'invoices':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rechnungsverwaltung</h2>
              <p className="text-gray-600">Hier werden alle Rechnungen verwaltet.</p>
              <p className="text-sm text-gray-500 mt-2">Wird in der nächsten Version implementiert.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Einstellungen</h2>
              <p className="text-gray-600">Hier können Sie die Anwendung konfigurieren.</p>
              <p className="text-sm text-gray-500 mt-2">Wird in der nächsten Version implementiert.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      {renderContent()}
    </div>
  );
}

export default App;