import type { AppUser, UserRole, Service, Appointment, Payment, Notification, WorkerInfo } from '../types';

export const MOCK_USERS = [
  {
    id: 'admin-1',
    name: 'Administrador NBS',
    email: 'admin@nbs.com',
    role: 'admin' as UserRole,
    password: 'admin123'
  },
  {
    id: 'worker-1',
    name: 'Sofía Ramírez',
    email: 'worker@nbs.com',
    role: 'worker' as UserRole,
    password: 'worker123'
  },
  {
    id: 'worker-2',
    name: 'Ana López',
    email: 'ana@nbs.com',
    role: 'worker' as UserRole,
    password: 'ana123'
  },
  {
    id: 'client-1',
    name: 'María González',
    email: 'client@nbs.com',
    role: 'client' as UserRole,
    phone: '+51 987654321',
    password: 'client123'
  }
];

export const getMockWorkers = (): WorkerInfo[] => [
  { id: 'worker-1', name: 'Sofía Ramírez', email: 'worker@nbs.com', isAvailable: true },
  { id: 'worker-2', name: 'Ana López', email: 'ana@nbs.com', isAvailable: true }
];

export const getMockServices = (): Service[] => [
  {
    id: 'service-1',
    name: 'Manicure Clásico',
    description: 'Limpieza, corte y esmaltado básico',
    basePrice: 25,
    workerRate: 15,
    duration: 60,
    category: 'Uñas',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    comments: [
      {
        id: 'comment-1',
        userId: 'admin-1',
        userName: 'Administrador NBS',
        userRole: 'admin',
        content: 'Recordar usar esmalte de larga duración para este servicio',
        timestamp: new Date().toISOString(),
        isInternal: true
      }
    ]
  },
  {
    id: 'service-2',
    name: 'Pedicure Spa',
    description: 'Tratamiento completo para pies con exfoliación',
    basePrice: 35,
    workerRate: 20,
    duration: 90,
    category: 'Uñas',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop',
    comments: []
  },
  {
    id: 'service-3',
    name: 'Corte y Peinado',
    description: 'Corte personalizado y peinado profesional',
    basePrice: 40,
    workerRate: 25,
    duration: 120,
    category: 'Cabello',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    comments: []
  },
  {
    id: 'service-4',
    name: 'Tratamiento Facial',
    description: 'Limpieza facial profunda con hidratación',
    basePrice: 50,
    workerRate: 30,
    duration: 90,
    category: 'Facial',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop',
    comments: []
  }
];

export const getMockAppointments = (): Appointment[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: 'apt-1',
      serviceId: 'service-1',
      serviceName: 'Manicure Clásico',
      clientId: 'client-1',
      clientName: 'María González',
      clientEmail: 'client@nbs.com',
      clientPhone: '+51 987654321',
      date: tomorrowDate,
      time: '10:00',
      finalPrice: 30,
      workerRate: 18,
      status: 'pending',
      isPublished: true,
      paymentStatus: 'pending',
      createdBy: 'client',
      createdAt: new Date().toISOString(),
      comments: []
    },
    {
      id: 'apt-2',
      serviceId: 'service-2',
      serviceName: 'Pedicure Spa',
      clientId: 'client-1',
      clientName: 'María González',
      clientEmail: 'client@nbs.com',
      date: tomorrowDate,
      time: '14:30',
      finalPrice: 35,
      workerRate: 20,
      assignedWorkerId: 'worker-1',
      assignedWorkerName: 'Sofía Ramírez',
      status: 'assigned',
      isPublished: true,
      paymentStatus: 'paid',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      comments: []
    },
    {
      id: 'apt-3',
      serviceId: 'service-3',
      serviceName: 'Corte y Peinado',
      clientId: 'client-1',
      clientName: 'María González',
      clientEmail: 'client@nbs.com',
      date: '2025-08-19',
      time: '16:00',
      finalPrice: 40,
      workerRate: 25,
      assignedWorkerId: 'worker-1',
      assignedWorkerName: 'Sofía Ramírez',
      status: 'completed',
      isPublished: true,
      paymentStatus: 'overdue',
      createdBy: 'client',
      createdAt: new Date().toISOString(),
      comments: []
    }
  ];
};

export const getMockPayments = (): Payment[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: 'payment-1',
      appointmentId: 'apt-2',
      clientId: 'client-1',
      clientName: 'María González',
      workerId: 'worker-1',
      workerName: 'Sofía Ramírez',
      totalAmount: 35,
      workerAmount: 20,
      date: tomorrowDate,
      dueDate: tomorrowDate,
      isPaid: true,
      paymentMethod: 'card'
    },
    {
      id: 'payment-2',
      appointmentId: 'apt-3',
      clientId: 'client-1',
      clientName: 'María González',
      workerId: 'worker-1',
      workerName: 'Sofía Ramírez',
      totalAmount: 40,
      workerAmount: 25,
      date: '2025-08-19',
      dueDate: '2025-08-19',
      isPaid: false
    }
  ];
};

export const getMockNotifications = (): Notification[] => [
  {
    id: 'notif-1',
    userId: 'worker-1',
    title: 'Nueva cita disponible',
    message: 'Manicure Clásico - María González - S/ 18 de ganancia',
    type: 'info',
    timestamp: new Date().toISOString(),
    isRead: false,
    relatedId: 'apt-1',
    relatedType: 'appointment'
  },
  {
    id: 'notif-2',
    userId: 'client-1',
    title: 'Cita confirmada',
    message: 'Tu cita de Pedicure Spa ha sido confirmada',
    type: 'success',
    timestamp: new Date().toISOString(),
    isRead: false,
    relatedId: 'apt-2',
    relatedType: 'appointment'
  },
  {
    id: 'notif-3',
    userId: 'admin-1',
    title: 'Pago vencido',
    message: 'María González tiene un pago vencido de S/ 40',
    type: 'warning',
    timestamp: new Date().toISOString(),
    isRead: false,
    relatedId: 'apt-3',
    relatedType: 'payment'
  }
];