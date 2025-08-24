import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';
import { createApiCall, API_ENDPOINTS } from '../utils/api';
import { transformServiceFromApi, transformAppointmentFromApi } from '../utils/dataTransforms';
import { useApiOperations } from './useApiOperations';
import type { 
  User, 
  Appointment, 
  Service, 
  Notification, 
  Payment,
  AppointmentStatus,
  PaymentStatus 
} from '../types';

export const useAppLogic = () => {
  // Estados principales
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Estados de datos
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const apiCall = createApiCall(accessToken);
  const apiOperations = useApiOperations(accessToken, currentUser);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Cargar usuarios
      const usersResponse = await apiCall(API_ENDPOINTS.USERS);
      setUsers(usersResponse.users || []);

      // Cargar servicios
      const servicesResponse = await apiCall(API_ENDPOINTS.SERVICES);
      const transformedServices = (servicesResponse.services || []).map(transformServiceFromApi);
      setServices(transformedServices);

      // Cargar citas
      const appointmentsResponse = await apiCall(API_ENDPOINTS.APPOINTMENTS);
      const transformedAppointments = (appointmentsResponse.appointments || []).map(transformAppointmentFromApi);
      setAppointments(transformedAppointments);

      // Cargar notificaciones del usuario actual
      if (currentUser) {
        const notificationsResponse = await apiCall(`${API_ENDPOINTS.NOTIFICATIONS}/${currentUser.id}`);
        setNotifications(notificationsResponse.notifications || []);
      }

      console.log('✅ Datos cargados desde Supabase exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      toast.error('Error cargando datos de la aplicación');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, accessToken]);

  // Verificar sesión existente al iniciar
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (!profileError && userProfile) {
            setCurrentUser(userProfile);
            setAccessToken(session.access_token);
            setCurrentScreen('dashboard');
            toast.success(`¡Bienvenido de nuevo, ${userProfile.name}!`);
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Cargar datos cuando el usuario se autentica
  useEffect(() => {
    if (currentUser && accessToken) {
      loadInitialData();
    }
  }, [currentUser, accessToken, loadInitialData]);

  // Handlers principales
  const handleLogin = async (email: string, password?: string, provider?: 'google' | 'apple') => {
    try {
      setIsLoading(true);

      if (provider) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider === 'apple' ? 'apple' : 'google',
          options: { redirectTo: window.location.origin }
        });

        if (error) throw error;
        toast.success('Redirigiendo para autenticación...');
        return;
      }

      const response = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.user) {
        setCurrentUser(response.user);
        setAccessToken(response.access_token);
        setCurrentScreen('dashboard');
        toast.success(`¡Bienvenido, ${response.user.name}!`);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      toast.error('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setAccessToken(null);
      setCurrentScreen('login');
      setUsers([]);
      setAppointments([]);
      setServices([]);
      setNotifications([]);
      setPayments([]);
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      toast.error('Error cerrando sesión');
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  // Handlers que usan las operaciones API
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    await apiOperations.markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleCreateService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    const newService = await apiOperations.createService(serviceData);
    setServices(prev => [newService, ...prev]);
    toast.success('Servicio creado exitosamente');
  };

  const handleEditService = async (serviceId: string, serviceData: Partial<Service>) => {
    const updatedService = await apiOperations.editService(serviceId, serviceData);
    setServices(prev =>
      prev.map(service => service.id === serviceId ? updatedService : service)
    );
    toast.success('Servicio actualizado exitosamente');
  };

  const handleBookAppointment = async (appointmentData: {
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    finalPrice: number;
    workerRate: number;
  }) => {
    const newAppointment = await apiOperations.bookAppointment(appointmentData);
    setAppointments(prev => [newAppointment, ...prev]);
    toast.success('Cita reservada exitosamente');
  };

  const handleAssignWorker = async (appointmentId: string, workerId: string, workerName: string) => {
    await apiOperations.updateAppointment(appointmentId, {
      assigned_worker_id: workerId,
      assigned_worker_name: workerName,
      status: 'assigned'
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { 
              ...apt, 
              assignedWorkerId: workerId, 
              assignedWorkerName: workerName,
              status: 'assigned' as AppointmentStatus 
            }
          : apt
      )
    );
    toast.success('Trabajadora asignada exitosamente');
  };

  const handleConfirmPayment = async (appointmentId: string) => {
    await apiOperations.updateAppointment(appointmentId, {
      payment_status: 'paid'
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, paymentStatus: 'paid' as PaymentStatus }
          : apt
      )
    );
    toast.success('Pago confirmado exitosamente');
  };

  const handleCancelAppointment = async (appointmentId: string, reason: string) => {
    await apiOperations.updateAppointment(appointmentId, {
      status: 'cancelled',
      cancellation_reason: reason
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled' as AppointmentStatus, cancellationReason: reason }
          : apt
      )
    );
    toast.success('Cita cancelada exitosamente');
  };

  const handleClientCancelAppointment = async (appointmentId: string) => {
    await handleCancelAppointment(appointmentId, 'Cancelada por cliente');
  };

  const handleRequestAppointment = async (appointmentId: string) => {
    if (!currentUser) return;

    await apiOperations.updateAppointment(appointmentId, {
      assigned_worker_id: currentUser.id,
      assigned_worker_name: currentUser.name,
      status: 'assigned'
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { 
              ...apt, 
              assignedWorkerId: currentUser.id, 
              assignedWorkerName: currentUser.name,
              status: 'assigned' as AppointmentStatus 
            }
          : apt
      )
    );
    toast.success('Cita solicitada exitosamente');
  };

  const handleRequestReschedule = async (appointmentId: string, newDate: string, newTime: string, reason: string) => {
    await apiOperations.updateAppointment(appointmentId, {
      status: 'reschedule-requested',
      requested_date: newDate,
      requested_time: newTime,
      reschedule_reason: reason
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { 
              ...apt, 
              status: 'reschedule-requested' as AppointmentStatus,
              requestedDate: newDate,
              requestedTime: newTime,
              rescheduleReason: reason
            }
          : apt
      )
    );
    toast.success('Solicitud de reprogramación enviada');
  };

  const handleApproveReschedule = async (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment?.requestedDate || !appointment?.requestedTime) return;

    await apiOperations.updateAppointment(appointmentId, {
      appointment_date: appointment.requestedDate,
      appointment_time: appointment.requestedTime,
      status: 'assigned',
      requested_date: null,
      requested_time: null,
      reschedule_reason: null
    });

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { 
              ...apt,
              date: appointment.requestedDate!,
              time: appointment.requestedTime!,
              status: 'assigned' as AppointmentStatus,
              requestedDate: undefined,
              requestedTime: undefined,
              rescheduleReason: undefined
            }
          : apt
      )
    );
    toast.success('Reprogramación aprobada exitosamente');
  };

  const handleAddComment = async (targetType: 'service' | 'appointment', targetId: string, content: string, isInternal: boolean = false) => {
    await apiOperations.addComment(targetType, targetId, content, isInternal);
    toast.success('Comentario agregado exitosamente');
  };

  // Calcular trabajadores
  const workers = users.filter(user => user.role === 'worker');

  return {
    // State
    currentUser,
    currentScreen,
    notifications,
    appointments,
    payments,
    services,
    workers,
    isLoading,
    
    // Handlers
    handleLogin,
    handleLogout,
    handleNavigate,
    handleMarkNotificationAsRead,
    handleCreateService,
    handleEditService,
    handleAssignWorker,
    handleRequestAppointment,
    handleConfirmPayment,
    handleClientCancelAppointment,
    handleRequestReschedule,
    handleApproveReschedule,
    handleAddComment,
    handleBookAppointment,
    handleCancelAppointment
  };
};