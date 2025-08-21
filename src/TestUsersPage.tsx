import React from 'react';
import { TestUserGuide } from './components/TestUserGuide';

// PÁGINA TEMPORAL PARA COMPARTIR CREDENCIALES DE USUARIOS DE PRUEBA
// Puedes usar esta página para enviar a las personas que van a probar la app

function TestUsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <TestUserGuide />
    </div>
  );
}

export default TestUsersPage;