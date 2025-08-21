import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Create demo users
    const adminUser = await supabase.auth.admin.createUser({
      email: 'admin@nikybeautystudio.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { name: 'Administradora NBS', role: 'admin' }
    })

    const workerUser = await supabase.auth.admin.createUser({
      email: 'worker@nikybeautystudio.com', 
      password: 'worker123',
      email_confirm: true,
      user_metadata: { name: 'Sofía Ramírez', role: 'worker' }
    })

    const clientUser = await supabase.auth.admin.createUser({
      email: 'cliente@nikybeautystudio.com',
      password: 'client123',
      email_confirm: true,
      user_metadata: { name: 'María González', role: 'client', phone: '+51 987654321' }
    })

    if (adminUser.data?.user && workerUser.data?.user && clientUser.data?.user) {
      // Create user profiles
      await supabase.from('user_profiles').insert([
        {
          id: adminUser.data.user.id,
          name: 'Administradora NBS',
          role: 'admin'
        },
        {
          id: workerUser.data.user.id,
          name: 'Sofía Ramírez',
          role: 'worker'
        },
        {
          id: clientUser.data.user.id,
          name: 'María González',
          role: 'client',
          phone: '+51 987654321'
        }
      ])

      // Create services
      const services = await supabase.from('services').insert([
        {
          name: 'Manicure Clásico',
          description: 'Limpieza, corte y esmaltado básico',
          base_price: 25.00,
          worker_rate: 15.00,
          duration: 60,
          category: 'Uñas',
          is_active: true
        },
        {
          name: 'Pedicure Spa',
          description: 'Tratamiento completo para pies con exfoliación',
          base_price: 35.00,
          worker_rate: 20.00,
          duration: 90,
          category: 'Uñas',
          is_active: true
        },
        {
          name: 'Corte y Peinado',
          description: 'Corte personalizado y peinado profesional',
          base_price: 40.00,
          worker_rate: 25.00,
          duration: 120,
          category: 'Cabello',
          is_active: true
        },
        {
          name: 'Tratamiento Facial',
          description: 'Limpieza facial profunda con hidratación',
          base_price: 50.00,
          worker_rate: 30.00,
          duration: 90,
          category: 'Facial',
          is_active: true
        }
      ]).select()

      if (services.data && services.data.length > 0) {
        // Create sample appointments
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowDate = tomorrow.toISOString().split('T')[0]

        await supabase.from('appointments').insert([
          {
            service_id: services.data[0].id,
            client_id: clientUser.data.user.id,
            date: tomorrowDate,
            time: '10:00',
            final_price: 30.00,
            worker_rate: 18.00,
            status: 'pending',
            payment_status: 'pending',
            created_by: 'client',
            is_published: true
          },
          {
            service_id: services.data[1].id,
            client_id: clientUser.data.user.id,
            assigned_worker_id: workerUser.data.user.id,
            date: tomorrowDate,
            time: '14:30',
            final_price: 35.00,
            worker_rate: 20.00,
            status: 'assigned',
            payment_status: 'paid',
            created_by: 'admin',
            is_published: true
          }
        ])

        // Create sample comments
        await supabase.from('comments').insert([
          {
            target_type: 'service',
            target_id: services.data[0].id,
            user_id: adminUser.data.user.id,
            content: 'Recordar usar esmalte de larga duración para este servicio',
            is_internal: true
          }
        ])

        // Create sample notifications
        await supabase.from('notifications').insert([
          {
            user_id: workerUser.data.user.id,
            title: 'Nueva cita disponible',
            message: 'Manicure Clásico - María González - S/ 18 de ganancia',
            type: 'info'
          },
          {
            user_id: clientUser.data.user.id,
            title: 'Cita confirmada',
            message: 'Tu cita de Pedicure Spa ha sido confirmada',
            type: 'success'
          },
          {
            user_id: adminUser.data.user.id,
            title: 'Nueva reserva online',
            message: 'María González reservó Manicure Clásico',
            type: 'info'
          }
        ])

        console.log('Database seeded successfully!')
        return { success: true }
      }
    }

    throw new Error('Failed to create users or services')
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error: error.message }
  }
}

// Call seed function if this file is run directly
if (import.meta.main) {
  seedDatabase()
}