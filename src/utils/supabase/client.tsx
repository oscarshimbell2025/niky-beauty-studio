import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './info';

// Cliente de Supabase para el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener el usuario actual autenticado
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Función para obtener la sesión actual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }
  return session;
};