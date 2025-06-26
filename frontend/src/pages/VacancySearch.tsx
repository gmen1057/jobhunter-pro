import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface SearchFilters {
  text: string;
  area: number | null;
  salary_from: number | null;
  experience: string;
  employment: string;
}

interface Vacancy {
  id: string;
  name: string;
  employer_name: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  area_name: string;
  published_at: string;
  url: string;
}

export const VacancySearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    text: '',
    area: null,
    salary_from: null,
    experience: '',
    employment: ''
  });
  
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const experienceOptions = [
    { value: '', label: 'Любой опыт' },
    { value: 'noExperience', label: 'Нет опыта' },
    { value: 'between1And3', label: '1-3 года' },
    { value: 'between3And6', label: '3-6 лет' },
    { value: 'moreThan6', label: 'Более 6 лет' }
  ];

  const employmentOptions = [
    { value: '', label: 'Любой тип' },
    { value: 'full', label: 'Полная занятость' },
    { value: 'part', label: 'Частичная занятость' },
    { value: 'project', label: 'Проектная работа' },
    { value: 'volunteer', label: 'Волонтерство' },
    { value: 'probation', label: 'Стажировка' }
  ];

  useEffect(() => {
    if (filters.text) {
      handleSearch();
    }
  }, [currentPage]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchParams = {
        text: filters.text || undefined,
        area: filters.area || undefined,
        salary_from: filters.salary_from || undefined,
        page: currentPage
      };

      const response = await apiService.searchVacancies(searchParams);
      setVacancies(response.data.items || []);
      setTotalFound(response.data.found || 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    handleSearch();
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

  const handleApply = async (vacancyId: string) => {
    try {
      // TODO: Показать диалог выбора резюме
      alert(`Отклик на вакансию ${vacancyId} будет отправлен`);
    } catch (error) {
      console.error('Apply error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Поиск вакансий</h1>
        <p className="text-gray-600">Найдите подходящие вакансии на HeadHunter</p>
      </div>

      {/* Форма поиска */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ключевые слова
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.text}
                  onChange={(e) => setFilters({ ...filters, text: e.target.value })}
                  placeholder="Например: Python developer"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Фильтры
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зарплата от
                </label>
                <input
                  type="number"
                  value={filters.salary_from || ''}
                  onChange={(e) => setFilters({ ...filters, salary_from: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опыт работы
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип занятости
                </label>
                <select
                  value={filters.employment}
                  onChange={(e) => setFilters({ ...filters, employment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {employmentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Результаты поиска */}
      {vacancies.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Найдено {totalFound} вакансий
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <a 
                        href={vacancy.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        {vacancy.name}
                      </a>
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {vacancy.employer_name} • {vacancy.area_name}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium text-green-600">
                        {formatSalary(vacancy.salary_from, vacancy.salary_to, vacancy.currency)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{new Date(vacancy.published_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <a
                      href={vacancy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      Подробнее
                    </a>
                    <button
                      onClick={() => handleApply(vacancy.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Откликнуться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalFound > 20 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Предыдущая
              </button>
              
              <span className="text-sm text-gray-700">
                Страница {currentPage + 1}
              </span>
              
              <button
                disabled={(currentPage + 1) * 20 >= totalFound}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Следующая
              </button>
            </div>
          )}
        </div>
      )}

      {/* Состояние загрузки */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Поиск вакансий...</p>
        </div>
      )}

      {/* Пустое состояние */}
      {!isLoading && vacancies.length === 0 && filters.text && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Вакансии не найдены</h3>
          <p className="text-gray-600">Измените параметры поиска и попробуйте еще раз</p>
        </div>
      )}
    </div>
  );
};