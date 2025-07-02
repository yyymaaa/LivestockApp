import React from 'react';
import AppNavigator from '../navigation/AppNavigator';
import { BASE_URL } from '../config';
import { AuthProvider } from '../contexts/authenticationContext'; 

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}


