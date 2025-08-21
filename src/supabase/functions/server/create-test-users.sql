-- SCRIPT PARA CREAR USUARIOS DE PRUEBA EN SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. CREAR USUARIOS EN AUTH (AUTENTICACIÓN)
-- Estos son los usuarios que pueden hacer login

-- ADMINISTRADOR
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@nbs.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- TRABAJADORA 1
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'maria@nbs.com',
  crypt('maria123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- TRABAJADORA 2
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '33333333-3333-3333-3333-333333333333'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sofia@nbs.com',
  crypt('sofia123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- CLIENTE 1
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '44444444-4444-4444-4444-444444444444'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'ana@cliente.com',
  crypt('ana123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- CLIENTE 2
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '55555555-5555-5555-5555-555555555555'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'laura@cliente.com',
  crypt('laura123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 2. CREAR PERFILES DE USUARIO EN LA TABLA user_profiles

-- ADMINISTRADOR
INSERT INTO user_profiles (
  id,
  name,
  email,
  role,
  phone,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Administrador NBS',
  'admin@nbs.com',
  'admin',
  '+57 301 123 4567',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- TRABAJADORA MARÍA
INSERT INTO user_profiles (
  id,
  name,
  email,
  role,
  phone,
  created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'María González',
  'maria@nbs.com',
  'worker',
  '+57 302 234 5678',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- TRABAJADORA SOFÍA
INSERT INTO user_profiles (
  id,
  name,
  email,
  role,
  phone,
  created_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Sofía Martínez',
  'sofia@nbs.com',
  'worker',
  '+57 303 345 6789',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- CLIENTE ANA
INSERT INTO user_profiles (
  id,
  name,
  email,
  role,
  phone,
  created_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Ana Rodríguez',
  'ana@cliente.com',
  'client',
  '+57 304 456 7890',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- CLIENTE LAURA
INSERT INTO user_profiles (
  id,
  name,
  email,
  role,
  phone,
  created_at
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Laura Fernández',
  'laura@cliente.com',
  'client',
  '+57 305 567 8901',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;