import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  FolderOpen, 
  FileText, 
  Receipt, 
  Settings,
  PlusCircle,
  LogOut,
  Crown
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { signOut, profile } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Kunden' },
    { id: 'projects', icon: FolderOpen, label: 'Projekte' },
    { id: 'quotes', icon: FileText, label: 'Angebote' },
    { id: 'invoices', icon: Receipt, label: 'Rechnungen' },
    { id: 'settings', icon: Settings, label: 'Einstellungen' }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-blue-400">9to6</h1>
          {profile?.role === 'superadmin' && (
            <Crown className="w-5 h-5 text-yellow-400" />
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">Project Management</p>
        {profile && (
          <div className="mt-2">
            <p className="text-xs text-slate-400">{profile.full_name || profile.email}</p>
            {profile.role === 'superadmin' && (
              <span className="inline-block px-2 py-1 text-xs bg-yellow-600 text-yellow-100 rounded-full mt-1">
                Super Admin
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700">
        <button className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          <PlusCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Neues Angebot</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors mb-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Abmelden</span>
        </button>
        <div className="text-xs text-slate-400">
          <p>© 2025 9to6</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;