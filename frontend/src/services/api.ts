import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jhunterpro.ru/api';

class ApiService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Добавляем токен авторизации к каждому запросу
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${userId}`;
      }
      return config;
    });

    // Обрабатываем ошибки авторизации
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  // Методы для работы с API
  async get(url: string, params?: any) {
    return this.client.get(url, { params });
  }

  async post(url: string, data?: any) {
    return this.client.post(url, data);
  }

  async put(url: string, data?: any) {
    return this.client.put(url, data);
  }

  async delete(url: string) {
    return this.client.delete(url);
  }

  // Специфические методы для работы с вакансиями
  async searchVacancies(params: {
    text?: string;
    area?: number;
    salary_from?: number;
    page?: number;
  }) {
    return this.get('/vacancies/search', params);
  }

  async getUserProfile() {
    return this.get('/user/profile');
  }

  async getVacancyDetails(vacancyId: string) {
    return this.get(`/vacancies/${vacancyId}`);
  }

  async applyToVacancy(vacancyId: string, resumeId: string, message?: string) {
    return this.post('/vacancies/apply', {
      vacancy_id: vacancyId,
      resume_id: resumeId,
      message
    });
  }

  async getNegotiations() {
    return this.get('/negotiations');
  }

  async getAnalytics() {
    return this.get('/analytics');
  }
}

export const apiService = new ApiService();