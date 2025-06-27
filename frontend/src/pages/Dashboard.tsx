import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface Stats {
  total_applications: number;
  responses: number;
  interviews: number;
  active_searches: number;
}

interface RecentVacancy {
  id: string;
  name: string;
  employer_name: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  published_at: string;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total_applications: 0,
    responses: 0,
    interviews: 0,
    active_searches: 0
  });
  const [recentVacancies, setRecentVacancies] = useState<RecentVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Загружаем статистику и последние вакансии
      const [vacanciesResponse] = await Promise.all([
        apiService.searchVacancies({ page: 0 })
      ]);
      
      // Мок данные для статистики
      setStats({
        total_applications: 45,
        responses: 12,
        interviews: 3,
        active_searches: 5
      });
      
      setRecentVacancies(vacanciesResponse.data.items || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (from?: number, to?: number, currency?: string) => {
    if (!from && !to) return 'Не указана';
    const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const curr = currency === 'RUR' ? '₽' : currency;
    
    if (from && to) {
      return `${formatNumber(from)} - ${formatNumber(to)} ${curr}`;
    }
    if (from) {
      return `от ${formatNumber(from)} ${curr}`;
    }
    return `до ${formatNumber(to!)} ${curr}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Добро пожаловать в JobHunter Pro
        </h1>
        <p className="text-gray-600">
          Система автоматического поиска работы и анализа рынка труда
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего откликов</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_applications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ответы</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.responses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Собеседования</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.interviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Активные поиски</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active_searches}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Последние вакансии */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Последние вакансии</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentVacancies.length > 0 ? (
            recentVacancies.map((vacancy) => (
              <div key={vacancy.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {vacancy.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {vacancy.employer_name}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatSalary(vacancy.salary_from, vacancy.salary_to, vacancy.currency)}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(vacancy.published_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                      Подробнее
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Откликнуться
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Нет доступных вакансий</p>
              <p className="text-sm mt-1">Настройте поиск в разделе "Поиск вакансий"</p>
            </div>
          )}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left">
            <h3 className="font-medium text-gray-900 mb-1">Настроить поиск</h3>
            <p className="text-sm text-gray-600">Создать новый автоматический поиск вакансий</p>
          </button>
          
          <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left">
            <h3 className="font-medium text-gray-900 mb-1">Просмотреть отклики</h3>
            <p className="text-sm text-gray-600">Проверить статус поданных заявок</p>
          </button>
          
          <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left">
            <h3 className="font-medium text-gray-900 mb-1">Аналитика рынка</h3>
            <p className="text-sm text-gray-600">Изучить тренды и зарплаты</p>
          </button>
        </div>
      </div>
    </div>
  );
};