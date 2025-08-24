import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Bell, LogOut, Calendar, Heart, Clock, Star, CreditCard, MapPin, Phone, Mail, X, Edit } from 'lucide-react';
import { CommentsSection } from './CommentsSection';
import { NotificationCenter } from './NotificationCenter';
import type { AppUser, Service, Appointment, Notification } from '../types';

// 👇 Reemplazo del logo
const nbsLogo = "/assets/logo2.png";


interface ClientDashboardProps {
  user: AppUser;
  services: Service[];
  appointments: Appointment[];
  notifications: Notification[];
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  onMarkNotificationAsRead: (notificationId: string) => void;
  onAddComment: (targetType: 'service' | 'appointment', targetId: string, content: string) => void;
  onBookAppointment: (serviceId: string, date: string, time: string) => void;
  onCancelAppointment: (appointmentId: string, reason: string) => void;
  onRequestReschedule: (appointmentId: string, newDate: string, newTime: string, reason: string) => void;
}

export function ClientDashboard({ 
  user, 
  services, 
  appointments, 
  notifications,
  onLogout, 
  onNavigate, 
  currentScreen,
  onMarkNotificationAsRead,
  onAddComment,
  onBookAppointment,
  onCancelAppointment,
  onRequestReschedule
}: ClientDashboardProps) {

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const upcomingAppointments = appointments.filter(apt => 
    apt.status !== 'cancelled' && apt.status !== 'completed'
  );
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  const handleBooking = () => {
    if (selectedService && bookingDate && bookingTime) {
      onBookAppointment(selectedService.id, bookingDate, bookingTime);
      setBookingDate('');
      setBookingTime('');
      setSelectedService(null);
    }
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment && cancelReason.trim()) {
      onCancelAppointment(selectedAppointment.id, cancelReason.trim());
      setSelectedAppointment(null);
      setCancelReason('');
    }
  };

  const handleRescheduleRequest = () => {
    if (selectedAppointment && rescheduleDate && rescheduleTime && rescheduleReason.trim()) {
      onRequestReschedule(selectedAppointment.id, rescheduleDate, rescheduleTime, rescheduleReason.trim());
      setSelectedAppointment(null);
      setRescheduleDate('');
      setRescheduleTime('');
      setRescheduleReason('');
    }
  };

  const getStatusBadge = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'assigned':
        return <Badge variant="default">Confirmada</Badge>;
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

  const canModifyAppointment = (appointment: Appointment) => {
    return appointment.status === 'pending' || appointment.status === 'assigned';
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
            <h1 className="text-lg font-bold">Niky Beauty Studio</h1>
            <p className="text-sm text-muted-foreground">Hola, {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
            <User className="w-4 h-4" />
          </Button>
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
          <Heart className="w-4 h-4 mr-2" />
          Servicios
        </Button>
        <Button
          variant={currentScreen === 'appointments' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('appointments')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Mis Citas
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
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-pastel to-white border-primary-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximas Citas</p>
                <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent to-white border-primary-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Servicios Favoritos</p>
                <p className="text-2xl font-bold text-primary">{pastAppointments.length}</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuestros Servicios</CardTitle>
          <CardDescription>
            Descubre todos nuestros tratamientos de belleza
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="border-l-4 border-l-primary bg-gradient-to-r from-primary-pastel/20 to-white">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {service.imageUrl && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <Badge variant="outline" className="mt-1">{service.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">S/ {service.basePrice}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedService(service)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Reservar Cita
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reservar {service.name}</DialogTitle>
                          <DialogDescription>
                            Selecciona fecha y hora para tu cita
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {service.imageUrl && (
                            <div className="w-full h-32 rounded-lg overflow-hidden">
                              <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="date">Fecha</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Hora</Label>
                            <Input
                              id="time"
                              type="time"
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              min="09:00"
                              max="18:00"
                            />
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span>Precio del servicio:</span>
                              <span className="font-bold text-primary">S/ {service.basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Duración:</span>
                              <span>{service.duration} minutos</span>
                            </div>
                          </div>
                          <Button 
                            onClick={handleBooking} 
                            className="w-full"
                            disabled={!bookingDate || !bookingTime}
                          >
                            Confirmar Reserva
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.slice(0, 2).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} - {appointment.time}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(appointment)}
                  {getPaymentStatusBadge(appointment.paymentStatus)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
          <CardDescription>
            Tus citas confirmadas y pendientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes citas próximas</p>
              <Button 
                className="mt-4"
                onClick={() => onNavigate('dashboard')}
              >
                Reservar una cita
              </Button>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{appointment.serviceName}</h3>
                    <div className="text-right space-y-1">
                      {getStatusBadge(appointment)}
                      {getPaymentStatusBadge(appointment.paymentStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Fecha:</span> {appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Hora:</span> {appointment.time}</span>
                    </div>
                    {appointment.assignedWorkerName && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-medium">Profesional:</span> {appointment.assignedWorkerName}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Precio:</span> S/ {appointment.finalPrice}</span>
                    </div>
                  </div>

                  {appointment.paymentStatus === 'overdue' && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                      <p className="text-destructive font-medium">⚠️ Pago vencido</p>
                      <p className="text-sm text-muted-foreground">
                        Por favor realiza el pago para mantener tu cita activa
                      </p>
                    </div>
                  )}

                  {appointment.status === 'reschedule-requested' && appointment.requestedDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-700 font-medium">📅 Reprogramación solicitada</p>
                      <p className="text-sm text-blue-600">
                        Nueva fecha solicitada: {appointment.requestedDate} - {appointment.requestedTime}
                      </p>
                      <p className="text-sm text-blue-600">
                        Esperando confirmación del administrador
                      </p>
                    </div>
                  )}

                  {/* Botones de acción para la cita */}
                  {canModifyAppointment(appointment) && (
                    <div className="flex space-x-2 mb-4">
                      {/* Botón Reprogramar */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Reprogramar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Solicitar Reprogramación</DialogTitle>
                            <DialogDescription>
                              Indica tu nueva fecha y hora preferida
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="font-medium">{appointment.serviceName}</p>
                              <p className="text-sm text-muted-foreground">
                                Fecha actual: {appointment.date} - {appointment.time}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reschedule-date">Nueva Fecha</Label>
                              <Input
                                id="reschedule-date"
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reschedule-time">Nueva Hora</Label>
                              <Input
                                id="reschedule-time"
                                type="time"
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                                min="09:00"
                                max="18:00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reschedule-reason">Motivo de reprogramación</Label>
                              <Textarea
                                id="reschedule-reason"
                                placeholder="Indica el motivo de la reprogramación..."
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={handleRescheduleRequest}
                                disabled={!rescheduleDate || !rescheduleTime || !rescheduleReason.trim()}
                                className="flex-1"
                              >
                                Solicitar Reprogramación
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedAppointment(null);
                                  setRescheduleDate('');
                                  setRescheduleTime('');
                                  setRescheduleReason('');
                                }}
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Botón Cancelar */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancelar Cita</DialogTitle>
                            <DialogDescription>
                              ¿Estás segura de que quieres cancelar esta cita?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="font-medium">{appointment.serviceName}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.date} - {appointment.time}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cancel-reason">Motivo de cancelación</Label>
                              <Textarea
                                id="cancel-reason"
                                placeholder="Indica el motivo de la cancelación..."
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
                                  setSelectedAppointment(null);
                                  setCancelReason('');
                                }}
                                className="flex-1"
                              >
                                Mantener Cita
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  <CommentsSection
                    comments={appointment.comments.filter(c => !c.isInternal || c.userId === user.id)}
                    targetType="appointment"
                    targetId={appointment.id}
                    currentUserRole={user.role}
                    onAddComment={onAddComment}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Citas</CardTitle>
            <CardDescription>
              Tus citas anteriores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} - {appointment.time}
                  </p>
                  {appointment.cancellationReason && (
                    <p className="text-xs text-destructive mt-1">
                      Motivo: {appointment.cancellationReason}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(appointment)}
                  {appointment.status === 'completed' && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3" />
                      <span>Calificar</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>Cliente VIP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center pt-4">
            <div className="p-4 bg-primary-pastel rounded-lg">
              <p className="text-2xl font-bold text-primary">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Citas Totales</p>
            </div>
            <div className="p-4 bg-primary-pastel rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {pastAppointments.filter(apt => apt.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Servicios Completados</p>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Salón</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Dirección</p>
              <p className="text-sm text-muted-foreground">Av. El Sol 123, San Isidro, Lima</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">+51 1 234-5678</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Horarios</p>
              <p className="text-sm text-muted-foreground">Lun - Sáb: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
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
            onNavigate('dashboard');
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
        {currentScreen === 'appointments' && renderAppointments()}
        {currentScreen === 'profile' && renderProfile()}
        {currentScreen === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
}
