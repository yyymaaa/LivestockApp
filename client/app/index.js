//client/app/index.js  entry point of the app
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppIndex() {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const loadTestUser = async () => {
      try {
        const response = await fetch('http://192.168.0.100:5000/api/user/test-user'); 
        const user = await response.json();

      
        await AsyncStorage.setItem('user', JSON.stringify(user));

        
        setRedirectPath('/(tabs)/farmer');
      } catch (err) {
        console.error('Could not fetch test user:', err);
        setRedirectPath('/login'); 
      }
    };

    loadTestUser();
  }, []);

  if (redirectPath) {
    return <Redirect href={redirectPath} />;
  }

  return null;
}


/*import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserRoleSelectionScreen from './register/UserRoleSelectionScreen';

export default function AppIndex() {
  const [redirectPath, setRedirectPath] = useState(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');

        // No user in storage? New user → show role selection screen
        if (!userData) {
          setCheckingStorage(false);
          return;
        }

        const user = JSON.parse(userData);

        // Incomplete onboarding? Guide them step-by-step
        if (!user.username) {
          setRedirectPath('/register/UserNameScreen');
        } else if (!user.latitude || !user.longitude) {
          setRedirectPath('/register/LocationPermissionScreen');
        } else {
          // Role-based redirection
          const role = user.role?.toLowerCase();
          if (role === 'farmer') {
            setRedirectPath('/(tabs)/farmer');
          } else if (role === 'serviceprovider') {
            setRedirectPath('/(tabs)/serviceprovider');
          } else if (role === 'buyer' || role === 'productbuyer') {
            setRedirectPath('/(tabs)/productbuyer');
          } else {
            // Role unknown? Send to login
            setRedirectPath('/login');
          }
        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
        setRedirectPath('/login');
      }
    };

    checkUser();
  }, []);

  // Handle redirection if ready
  if (redirectPath) {
    return <Redirect href={redirectPath} />;
  }

  // While checking storage, don't show anything yet
  if (checkingStorage) {
    return null;
  }

  // New user flow → choose role
  return <UserRoleSelectionScreen />;
}
*/