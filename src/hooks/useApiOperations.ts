import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { createApiCall, API_ENDPOINTS } from '../utils/api';
import { 
  transformServiceFromApi, 
  transformAppointmentFromApi, 
  transformServiceToApi, 
  transformAppointmentToApi 
} from '../utils/dataTransforms';
import type { Service, Appointment, User } from '../types';

export const useApiOperations = (accessToken: string | null, currentUser: User | null) => {
  const apiCall = createApiCall(accessToken);

  const createService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    try {
      const response = await apiCall(API_ENDPOINTS.SERVICES, {
        method: 'POST',
        body: JSON.stringify(transformServiceToApi(serviceData))
      });

      return transformServiceFromApi(response.service);
    } catch (error) {
      console.error('❌ Error creando servicio:', error);
      toast.error('Error creando servicio');
      throw error;
    }
  };

  const editService = async (serviceId: string, serviceData: Partial<Service>) => {
    try {
      const updateData = {
        name: serviceData.name,
        description: serviceData.description,
        base_price: serviceData.basePrice,
        worker_rate: serviceData.workerRate,
        duration: serviceData.duration,
        category: serviceData.category,
        image_url: serviceData.imageUrl,
        is_active: serviceData.isActive
      };

      const response = await apiCall(`${API_ENDPOINTS.SERVICES}/${serviceId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      return transformServiceFromApi(response.service);
    } catch (error) {
      console.error('❌ Error actualizando servicio:', error);
      toast.error('Error actualizando servicio');
      throw error;
    }
  };

  const bookAppointment = async (appointmentData: {
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    finalPrice: number;
    workerRate: number;
  }) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      const response = await apiCall(API_ENDPOINTS.APPOINTMENTS, {
        method: 'POST',
        body: JSON.stringify(transformAppointmentToApi(appointmentData, currentUser))
      });

      return transformAppointmentFromApi(response.appointment);
    } catch (error) {
      console.error('❌ Error reservando cita:', error);
      toast.error('Error reservando cita');
      throw error;
    }
  };

  const updateAppointment = async (appointmentId: string, updateData: any) => {
    try {
      const response = await apiCall(`${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      return transformAppointmentFromApi(response.appointment);
    } catch (error) {
      console.error('❌ Error actualizando cita:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await apiCall(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('❌ Error marcando notificación como leída:', error);
      toast.error('Error actualizando notificación');
      throw error;
    }
  };

  const addComment = async (targetType: 'service' | 'appointment', targetId: string, content: string, isInternal: boolean = false) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      const commentData = {
        target_type: targetType,
        target_id: targetId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role,
        content,
        is_internal: isInternal
      };

      await apiCall(API_ENDPOINTS.COMMENTS, {
        method: 'POST',
        body: JSON.stringify(commentData)
      });
    } catch (error) {
      console.error('❌ Error agregando comentario:', error);
      toast.error('Error agregando comentario');
      throw error;
    }
  };

  return {
    createService,
    editService,
    bookAppointment,
    updateAppointment,
    markNotificationAsRead,
    addComment
  };
};