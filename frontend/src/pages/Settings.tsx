import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  KeyIcon 
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: UserIcon },
    { id: 'notifications', name: 'Уведомления', icon: BellIcon },
    { id: 'automation', name: 'Автоматизация', icon: CogIcon },
    { id: 'security', name: 'Безопасность', icon: KeyIcon },
  ];

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+7 (999) 123-45-67',
    position: 'Python Developer',
    experience: 'between3And6',
    salary_from: 150000,
    salary_to: 250000
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_new_vacancies: true,
    email_responses: true,
    email_analytics: false,
    telegram_notifications: false,
    push_notifications: true
  });

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUserProfile();
        setUserProfile(response.data);
        
        // Обновляем данные профиля
        setProfileData(prev => ({
          ...prev,
          name: response.data.name || response.data.full_name || '',
          email: response.data.email || ''
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to default values if API fails
        setProfileData(prev => ({
          ...prev,
          name: 'Пользователь',
          email: 'Не указан'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика обновления профиля
    console.log('Updating profile:', profileData);
  };

  const handleNotificationUpdate = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Личная информация</h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Полное имя
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email берется из HeadHunter и не может быть изменен</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Сохранить изменения
          </button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Подключенные аккаунты</h3>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">HH</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">HeadHunter</h4>
                <p className="text-sm text-gray-600">
                  Подключен: {userProfile?.email || profileData.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Активен
              </span>
              <button className="text-sm text-red-600 hover:text-red-800">
                Отключить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h3>
        
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {key === 'email_new_vacancies' && 'Email о новых вакансиях'}
                  {key === 'email_responses' && 'Email об откликах'}
                  {key === 'email_analytics' && 'Email с аналитикой'}
                  {key === 'telegram_notifications' && 'Telegram уведомления'}
                  {key === 'push_notifications' && 'Push уведомления'}
                </h4>
              </div>
              <button
                onClick={() => handleNotificationUpdate(key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'automation' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Автоматизация</h3>
              <p className="text-gray-600">Настройки автоматизации будут добавлены позже.</p>
            </div>
          )}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Безопасность</h3>
              <p className="text-gray-600">Настройки безопасности будут добавлены позже.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};