import React from 'react';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { Toaster } from './components/ui/sonner';
import { useAppLogic } from './hooks/useAppLogic';

function App() {
  const {
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
  } = useAppLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Cargando aplicación...</p>
        </div>
        <Toaster />
      </div>
    );
  }

  if (currentScreen === 'login' || !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-background">
      {currentUser.role === 'admin' ? (
        <AdminDashboard 
          user={currentUser}
          services={services}
          appointments={appointments}
          payments={payments}
          notifications={userNotifications}
          workers={workers}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentScreen={currentScreen}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onAddComment={handleAddComment}
          onCancelAppointment={handleCancelAppointment}
          onCreateService={handleCreateService}
          onEditService={handleEditService}
          onAssignWorker={handleAssignWorker}
          onConfirmPayment={handleConfirmPayment}
          onApproveReschedule={handleApproveReschedule}
        />
      ) : currentUser.role === 'worker' ? (
        <WorkerDashboard 
          user={currentUser}
          appointments={appointments.filter(apt => 
            apt.isPublished && (apt.status === 'pending' || apt.assignedWorkerId === currentUser.id)
          )}
          notifications={userNotifications}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentScreen={currentScreen}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onAddComment={handleAddComment}
          onRequestAppointment={handleRequestAppointment}
        />
      ) : (
        <ClientDashboard 
          user={currentUser}
          services={services.filter(s => s.isActive)}
          appointments={appointments.filter(apt => apt.clientId === currentUser.id)}
          notifications={userNotifications}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentScreen={currentScreen}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onAddComment={handleAddComment}
          onBookAppointment={handleBookAppointment}
          onCancelAppointment={handleClientCancelAppointment}
          onRequestReschedule={handleRequestReschedule}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;