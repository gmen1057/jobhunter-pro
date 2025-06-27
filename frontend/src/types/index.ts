// Типы для вакансий
export interface Vacancy {
  id: string;
  name: string;
  employer_name: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  area_name: string;
  published_at: string;
  url: string;
  description?: string;
  key_skills?: string[];
  employment?: string;
  experience?: string;
}

// Типы для пользователя
export interface User {
  id: number;
  email: string;
  name: string;
  hh_token?: string;
  phone?: string;
  position?: string;
  salary_from?: number;
  salary_to?: number;
}

// Типы для резюме
export interface Resume {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  area: {
    id: string;
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
  url: string;
}

// Типы для переговоров (откликов)
export interface Negotiation {
  id: string;
  vacancy: {
    id: string;
    name: string;
    employer_name: string;
  };
  resume: {
    id: string;
    title: string;
  };
  state: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
  messages_url?: string;
}

// Типы для фильтров поиска
export interface SearchFilters {
  text?: string;
  area?: number;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  employment?: string;
  schedule?: string;
}

// Типы для аналитики
export interface Analytics {
  total_applications: number;
  responses: number;
  interviews: number;
  rejections: number;
  average_response_time: number;
  top_skills: Array<{
    name: string;
    count: number;
  }>;
  salary_statistics: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
}

// Типы для настроек уведомлений
export interface NotificationSettings {
  email_new_vacancies: boolean;
  email_responses: boolean;
  email_interviews: boolean;
  telegram_notifications: boolean;
  telegram_chat_id: string;
}

// Типы для настроек автоматизации
export interface AutomationSettings {
  auto_apply: boolean;
  auto_apply_message: string;
  search_interval: number;
  max_applications_per_day: number;
  filter_by_salary: boolean;
  filter_by_keywords: string[];
  exclude_keywords: string[];
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  per_page: number;
  pages: number;
  found: number;
}

// Типы для справочников HH
export interface Area {
  id: string;
  name: string;
  areas?: Area[];
}

export interface ProfessionalRole {
  id: number;
  name: string;
}

export interface Employer {
  id: string;
  name: string;
  url?: string;
  logo_urls?: {
    "240": string;
    "90": string;
    original: string;
  };
}

// Типы для статистики
export interface SalaryStatistics {
  professional_role: {
    id: number;
    name: string;
  };
  area: {
    id: string;
    name: string;
  };
  salary: {
    from: number;
    to: number;
    average: number;
    median: number;
  };
  count: number;
}