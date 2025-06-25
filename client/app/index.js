//client/app/index.js
import { Redirect } from 'expo-router';

export default function AppIndex() {
  //return <Redirect href="/(tabs)/farmer" />;

  //return <Redirect href="/(tabs)/serviceprovider" />;

  return <Redirect href="/(tabs)/productbuyer" />;
}

/*import React, { useEffect, useState } from 'react';
import { Redirect, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppIndex() {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);

          // We are Redirecting based role
          if ( user.role === 'Farmer') {
            setRedirectPath('/(tabs)/farmer');
          } else {
            setRedirectPath('/(tabs)/serviceProvider'); 
          }
        } else {
          //  No user found, send to login
          setRedirectPath('/login');
        }
      } catch (error) {
        console.error('Error checking user in AsyncStorage:', error);
        setRedirectPath('/login');
      }
    };

    checkUser();
  }, []);

  // Waiting until redirectPath is set
  if (!redirectPath) {
    return null; // or a loading screen
  }

  return <Redirect href={redirectPath} />;
}
*/