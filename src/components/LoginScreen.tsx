import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

const nbsLogo = '/assets/logo2.png';

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

    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('cliente.google@nbs.com', 'google_auth_token');
      setIsLoading(false);
    }, 2000);
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
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

        {/* ... resto del código igual */}
      </div>
    </div>
  );
}
