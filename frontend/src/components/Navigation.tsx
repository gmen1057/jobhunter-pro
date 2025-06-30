import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Поиск вакансий', href: '/search', icon: MagnifyingGlassIcon },
    { name: 'Резюме', href: '/resumes', icon: DocumentTextIcon },
    { name: 'Аналитика', href: '/analytics', icon: ChartBarIcon },
    { name: 'Настройки', href: '/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JH</span>
              </div>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">JobHunter Pro</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};