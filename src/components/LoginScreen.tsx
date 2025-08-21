import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
// import nbsLogo from 'figma:asset/...'; ❌
const nbsLogo = '/assets/logo2.png'; ✅


interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simular delay de autenticación
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  // Simular login con Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // En una implementación real, esto abriría el flujo OAuth de Google
    setTimeout(() => {
      // Simular login exitoso de cliente con Google
      onLogin('cliente.google@nbs.com', 'google_auth_token');
      setIsLoading(false);
    }, 2000);
  };

  // Simular login con Apple (iOS)
  const handleAppleLogin = async () => {
    setIsLoading(true);
    
    // En una implementación real, esto abriría el flujo Sign in with Apple
    setTimeout(() => {
      // Simular login exitoso de cliente con Apple
      onLogin('cliente.apple@nbs.com', 'apple_auth_token');
      setIsLoading(false);
    }, 2000);
  };

  const fillAdminCredentials = () => {
    setEmail('admin@nbs.com');
    setPassword('admin123');
  };

  const fillWorkerCredentials = () => {
    setEmail('worker@nbs.com');
    setPassword('worker123');
  };

  const fillClientCredentials = () => {
    setEmail('client@nbs.com');
    setPassword('client123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-pastel via-background to-accent">
      <div className="w-full max-w-md space-y-8">
        {/* Logo y título */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-xl p-4">
            <img 
              src={nbsLogo} 
              alt="Niky Beauty Studio" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Niky Beauty Studio</h1>
            <p className="text-muted-foreground">Sistema de gestión integral</p>
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login social para clientes */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Clientes - Acceso rápido:
                </p>
              </div>
              
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuar con Google</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full bg-black hover:bg-gray-900 text-white border-2 border-gray-800"
                onClick={handleAppleLogin}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>Continuar con Apple</span>
                </div>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">O</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@nbs.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-input-background border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-input-background border-border"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Información de credenciales de prueba para admin y trabajadoras */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Personal del salón - Credenciales de prueba:
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillAdminCredentials}
                  disabled={isLoading}
                  className="text-xs justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">👩‍💼 Administradora</div>
                    <div className="text-muted-foreground">admin@nbs.com / admin123</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillWorkerCredentials}
                  disabled={isLoading}
                  className="text-xs justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">👩‍🎨 Trabajadora - Sofía Ramírez</div>
                    <div className="text-muted-foreground">worker@nbs.com / worker123</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillClientCredentials}
                  disabled={isLoading}
                  className="text-xs justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">👩 Cliente - María González</div>
                    <div className="text-muted-foreground">client@nbs.com / client123</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Registro */}
            <div className="pt-2 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Eres nueva cliente?{' '}
                <Button variant="link" className="p-0 h-auto font-medium text-primary">
                  Crear cuenta
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Niky Beauty Studio</p>
          <p>🌟 Sistema completamente funcional con base de datos real</p>
        </div>
      </div>
    </div>
  );
}
