import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Обработка OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const error = urlParams.get('error');
    const status = urlParams.get('status');

    if (error) {
      console.error('Ошибка авторизации:', error);
      if (error === 'auth_failed') {
        alert('Ошибка авторизации. Попробуйте еще раз.');
      } else if (error === 'no_code') {
        alert('Не получен код авторизации от HeadHunter');
      } else if (error === 'access_denied') {
        alert('Вы отклонили запрос на авторизацию');
      }
      navigate('/');
      return;
    }

    if (accessToken) {
      // Сохраняем токен
      localStorage.setItem('auth_token', accessToken);
      
      // Показываем статус
      if (status === 'new_user') {
        console.log('Добро пожаловать\! Новый пользователь создан.');
      } else if (status === 'logged_in') {
        console.log('С возвращением\!');
      }
      
      // Перенаправляем на главную
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Обработка авторизации...
        </h2>
        <p className="text-gray-600">
          Пожалуйста, подождите
        </p>
      </div>
    </div>
  );
}
