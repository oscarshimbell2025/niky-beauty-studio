import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Configuración de CORS y logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

app.use('*', logger(console.log));

// Cliente de Supabase con service role para el backend
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Función helper para verificar autenticación
const verifyAuth = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No token provided' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  return { user, error };
};

// RUTAS DE USUARIOS
app.get('/make-server-c927e83f/users', async (c) => {
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return c.json({ error: 'Error fetching users' }, 500);
    }

    return c.json({ users: users || [] });
  } catch (error) {
    console.error('Error in /users route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c927e83f/users', async (c) => {
  try {
    const userData = await c.req.json();
    
    const { data: user, error } = await supabase
      .from('user_profiles')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return c.json({ error: 'Error creating user' }, 500);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Error in POST /users route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// RUTAS DE SERVICIOS
app.get('/make-server-c927e83f/services', async (c) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return c.json({ error: 'Error fetching services' }, 500);
    }

    return c.json({ services: services || [] });
  } catch (error) {
    console.error('Error in /services route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c927e83f/services', async (c) => {
  try {
    const { user } = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const serviceData = await c.req.json();
    
    const { data: service, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return c.json({ error: 'Error creating service' }, 500);
    }

    return c.json({ service });
  } catch (error) {
    console.error('Error in POST /services route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-c927e83f/services/:id', async (c) => {
  try {
    const { user } = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const serviceId = c.req.param('id');
    const serviceData = await c.req.json();
    
    const { data: service, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return c.json({ error: 'Error updating service' }, 500);
    }

    return c.json({ service });
  } catch (error) {
    console.error('Error in PUT /services route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// RUTAS DE CITAS
app.get('/make-server-c927e83f/appointments', async (c) => {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return c.json({ error: 'Error fetching appointments' }, 500);
    }

    return c.json({ appointments: appointments || [] });
  } catch (error) {
    console.error('Error in /appointments route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c927e83f/appointments', async (c) => {
  try {
    const appointmentData = await c.req.json();
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return c.json({ error: 'Error creating appointment' }, 500);
    }

    return c.json({ appointment });
  } catch (error) {
    console.error('Error in POST /appointments route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-c927e83f/appointments/:id', async (c) => {
  try {
    const appointmentId = c.req.param('id');
    const appointmentData = await c.req.json();
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return c.json({ error: 'Error updating appointment' }, 500);
    }

    return c.json({ appointment });
  } catch (error) {
    console.error('Error in PUT /appointments route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// RUTAS DE COMENTARIOS
app.get('/make-server-c927e83f/comments/:targetType/:targetId', async (c) => {
  try {
    const targetType = c.req.param('targetType');
    const targetId = c.req.param('targetId');

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return c.json({ error: 'Error fetching comments' }, 500);
    }

    return c.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error in /comments route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c927e83f/comments', async (c) => {
  try {
    const commentData = await c.req.json();
    
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return c.json({ error: 'Error creating comment' }, 500);
    }

    return c.json({ comment });
  } catch (error) {
    console.error('Error in POST /comments route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// RUTAS DE NOTIFICACIONES
app.get('/make-server-c927e83f/notifications/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return c.json({ error: 'Error fetching notifications' }, 500);
    }

    return c.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('Error in /notifications route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c927e83f/notifications', async (c) => {
  try {
    const notificationData = await c.req.json();
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return c.json({ error: 'Error creating notification' }, 500);
    }

    return c.json({ notification });
  } catch (error) {
    console.error('Error in POST /notifications route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-c927e83f/notifications/:id/read', async (c) => {
  try {
    const notificationId = c.req.param('id');
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      return c.json({ error: 'Error marking notification as read' }, 500);
    }

    return c.json({ notification });
  } catch (error) {
    console.error('Error in PUT /notifications route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// RUTA DE LOGIN PERSONALIZADO
app.post('/make-server-c927e83f/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error during login:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Obtener el perfil del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ 
      user: userProfile,
      session: data.session,
      access_token: data.session?.access_token 
    });
  } catch (error) {
    console.error('Error in /login route:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Ruta de salud del servidor
app.get('/make-server-c927e83f/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Iniciar el servidor
Deno.serve(app.fetch);