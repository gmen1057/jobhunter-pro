import React, { useState } from 'react';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon,
  KeyIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: UserIcon },
    { id: 'notifications', name: 'Уведомления', icon: BellIcon },
    { id: 'automation', name: 'Автоматизация', icon: CogIcon },
    { id: 'security', name: 'Безопасность', icon: KeyIcon },
  ];

  const [profileData, setProfileData] = useState({
    name: 'Алексей Соколов',
    email: 'user@example.com',
    phone: '+7 (999) 123-45-67',
    position: 'Python Developer',
    experience: 'between3And6',
    salary_from: 150000,
    salary_to: 250000
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_new_vacancies: true,
    email_responses: true,
    email_interviews: true,
    telegram_notifications: false,
    telegram_chat_id: ''
  });

  const [automationSettings, setAutomationSettings] = useState({
    auto_apply: false,
    auto_apply_message: 'Добрый день! Меня заинтересовала ваша вакансия. Прикладываю резюме для рассмотрения.',
    search_interval: 60,
    max_applications_per_day: 10
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Профиль сохранен');
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Настройки уведомлений сохранены');
  };

  const handleSaveAutomation = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Настройки автоматизации сохранены');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Желаемая должность
            </label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Зарплатные ожидания</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              От (₽)
            </label>
            <input
              type="number"
              value={profileData.salary_from}
              onChange={(e) => setProfileData({ ...profileData, salary_from: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              До (₽)
            </label>
            <input
              type="number"
              value={profileData.salary_to}
              onChange={(e) => setProfileData({ ...profileData, salary_to: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить профиль'}
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email уведомления</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Новые вакансии</h4>
              <p className="text-sm text-gray-600">Уведомления о новых подходящих вакансиях</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.email_new_vacancies}
              onChange={(e) => setNotificationSettings({ 
                ...notificationSettings, 
                email_new_vacancies: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Ответы на отклики</h4>
              <p className="text-sm text-gray-600">Уведомления об ответах работодателей</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.email_responses}
              onChange={(e) => setNotificationSettings({ 
                ...notificationSettings, 
                email_responses: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Приглашения на собеседования</h4>
              <p className="text-sm text-gray-600">Уведомления о приглашениях</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.email_interviews}
              onChange={(e) => setNotificationSettings({ 
                ...notificationSettings, 
                email_interviews: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Telegram уведомления</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Включить Telegram бота</h4>
              <p className="text-sm text-gray-600">Получать уведомления через Telegram</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.telegram_notifications}
              onChange={(e) => setNotificationSettings({ 
                ...notificationSettings, 
                telegram_notifications: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          {notificationSettings.telegram_notifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat ID
              </label>
              <input
                type="text"
                value={notificationSettings.telegram_chat_id}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  telegram_chat_id: e.target.value 
                })}
                placeholder="Получите у @userinfobot"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveNotifications}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить уведомления'}
        </button>
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Внимание!</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Автоматические отклики могут повлиять на вашу репутацию. Используйте с осторожностью.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Автоматические отклики</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Включить автоотклики</h4>
              <p className="text-sm text-gray-600">Автоматически откликаться на подходящие вакансии</p>
            </div>
            <input
              type="checkbox"
              checked={automationSettings.auto_apply}
              onChange={(e) => setAutomationSettings({ 
                ...automationSettings, 
                auto_apply: e.target.checked 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          {automationSettings.auto_apply && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сопроводительное сообщение
                </label>
                <textarea
                  value={automationSettings.auto_apply_message}
                  onChange={(e) => setAutomationSettings({ 
                    ...automationSettings, 
                    auto_apply_message: e.target.value 
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Интервал поиска (минуты)
                  </label>
                  <input
                    type="number"
                    value={automationSettings.search_interval}
                    onChange={(e) => setAutomationSettings({ 
                      ...automationSettings, 
                      search_interval: parseInt(e.target.value) 
                    })}
                    min="30"
                    max="1440"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимум откликов в день
                  </label>
                  <input
                    type="number"
                    value={automationSettings.max_applications_per_day}
                    onChange={(e) => setAutomationSettings({ 
                      ...automationSettings, 
                      max_applications_per_day: parseInt(e.target.value) 
                    })}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveAutomation}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить автоматизацию'}
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Подключенные аккаунты</h3>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">HH</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">HeadHunter</h4>
                <p className="text-sm text-gray-600">Подключен: user@example.com</p>
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

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Экспорт данных</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Экспорт истории откликов</h4>
            <p className="text-sm text-gray-600 mb-3">
              Скачать все данные о ваших откликах и взаимодействиях с работодателями
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Скачать данные
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-red-600">Опасная зона</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <TrashIcon className="h-6 w-6 text-red-600 mt-1" />
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-red-900">Удалить аккаунт</h4>
              <p className="text-sm text-red-700 mt-1">
                Это действие необратимо. Все ваши данные будут удалены безвозвратно.
              </p>
              <button className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Настройки</h1>
        <p className="text-gray-600">Управление профилем и параметрами системы</p>
      </div>

      {/* Вкладки */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'automation' && renderAutomationTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};