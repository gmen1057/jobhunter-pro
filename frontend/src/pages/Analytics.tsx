import React from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export const Analytics: React.FC = () => {
  // Мок данные для демонстрации
  const mockStats = {
    averageSalary: 185000,
    salaryGrowth: 12.5,
    totalVacancies: 1247,
    competitiveSkills: [
      { skill: 'Python', demand: 89 },
      { skill: 'JavaScript', demand: 76 },
      { skill: 'React', demand: 68 },
      { skill: 'Docker', demand: 54 },
      { skill: 'AWS', demand: 42 }
    ],
    popularEmployers: [
      { name: 'Яндекс', vacancies: 45 },
      { name: 'Сбер', vacancies: 38 },
      { name: 'ВКонтакте', vacancies: 29 },
      { name: 'Ozon', vacancies: 25 },
      { name: 'Тинькофф', vacancies: 22 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Аналитика рынка труда</h1>
        <p className="text-gray-600">Статистика и тренды по вашей специальности</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Средняя зарплата</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockStats.averageSalary.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Рост за год</p>
              <p className="text-2xl font-semibold text-gray-900">+{mockStats.salaryGrowth}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего вакансий</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockStats.totalVacancies.toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Конкуренция</p>
              <p className="text-2xl font-semibold text-gray-900">Средняя</p>
            </div>
          </div>
        </div>
      </div>

      {/* Востребованные навыки */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Востребованные навыки</h2>
          <p className="text-sm text-gray-600 mt-1">Наиболее часто упоминаемые требования в вакансиях</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {mockStats.competitiveSkills.map((skill, index) => (
              <div key={skill.skill} className="flex items-center">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 mr-4">
                    {index + 1}. {skill.skill}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${skill.demand}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 ml-4">
                  {skill.demand}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Популярные работодатели */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Топ работодатели</h2>
            <p className="text-sm text-gray-600 mt-1">Компании с наибольшим количеством вакансий</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {mockStats.popularEmployers.map((employer, index) => (
                <div key={employer.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {employer.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {employer.vacancies} вакансий
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Рекомендации</h2>
            <p className="text-sm text-gray-600 mt-1">На основе анализа рынка</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  🎯 Развитие навыков
                </h3>
                <p className="text-sm text-blue-700">
                  Изучите Docker и AWS - эти технологии показывают высокий рост спроса
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">
                  💰 Зарплатные ожидания
                </h3>
                <p className="text-sm text-green-700">
                  Ваш профиль может претендовать на зарплату 150-220k ₽
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">
                  🏢 Целевые компании
                </h3>
                <p className="text-sm text-yellow-700">
                  Сосредоточьтесь на IT-компаниях и финтех стартапах
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-900 mb-2">
                  📈 Рыночные тренды
                </h3>
                <p className="text-sm text-purple-700">
                  Растет спрос на Python разработчиков с опытом в ML/AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* График динамики (заглушка) */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Динамика зарплат</h2>
          <p className="text-sm text-gray-600 mt-1">Изменение средней зарплаты по месяцам</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">График будет добавлен в следующем обновлении</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};