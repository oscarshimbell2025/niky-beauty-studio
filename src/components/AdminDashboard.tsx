import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, LogOut, Calendar, Scissors, DollarSign, Plus, Eye, Edit, Users, Bell, X, AlertTriangle, Check, Clock, UserCheck } from 'lucide-react';
import { CommentsSection } from './CommentsSection';
import { NotificationCenter } from './NotificationCenter';
import type { AppUser, Service, Appointment, Payment, Notification, WorkerInfo } from '../types';

// 👇 Reemplazo del logo
const nbsLogo = "/assets/logo2.png";


interface AdminDashboardProps {
  user: AppUser;
  services: Service[];
  appointments: Appointment[];
  payments: Payment[];
  notifications: Notification[];
  workers: WorkerInfo[];
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  onMarkNotificationAsRead: (notificationId: string) => void;
  onAddComment: (targetType: 'service' | 'appointment', targetId: string, content: string) => void;
  onCancelAppointment: (appointmentId: string, reason: string) => void;
  onCreateService: (serviceData: Omit<Service, 'id' | 'comments'>) => void;
  onEditService: (serviceId: string, updatedData: Partial<Service>) => void;
  onAssignWorker: (appointmentId: string, workerId: string, workerName: string) => void;
  onConfirmPayment: (paymentId: string, paymentMethod: 'cash' | 'card' | 'transfer') => void;
  onApproveReschedule: (appointmentId: string) => void;
}

export function AdminDashboard({ 
  user, 
  services, 
  appointments, 
  payments, 
  notifications,
  workers,
  onLogout, 
  onNavigate, 
  currentScreen,
  onMarkNotificationAsRead,
  onAddComment,
  onCancelAppointment,
  onCreateService,
  onEditService,
  onAssignWorker,
  onConfirmPayment,
  onApproveReschedule
}: AdminDashboardProps) {

  const [cancelReason, setCancelReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

  // Form states for service creation/editing
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [workerRate, setWorkerRate] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceImage, setServiceImage] = useState('');

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const overduePayments = appointments.filter(apt => apt.paymentStatus === 'overdue');
  const clientBookings = appointments.filter(apt => apt.createdBy === 'client');
  const rescheduleRequests = appointments.filter(apt => apt.status === 'reschedule-requested');

  const resetServiceForm = () => {
    setServiceName('');
    setServiceDescription('');
    setServicePrice('');
    setWorkerRate('');
    setServiceDuration('');
    setServiceCategory('');
    setServiceImage('');
  };

  const handleCreateService = () => {
    if (!serviceName || !servicePrice || !workerRate || !serviceDuration) return;

    const newServiceData: Omit<Service, 'id' | 'comments'> = {
      name: serviceName,
      description: serviceDescription,
      basePrice: parseFloat(servicePrice),
      workerRate: parseFloat(workerRate),
      duration: parseInt(serviceDuration),
      category: serviceCategory || 'General',
      isActive: true,
      imageUrl: serviceImage || undefined
    };

    onCreateService(newServiceData);
    resetServiceForm();
    setIsCreateServiceOpen(false);
  };

  const handleEditService = () => {
    if (!editingService || !serviceName || !servicePrice || !workerRate || !serviceDuration) return;

    const updatedData: Partial<Service> = {
      name: serviceName,
      description: serviceDescription,
      basePrice: parseFloat(servicePrice),
      workerRate: parseFloat(workerRate),
      duration: parseInt(serviceDuration),
      category: serviceCategory,
      imageUrl: serviceImage || undefined
    };

    onEditService(editingService.id, updatedData);
    resetServiceForm();
    setEditingService(null);
    setIsEditServiceOpen(false);
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceDescription(service.description);
    setServicePrice(service.basePrice.toString());
    setWorkerRate(service.workerRate.toString());
    setServiceDuration(service.duration.toString());
    setServiceCategory(service.category);
    setServiceImage(service.imageUrl || '');
    setIsEditServiceOpen(true);
  };

  const handleAssignWorker = (appointmentId: string) => {
    if (!selectedWorker) return;
    
    const worker = workers.find(w => w.id === selectedWorker);
    if (!worker) return;

    onAssignWorker(appointmentId, worker.id, worker.name);
    setSelectedWorker('');
  };

  const handleCancelAppointment = () => {
    if (selectedAppointmentId && cancelReason.trim()) {
      onCancelAppointment(selectedAppointmentId, cancelReason.trim());
      setCancelReason('');
      setSelectedAppointmentId(null);
    }
  };

  const getStatusBadge = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'assigned':
        return <Badge variant="default">Asignada</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'reschedule-requested':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Reprogramación Solicitada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-600">Pagado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const renderHeader = () => (
    <div className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md p-1">
            <img 
              src={nbsLogo} 
              alt="NBS" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">Panel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Hola, {user.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('notifications')}
            className="relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="bg-card border-b border-border">
      <div className="flex overflow-x-auto">
        <Button
          variant={currentScreen === 'dashboard' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('dashboard')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Resumen
        </Button>
        <Button
          variant={currentScreen === 'services' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('services')}
        >
          <Scissors className="w-4 h-4 mr-2" />
          Servicios
        </Button>
        <Button
          variant={currentScreen === 'appointments' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('appointments')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Citas
        </Button>
        <Button
          variant={currentScreen === 'payments' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('payments')}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Pagos
        </Button>
        <Button
          variant={currentScreen === 'notifications' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0 relative"
          onClick={() => onNavigate('notifications')}
        >
          <Bell className="w-4 h-4 mr-2" />
          Alertas
          {unreadNotifications > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-4 space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-pastel to-white border-primary-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Citas Pendientes</p>
                <p className="text-2xl font-bold text-primary">{pendingAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-100 to-white border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitudes de reprogramación */}
      {rescheduleRequests.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Solicitudes de Reprogramación
            </CardTitle>
            <CardDescription>
              Los siguientes clientes solicitan reprogramar sus citas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rescheduleRequests.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.clientName} - De: {appointment.date} {appointment.time} → A: {appointment.requestedDate} {appointment.requestedTime}
                  </p>
                  {appointment.rescheduleReason && (
                    <p className="text-xs text-muted-foreground">Motivo: {appointment.rescheduleReason}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onApproveReschedule(appointment.id)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAppointmentId(appointment.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alertas importantes */}
      {overduePayments.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Pagos Vencidos - Acción Requerida
            </CardTitle>
            <CardDescription>
              Las siguientes citas tienen pagos vencidos y requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overduePayments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.clientName} - {appointment.date} - S/ {appointment.finalPrice}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getPaymentStatusBadge(appointment.paymentStatus)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setSelectedAppointmentId(appointment.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancelar Cita</DialogTitle>
                        <DialogDescription>
                          ¿Estás segura de que quieres cancelar esta cita? Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Motivo de cancelación</Label>
                          <Textarea
                            id="reason"
                            placeholder="Ej: Pago no realizado dentro del plazo establecido"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="destructive" 
                            onClick={handleCancelAppointment}
                            disabled={!cancelReason.trim()}
                            className="flex-1"
                          >
                            Confirmar Cancelación
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setCancelReason('');
                              setSelectedAppointmentId(null);
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reservas online de clientes */}
      {clientBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Reservas Online de Clientes</span>
              <Badge variant="default">{clientBookings.length}</Badge>
            </CardTitle>
            <CardDescription>
              Citas reservadas directamente por los clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {clientBookings.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.clientName} - {appointment.date} {appointment.time}
                  </p>
                  <p className="text-xs text-primary">Reserva online</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(appointment)}
                  {getPaymentStatusBadge(appointment.paymentStatus)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notificaciones recientes */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notificaciones Recientes</span>
              <Button size="sm" onClick={() => onNavigate('notifications')}>
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                  {notification.isRead ? 'Leída' : 'Nueva'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderServices = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Servicios</h2>
        <Dialog open={isCreateServiceOpen} onOpenChange={setIsCreateServiceOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateServiceOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo servicio
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Servicio</Label>
                <Input
                  id="name"
                  placeholder="Ej: Manicure Deluxe"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={serviceCategory} onValueChange={setServiceCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Uñas">Uñas</SelectItem>
                    <SelectItem value="Cabello">Cabello</SelectItem>
                    <SelectItem value="Facial">Facial</SelectItem>
                    <SelectItem value="Corporal">Corporal</SelectItem>
                    <SelectItem value="Maquillaje">Maquillaje</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el servicio..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio Base (S/)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workerRate">Tarifa Trabajadora (S/)</Label>
                <Input
                  id="workerRate"
                  type="number"
                  placeholder="0.00"
                  value={workerRate}
                  onChange={(e) => setWorkerRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  placeholder="https://..."
                  value={serviceImage}
                  onChange={(e) => setServiceImage(e.target.value)}
                />
              </div>
              {serviceImage && (
                <div className="col-span-2">
                  <Label>Vista Previa</Label>
                  <div className="mt-2 w-full h-32 border border-border rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={serviceImage}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateService} className="flex-1">
                Crear Servicio
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetServiceForm();
                  setIsCreateServiceOpen(false);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start space-x-4">
                {service.imageUrl && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{service.category}</Badge>
                      <Badge variant={service.isActive ? 'default' : 'secondary'}>
                        {service.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <span>Precio: <strong>S/ {service.basePrice}</strong></span>
                      <span>Tarifa: <strong>S/ {service.workerRate}</strong></span>
                      <span>{service.duration}min</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditService(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sección de comentarios para servicios */}
              <Separator />
              <CommentsSection
                comments={service.comments}
                targetType="service"
                targetId={service.id}
                currentUserRole={user.role}
                onAddComment={onAddComment}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para editar servicio */}
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Modifica la información del servicio
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Servicio</Label>
              <Input
                id="edit-name"
                placeholder="Ej: Manicure Deluxe"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría</Label>
              <Select value={serviceCategory} onValueChange={setServiceCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uñas">Uñas</SelectItem>
                  <SelectItem value="Cabello">Cabello</SelectItem>
                  <SelectItem value="Facial">Facial</SelectItem>
                  <SelectItem value="Corporal">Corporal</SelectItem>
                  <SelectItem value="Maquillaje">Maquillaje</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe el servicio..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio Base (S/)</Label>
              <Input
                id="edit-price"
                type="number"
                placeholder="0.00"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-workerRate">Tarifa Trabajadora (S/)</Label>
              <Input
                id="edit-workerRate"
                type="number"
                placeholder="0.00"
                value={workerRate}
                onChange={(e) => setWorkerRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duración (minutos)</Label>
              <Input
                id="edit-duration"
                type="number"
                placeholder="60"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">URL de Imagen</Label>
              <Input
                id="edit-image"
                placeholder="https://..."
                value={serviceImage}
                onChange={(e) => setServiceImage(e.target.value)}
              />
            </div>
            {serviceImage && (
              <div className="col-span-2">
                <Label>Vista Previa</Label>
                <div className="mt-2 w-full h-32 border border-border rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={serviceImage}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleEditService} className="flex-1">
              Guardar Cambios
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                resetServiceForm();
                setEditingService(null);
                setIsEditServiceOpen(false);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderAppointments = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gestión de Citas</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{appointment.serviceName}</h3>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(appointment)}
                  {getPaymentStatusBadge(appointment.paymentStatus)}
                  {appointment.createdBy === 'client' && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Online
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Cliente:</span> {appointment.clientName}</p>
                {appointment.clientEmail && (
                  <p><span className="font-medium">Email:</span> {appointment.clientEmail}</p>
                )}
                {appointment.clientPhone && (
                  <p><span className="font-medium">Teléfono:</span> {appointment.clientPhone}</p>
                )}
                <p><span className="font-medium">Fecha:</span> {appointment.date} - {appointment.time}</p>
                <p><span className="font-medium">Precio final:</span> S/ {appointment.finalPrice}</p>
                <p><span className="font-medium">Tarifa trabajadora:</span> S/ {appointment.workerRate}</p>
                {appointment.assignedWorkerName && (
                  <p><span className="font-medium">Asignada a:</span> {appointment.assignedWorkerName}</p>
                )}
                {appointment.cancellationReason && (
                  <p><span className="font-medium text-red-600">Motivo de cancelación:</span> {appointment.cancellationReason}</p>
                )}
                {appointment.status === 'reschedule-requested' && appointment.requestedDate && (
                  <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                    <p className="font-medium text-yellow-700">Reprogramación solicitada:</p>
                    <p className="text-sm">Nueva fecha: {appointment.requestedDate} - {appointment.requestedTime}</p>
                    {appointment.rescheduleReason && (
                      <p className="text-sm">Motivo: {appointment.rescheduleReason}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {appointment.isPublished ? (
                    <Badge variant="default">Publicada</Badge>
                  ) : (
                    <Badge variant="secondary">Borrador</Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  {appointment.status === 'pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Asignar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Asignar Trabajadora</DialogTitle>
                          <DialogDescription>
                            Selecciona una trabajadora para esta cita
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Trabajadora disponible</Label>
                            <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar trabajadora" />
                              </SelectTrigger>
                              <SelectContent>
                                {workers.map((worker) => (
                                  <SelectItem key={worker.id} value={worker.id}>
                                    {worker.name} {!worker.isAvailable && '(No disponible)'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            onClick={() => handleAssignWorker(appointment.id)}
                            disabled={!selectedWorker}
                            className="w-full"
                          >
                            Asignar Trabajadora
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {appointment.status === 'reschedule-requested' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onApproveReschedule(appointment.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aprobar Reprogramación
                    </Button>
                  )}
                  {appointment.paymentStatus === 'overdue' && appointment.status !== 'cancelled' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSelectedAppointmentId(appointment.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancelar Cita por Falta de Pago</DialogTitle>
                          <DialogDescription>
                            Esta cita será cancelada debido a falta de pago. El cliente será notificado.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reason">Motivo de cancelación</Label>
                            <Textarea
                              id="reason"
                              placeholder="Pago no realizado dentro del plazo establecido"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="destructive" 
                              onClick={handleCancelAppointment}
                              disabled={!cancelReason.trim()}
                              className="flex-1"
                            >
                              Confirmar Cancelación
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sección de comentarios para citas */}
              <Separator />
              <CommentsSection
                comments={appointment.comments}
                targetType="appointment"
                targetId={appointment.id}
                currentUserRole={user.role}
                onAddComment={onAddComment}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Comisiones y Pagos</h2>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <Card key={payment.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{payment.clientName}</h3>
                <Badge variant={payment.isPaid ? 'default' : 'secondary'}>
                  {payment.isPaid ? 'Pagado' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Trabajadora:</span> {payment.workerName}</p>
                <p><span className="font-medium">Monto total:</span> S/ {payment.totalAmount}</p>
                <p><span className="font-medium">Comisión trabajadora:</span> S/ {payment.workerAmount}</p>
                <p><span className="font-medium">Fecha:</span> {payment.date}</p>
                <p><span className="font-medium">Vencimiento:</span> {payment.dueDate}</p>
                <p><span className="font-medium">Cita ID:</span> #{payment.appointmentId}</p>
                {payment.paymentMethod && (
                  <p><span className="font-medium">Método de pago:</span> {payment.paymentMethod}</p>
                )}
              </div>

              {!payment.isPaid && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="w-full">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Confirmar Pago
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Pago</DialogTitle>
                        <DialogDescription>
                          Selecciona el método de pago utilizado
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Método de pago</Label>
                          <Select value={selectedPaymentMethod} onValueChange={(value: 'cash' | 'card' | 'transfer') => setSelectedPaymentMethod(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Efectivo</SelectItem>
                              <SelectItem value="card">Tarjeta</SelectItem>
                              <SelectItem value="transfer">Transferencia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span>Monto total:</span>
                            <span className="font-bold">S/ {payment.totalAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Comisión trabajadora:</span>
                            <span className="font-bold text-primary">S/ {payment.workerAmount}</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onConfirmPayment(payment.id, selectedPaymentMethod)}
                          className="w-full"
                        >
                          Confirmar Pago
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={onMarkNotificationAsRead}
        onNavigateToRelated={(relatedType, relatedId) => {
          if (relatedType === 'appointment') {
            onNavigate('appointments');
          } else if (relatedType === 'service') {
            onNavigate('services');
          } else if (relatedType === 'payment') {
            onNavigate('payments');
          }
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      {renderNavigation()}
      
      <div className="pb-safe">
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'services' && renderServices()}
        {currentScreen === 'appointments' && renderAppointments()}
        {currentScreen === 'payments' && renderPayments()}
        {currentScreen === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
}
