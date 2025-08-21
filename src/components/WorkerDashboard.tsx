import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Bell, LogOut, Calendar, DollarSign, Clock, Eye, UserCheck, Phone, Mail } from 'lucide-react';
import { CommentsSection } from './CommentsSection';
import { NotificationCenter } from './NotificationCenter';
import nbsLogo from 'figma:asset/69e1becade91f357255960f8b8328510f71655ad.png';
import type { AppUser, Appointment, Notification } from '../App';

interface WorkerDashboardProps {
  user: AppUser;
  appointments: Appointment[];
  notifications: Notification[];
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  onMarkNotificationAsRead: (notificationId: string) => void;
  onAddComment: (targetType: 'service' | 'appointment', targetId: string, content: string) => void;
  onRequestAppointment: (appointmentId: string) => void;
}

export function WorkerDashboard({ 
  user, 
  appointments, 
  notifications,
  onLogout, 
  onNavigate, 
  currentScreen,
  onMarkNotificationAsRead,
  onAddComment,
  onRequestAppointment
}: WorkerDashboardProps) {

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const availableAppointments = appointments.filter(apt => apt.status === 'pending');
  const myAppointments = appointments.filter(apt => apt.assignedWorkerId === user.id);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const totalEarnings = myAppointments.reduce((sum, apt) => sum + apt.workerRate, 0);

  const handleRequestAppointment = (appointment: Appointment) => {
    onRequestAppointment(appointment.id);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'pending':
        return <Badge variant="secondary">Disponible</Badge>;
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
            <h1 className="text-lg font-bold">Panel Trabajadora</h1>
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
            onClick={() => onNavigate('alerts')}
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
          Disponibles
        </Button>
        <Button
          variant={currentScreen === 'my-appointments' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0"
          onClick={() => onNavigate('my-appointments')}
        >
          <User className="w-4 h-4 mr-2" />
          Mis Citas
        </Button>
        <Button
          variant={currentScreen === 'alerts' ? 'default' : 'ghost'}
          className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary flex-shrink-0 relative"
          onClick={() => onNavigate('alerts')}
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
                <p className="text-sm text-muted-foreground">Citas Disponibles</p>
                <p className="text-2xl font-bold text-primary">{availableAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-100 to-white border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganancias Totales</p>
                <p className="text-2xl font-bold text-green-600">S/ {totalEarnings}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notificaciones Recientes</span>
              <Button size="sm" onClick={() => onNavigate('alerts')}>
                Ver todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 2).map((notification) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Citas Disponibles</span>
          </CardTitle>
          <CardDescription>
            Estas son las citas publicadas por el administrador que puedes tomar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay citas disponibles en este momento</p>
            </div>
          ) : (
            availableAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-l-4 border-l-primary bg-gradient-to-r from-primary-pastel/20 to-white">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{appointment.serviceName}</h3>
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      Disponible
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Cliente:</span> {appointment.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Fecha:</span> {appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Hora:</span> {appointment.time}</span>
                    </div>
                    {appointment.clientPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span><span className="font-medium">Teléfono:</span> {appointment.clientPhone}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-accent rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Precio del servicio</p>
                        <p className="text-lg font-bold text-primary">S/ {appointment.finalPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Tu ganancia</p>
                        <p className="text-lg font-bold text-green-600">S/ {appointment.workerRate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Solicitar Cita
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Solicitud de Cita</DialogTitle>
                          <DialogDescription>
                            ¿Estás segura de que quieres solicitar esta cita?
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAppointment && (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg space-y-2">
                              <h4 className="font-medium">{selectedAppointment.serviceName}</h4>
                              <p className="text-sm">Cliente: {selectedAppointment.clientName}</p>
                              <p className="text-sm">Fecha: {selectedAppointment.date} - {selectedAppointment.time}</p>
                              <p className="text-sm">Tu ganancia: <span className="font-bold text-green-600">S/ {selectedAppointment.workerRate}</span></p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleRequestAppointment(selectedAppointment)}
                                className="flex-1"
                              >
                                Confirmar Solicitud
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles de la Cita</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">{appointment.serviceName}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p><span className="font-medium">Cliente:</span> {appointment.clientName}</p>
                              <p><span className="font-medium">Fecha:</span> {appointment.date}</p>
                              <p><span className="font-medium">Hora:</span> {appointment.time}</p>
                              <p><span className="font-medium">Precio:</span> S/ {appointment.finalPrice}</p>
                              <p><span className="font-medium">Tu ganancia:</span> S/ {appointment.workerRate}</p>
                              {appointment.clientPhone && (
                                <p><span className="font-medium">Teléfono:</span> {appointment.clientPhone}</p>
                              )}
                              {appointment.clientEmail && (
                                <p><span className="font-medium">Email:</span> {appointment.clientEmail}</p>
                              )}
                            </div>
                          </div>
                          {appointment.comments.length > 0 && (
                            <div className="border-t pt-4">
                              <CommentsSection
                                comments={appointment.comments}
                                targetType="appointment"
                                targetId={appointment.id}
                                currentUserRole={user.role}
                                onAddComment={onAddComment}
                              />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {appointment.comments.length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <CommentsSection
                        comments={appointment.comments}
                        targetType="appointment"
                        targetId={appointment.id}
                        currentUserRole={user.role}
                        onAddComment={onAddComment}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMyAppointments = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Mis Citas Asignadas</h2>
      </div>

      <div className="space-y-4">
        {myAppointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes citas asignadas</p>
              <Button 
                className="mt-4"
                onClick={() => onNavigate('dashboard')}
              >
                Ver citas disponibles
              </Button>
            </CardContent>
          </Card>
        ) : (
          myAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{appointment.serviceName}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(appointment)}
                    {getPaymentStatusBadge(appointment.paymentStatus)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span><span className="font-medium">Cliente:</span> {appointment.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span><span className="font-medium">Fecha:</span> {appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span><span className="font-medium">Hora:</span> {appointment.time}</span>
                  </div>
                  {appointment.clientPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Teléfono:</span> {appointment.clientPhone}</span>
                    </div>
                  )}
                  {appointment.clientEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span><span className="font-medium">Email:</span> {appointment.clientEmail}</span>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Precio del servicio</p>
                      <p className="text-lg font-bold text-green-700">S/ {appointment.finalPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tu ganancia</p>
                      <p className="text-lg font-bold text-green-600">S/ {appointment.workerRate}</p>
                    </div>
                  </div>
                </div>

                {appointment.status === 'reschedule-requested' && appointment.requestedDate && (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="font-medium text-yellow-700">Cliente solicitó reprogramación:</p>
                    <p className="text-sm">Nueva fecha: {appointment.requestedDate} - {appointment.requestedTime}</p>
                    {appointment.rescheduleReason && (
                      <p className="text-sm">Motivo: {appointment.rescheduleReason}</p>
                    )}
                  </div>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles Completos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalles Completos de la Cita</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{appointment.serviceName}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="font-medium">Cliente:</span> {appointment.clientName}</p>
                          <p><span className="font-medium">Fecha:</span> {appointment.date}</p>
                          <p><span className="font-medium">Hora:</span> {appointment.time}</p>
                          <p><span className="font-medium">Precio:</span> S/ {appointment.finalPrice}</p>
                          <p><span className="font-medium">Tu ganancia:</span> S/ {appointment.workerRate}</p>
                          <p><span className="font-medium">Estado:</span> {appointment.status}</p>
                          {appointment.clientPhone && (
                            <p><span className="font-medium">Teléfono:</span> {appointment.clientPhone}</p>
                          )}
                          {appointment.clientEmail && (
                            <p><span className="font-medium">Email:</span> {appointment.clientEmail}</p>
                          )}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <CommentsSection
                          comments={appointment.comments}
                          targetType="appointment"
                          targetId={appointment.id}
                          currentUserRole={user.role}
                          onAddComment={onAddComment}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <CommentsSection
                  comments={appointment.comments}
                  targetType="appointment"
                  targetId={appointment.id}
                  currentUserRole={user.role}
                  onAddComment={onAddComment}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
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
          <CardDescription>Trabajadora - {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{myAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Citas Asignadas</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                S/ {totalEarnings}
              </p>
              <p className="text-sm text-muted-foreground">Ganancias Totales</p>
            </div>
          </div>

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

          <Button variant="outline" className="w-full">
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Resumen de ganancias */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Ganancias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{appointment.serviceName}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.clientName} - {appointment.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">S/ {appointment.workerRate}</p>
                {getPaymentStatusBadge(appointment.paymentStatus)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <div className="p-4">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={onMarkNotificationAsRead}
        onNavigateToRelated={(relatedType, relatedId) => {
          if (relatedType === 'appointment') {
            onNavigate('my-appointments');
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
        {currentScreen === 'my-appointments' && renderMyAppointments()}
        {currentScreen === 'profile' && renderProfile()}
        {currentScreen === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
}