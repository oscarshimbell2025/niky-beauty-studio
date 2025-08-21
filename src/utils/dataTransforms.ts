import type { User, Service, Appointment, Notification, Comment, AppointmentStatus, PaymentStatus } from '../types';

export const transformUserFromApi = (apiUser: any): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  role: apiUser.role,
  phone: apiUser.phone,
  createdAt: apiUser.created_at
});

export const transformServiceFromApi = (apiService: any): Service => ({
  id: apiService.id,
  name: apiService.name,
  description: apiService.description,
  basePrice: apiService.base_price,
  workerRate: apiService.worker_rate,
  duration: apiService.duration,
  category: apiService.category,
  imageUrl: apiService.image_url,
  isActive: apiService.is_active,
  createdAt: apiService.created_at
});

export const transformAppointmentFromApi = (apiAppointment: any): Appointment => ({
  id: apiAppointment.id,
  serviceId: apiAppointment.service_id,
  clientId: apiAppointment.client_id,
  assignedWorkerId: apiAppointment.assigned_worker_id,
  serviceName: apiAppointment.service_name,
  clientName: apiAppointment.client_name,
  clientEmail: apiAppointment.client_email,
  clientPhone: apiAppointment.client_phone,
  assignedWorkerName: apiAppointment.assigned_worker_name,
  date: apiAppointment.appointment_date,
  time: apiAppointment.appointment_time,
  finalPrice: apiAppointment.final_price,
  workerRate: apiAppointment.worker_rate,
  status: apiAppointment.status as AppointmentStatus,
  paymentStatus: apiAppointment.payment_status as PaymentStatus,
  createdBy: apiAppointment.created_by,
  isPublished: apiAppointment.is_published,
  cancellationReason: apiAppointment.cancellation_reason,
  requestedDate: apiAppointment.requested_date,
  requestedTime: apiAppointment.requested_time,
  rescheduleReason: apiAppointment.reschedule_reason,
  createdAt: apiAppointment.created_at
});

export const transformServiceToApi = (service: Omit<Service, 'id' | 'createdAt'>) => ({
  name: service.name,
  description: service.description,
  base_price: service.basePrice,
  worker_rate: service.workerRate,
  duration: service.duration,
  category: service.category,
  image_url: service.imageUrl,
  is_active: true
});

export const transformAppointmentToApi = (appointmentData: {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  finalPrice: number;
  workerRate: number;
}, currentUser: User) => ({
  service_id: appointmentData.serviceId,
  client_id: currentUser.id,
  service_name: appointmentData.serviceName,
  client_name: currentUser.name,
  client_email: currentUser.email,
  client_phone: currentUser.phone,
  appointment_date: appointmentData.date,
  appointment_time: appointmentData.time,
  final_price: appointmentData.finalPrice,
  worker_rate: appointmentData.workerRate,
  status: 'pending',
  payment_status: 'pending',
  created_by: 'client',
  is_published: true
});