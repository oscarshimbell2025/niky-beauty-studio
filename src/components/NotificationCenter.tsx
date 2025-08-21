import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, BellRing, Check, Eye, MessageCircle, Calendar, DollarSign } from 'lucide-react';
import type { Notification } from '../App';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onNavigateToRelated?: (relatedType: string, relatedId: string) => void;
}

export function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onNavigateToRelated 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string, relatedType?: string) => {
    if (relatedType === 'appointment') return <Calendar className="w-4 h-4" />;
    if (relatedType === 'payment') return <DollarSign className="w-4 h-4" />;
    
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-green-600" />;
      case 'warning': return <MessageCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <Bell className="w-4 h-4 text-red-600" />;
      default: return <BellRing className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </h2>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              notifications.forEach(n => {
                if (!n.isRead) onMarkAsRead(n.id);
              });
            }}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 ${
                !notification.isRead 
                  ? 'border-l-4 border-l-primary bg-primary-pastel/30' 
                  : 'border-l-4 border-l-muted'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type, notification.relatedType)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {notification.relatedId && onNavigateToRelated && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigateToRelated(
                              notification.relatedType || 'appointment',
                              notification.relatedId!
                            )}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        )}
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Marcar leída
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}