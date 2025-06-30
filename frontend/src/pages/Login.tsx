import React, { useState } from 'react';
import { apiService } from '../services/api';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHHAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.post('/auth/hh');
      window.location.href = response.data.auth_url;
    } catch (err) {
      setError('Ошибка авторизации. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Проверяем, есть ли токен или ошибка в URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const error = urlParams.get('error');
    
    if (userId) {
      // Сохраняем токен и перенаправляем
      localStorage.setItem('user_id', userId);
      // Очищаем URL от параметров
      window.history.replaceState({}, document.title, window.location.pathname);
      onLogin();
    } else if (error) {
      setError('Ошибка авторизации. Попробуйте еще раз.');
      // Очищаем URL от параметров
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">JH</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            JobHunter Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Автоматизированный поиск работы
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <button
            onClick={handleHHAuth}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Авторизация...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.68 16.32c-.68.68-1.5 1.02-2.46 1.02-.96 0-1.78-.34-2.46-1.02L12 15.56l-.76.76c-.68.68-1.5 1.02-2.46 1.02-.96 0-1.78-.34-2.46-1.02-.68-.68-1.02-1.5-1.02-2.46 0-.96.34-1.78 1.02-2.46L12 5.68l5.68 5.68c.68.68 1.02 1.5 1.02 2.46 0 .96-.34 1.78-1.02 2.46z"/>
                </svg>
                Войти через HeadHunter
              </>
            )}
          </button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Для работы с системой необходима авторизация через HeadHunter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};