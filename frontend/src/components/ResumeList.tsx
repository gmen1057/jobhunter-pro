import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface Resume {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  age?: number;
  area?: {
    name: string;
  };
  salary?: {
    amount: number;
    currency: string;
  };
  total_experience?: {
    months: number;
  };
  updated_at: string;
  professional_roles?: Array<{
    id: string;
    name: string;
  }>;
}

export const ResumeList: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/resumes/mine');
      setResumes(response.data.items || []);
      setError(null);
    } catch (err: any) {
      setError('Не удалось загрузить резюме. Убедитесь, что вы авторизованы.');
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatExperience = (months?: number) => {
    if (!months) return 'Нет опыта';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} мес.`;
    if (remainingMonths === 0) return `${years} лет`;
    return `${years} лет ${remainingMonths} мес.`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">У вас пока нет резюме на HeadHunter</p>
        <a 
          href="https://hh.ru/applicant/resumes/new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Создать резюме на HH
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Мои резюме</h2>
      
      {resumes.map(resume => (
        <div 
          key={resume.id} 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedResume === resume.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedResume(resume.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{resume.title}</h3>
              <p className="text-gray-600">
                {resume.first_name} {resume.last_name} {resume.middle_name}
              </p>
              
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                {resume.age && <span>Возраст: {resume.age}</span>}
                {resume.area && <span>Город: {resume.area.name}</span>}
                {resume.total_experience && (
                  <span>Опыт: {formatExperience(resume.total_experience.months)}</span>
                )}
                {resume.salary && (
                  <span>
                    Зарплата: {resume.salary.amount.toLocaleString('ru-RU')} {resume.salary.currency}
                  </span>
                )}
              </div>

              {resume.professional_roles && resume.professional_roles.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Профессиональные роли:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {resume.professional_roles.map(role => (
                      <span 
                        key={role.id} 
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500 text-right">
              <p>Обновлено:</p>
              <p>{formatDate(resume.updated_at)}</p>
            </div>
          </div>
          
          {selectedResume === resume.id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Здесь можно добавить логику для поиска вакансий на основе резюме
                  console.log('Search vacancies for resume:', resume.id);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Искать вакансии по этому резюме
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};