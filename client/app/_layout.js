// app/_layout.js

import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/authenticationContext'; // Adjust if your context file is in a different folder

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
