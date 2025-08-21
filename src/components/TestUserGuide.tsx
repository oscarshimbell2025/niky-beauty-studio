import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, User, UserCheck, Crown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TestUser {
  role: string;
  name: string;
  email: string;
  password: string;
  description: string;
  icon: React.ReactNode;
  badgeVariant: "default" | "secondary" | "outline";
}

export const TestUserGuide: React.FC = () => {
  const testUsers: TestUser[] = [
    {
      role: 'Administrador',
      name: 'Administrador NBS',
      email: 'admin@nbs.com',
      password: 'admin123',
      description: 'Puede crear servicios, gestionar citas, asignar trabajadoras y ver reportes completos.',
      icon: <Crown className="h-4 w-4" />,
      badgeVariant: 'default'
    },
    {
      role: 'Trabajadora',
      name: 'María González',
      email: 'maria@nbs.com',
      password: 'maria123',
      description: 'Puede ver citas disponibles, solicitar citas y gestionar sus servicios asignados.',
      icon: <UserCheck className="h-4 w-4" />,
      badgeVariant: 'secondary'
    },
    {
      role: 'Trabajadora',
      name: 'Sofía Martínez',
      email: 'sofia@nbs.com',
      password: 'sofia123',
      description: 'Puede ver citas disponibles, solicitar citas y gestionar sus servicios asignados.',
      icon: <UserCheck className="h-4 w-4" />,
      badgeVariant: 'secondary'
    },
    {
      role: 'Cliente',
      name: 'Ana Rodríguez',
      email: 'ana@cliente.com',
      password: 'ana123',
      description: 'Puede reservar servicios, ver sus citas y gestionar su perfil personal.',
      icon: <User className="h-4 w-4" />,
      badgeVariant: 'outline'
    },
    {
      role: 'Cliente',
      name: 'Laura Fernández',
      email: 'laura@cliente.com',
      password: 'laura123',
      description: 'Puede reservar servicios, ver sus citas y gestionar su perfil personal.',
      icon: <User className="h-4 w-4" />,
      badgeVariant: 'outline'
    }
  ];

  const copyCredentials = (email: string, password: string) => {
    const credentials = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard.writeText(credentials);
    toast.success('Credenciales copiadas al portapapeles');
  };

  const appUrl = 'https://niky-beauty-studio.vercel.app'; // Cambiar por tu URL real

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">
          🌸 Niky Beauty Studio - Usuarios de Prueba
        </h1>
        <p className="text-muted-foreground">
          Aplicación móvil para gestión de salón de belleza con tres roles: Administrador, Trabajadoras y Clientes
        </p>
        
        <div className="flex items-center justify-center gap-4 p-4 bg-primary-pastel rounded-lg">
          <span className="font-medium">🔗 Link de la aplicación:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(appUrl);
              toast.success('Link copiado al portapapeles');
            }}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            {appUrl}
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {testUsers.map((user, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {user.icon}
                  {user.name}
                </CardTitle>
                <Badge variant={user.badgeVariant}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {user.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-input-background rounded-lg">
                  <div>
                    <p className="font-medium text-sm">📧 {user.email}</p>
                    <p className="font-medium text-sm">🔒 {user.password}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCredentials(user.email, user.password)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <strong>Cómo probar:</strong> Abre el link, ingresa el email y password, explora las funciones de este rol.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📱 Instrucciones de Uso
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>En móvil:</strong> Abre el link en Chrome/Safari, te preguntará si quieres "Instalar" la app</p>
          <p>• <strong>En desktop:</strong> Abre el link en cualquier navegador</p>
          <p>• <strong>Funcionalidades:</strong> Reservar citas, gestionar servicios, asignar trabajadoras, ver reportes</p>
          <p>• <strong>Datos:</strong> Todos los datos son de prueba y se guardan en base de datos real</p>
        </div>
      </div>

      <div className="bg-primary-pastel p-4 rounded-lg">
        <h4 className="font-semibold text-primary mb-2">🎯 Flujo de Prueba Recomendado:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li><strong>Cliente:</strong> Reserva una cita para probar el proceso de reserva</li>
          <li><strong>Administrador:</strong> Asigna una trabajadora a la cita creada</li>
          <li><strong>Trabajadora:</strong> Ve la cita asignada y gestiona el servicio</li>
          <li><strong>Administrador:</strong> Confirma el pago y revisa reportes</li>
        </ol>
      </div>
    </div>
  );
};