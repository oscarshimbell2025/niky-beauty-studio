export type UserRole = 'admin' | 'worker' | 'client' | null;

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  workerRate: number;
  duration: number;
  category: string;
  comments: AppComment[];
  isActive: boolean;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  time: string;
  finalPrice: number;
  workerRate: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled' | 'reschedule-requested';
  isPublished: boolean;
  comments: AppComment[];
  paymentStatus: 'pending' | 'paid' | 'overdue';
  createdBy: 'admin' | 'client';
  cancellationReason?: string;
  createdAt?: string;
  requestedDate?: string;
  requestedTime?: string;
  rescheduleReason?: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName: string;
  workerId: string;
  workerName: string;
  totalAmount: number;
  workerAmount: number;
  date: string;
  dueDate: string;
  isPaid: boolean;
  paymentMethod?: 'cash' | 'card' | 'transfer';
}

export interface AppComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
  relatedType?: 'appointment' | 'service' | 'payment';
}

export interface WorkerInfo {
  id: string;
  name: string;
  email: string;
  isAvailable: boolean;
}