import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, Send, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Comment, User } from '../types';

interface CommentsSectionProps {
  targetType: 'service' | 'appointment';
  targetId: string;
  currentUser: User;
  onAddComment: (targetType: 'service' | 'appointment', targetId: string, content: string, isInternal?: boolean) => Promise<void>;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  targetType,
  targetId,
  currentUser,
  onAddComment
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c927e83f`;

  // Función para cargar comentarios
  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`${serverUrl}/comments/${targetType}/${targetId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedComments: Comment[] = (data.comments || []).map((comment: any) => ({
          id: comment.id,
          targetType: comment.target_type,
          targetId: comment.target_id,
          userId: comment.user_id,
          userName: comment.user_name,
          userRole: comment.user_role,
          content: comment.content,
          isInternal: comment.is_internal,
          createdAt: comment.created_at
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await onAddComment(targetType, targetId, newComment.trim(), isInternal);
      setNewComment('');
      setIsInternal(false);
      
      // Recargar comentarios después de agregar uno nuevo
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'worker':
        return 'secondary';
      case 'client':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'worker':
        return 'Trabajadora';
      case 'client':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de comentarios */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {isLoadingComments ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando comentarios...</p>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay comentarios todavía
            </p>
          ) : (
            comments
              .filter(comment => currentUser.role === 'admin' || !comment.isInternal)
              .map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <Badge variant={getRoleBadgeVariant(comment.userRole)} className="text-xs">
                        {getRoleLabel(comment.userRole)}
                      </Badge>
                      {comment.isInternal && (
                        <Badge variant="destructive" className="text-xs">
                          Interno
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
          )}
        </div>

        {/* Formulario para nuevo comentario */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="min-h-20"
            disabled={isLoading}
          />
          
          {currentUser.role === 'admin' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internal-comment"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                disabled={isLoading}
                className="rounded border-gray-300"
              />
              <label htmlFor="internal-comment" className="text-sm text-muted-foreground">
                Comentario interno (solo visible para administradores)
              </label>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!newComment.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar comentario
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};