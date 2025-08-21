import { projectId, publicAnonKey } from './supabase/info';

export const API_ENDPOINTS = {
  USERS: '/users',
  SERVICES: '/services',
  APPOINTMENTS: '/appointments',
  COMMENTS: '/comments',
  NOTIFICATIONS: '/notifications',
  LOGIN: '/login',
  HEALTH: '/health'
} as const;

export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c927e83f`;

export const createApiCall = (accessToken?: string | null) => {
  return async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`,
      ...options.headers,
    };

    const response = await fetch(`${serverUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  };
};