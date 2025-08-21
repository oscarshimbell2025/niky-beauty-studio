-- SCRIPT PARA CREAR SERVICIOS DE PRUEBA
-- Ejecutar después de crear los usuarios

INSERT INTO services (
  id,
  name,
  description,
  base_price,
  worker_rate,
  duration,
  category,
  image_url,
  is_active,
  created_at
) VALUES
(
  gen_random_uuid(),
  'Manicure Clásica',
  'Manicure tradicional con esmaltado regular. Incluye limado, cutícula y hidratación.',
  25000,
  15000,
  60,
  'Uñas',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Manicure Semipermanente',
  'Manicure con esmaltado semipermanente que dura hasta 3 semanas. Incluye diseños básicos.',
  45000,
  25000,
  90,
  'Uñas',
  'https://images.unsplash.com/photo-1610992015164-2d25bd5e01c9?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Pedicure Spa',
  'Pedicure completa con exfoliación, masaje y esmaltado. Incluye hidratación profunda.',
  35000,
  20000,
  75,
  'Pies',
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Depilación con Cera - Piernas',
  'Depilación completa de piernas con cera tibia. Incluye hidratación post-depilación.',
  40000,
  22000,
  45,
  'Depilación',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Cejas y Pestañas',
  'Diseño y depilación de cejas + tinte de cejas y pestañas.',
  30000,
  18000,
  45,
  'Rostro',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Masaje Relajante',
  'Masaje corporal relajante de 60 minutos con aceites esenciales.',
  60000,
  35000,
  60,
  'Masajes',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Limpieza Facial Profunda',
  'Limpieza facial con extracción, mascarilla y hidratación. Ideal para todo tipo de piel.',
  50000,
  28000,
  75,
  'Rostro',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
  true,
  now()
),
(
  gen_random_uuid(),
  'Maquillaje Social',
  'Maquillaje para eventos especiales. Incluye pestañas postizas.',
  55000,
  30000,
  90,
  'Maquillaje',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
  true,
  now()
);