import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthenticationContext } from '../contexts/authenticationContext';

import FarmerTabs from './tabs/FarmerTabs';
import ProductBuyerTabs from './tabs/ProductBuyerTabs';
import ServiceProviderTabs from './tabs/ServiceProviderTabs';

import UserRoleSelectionScreen from '../screens/UserRoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import UsernameScreen from '../screens/UsernameScreen';
import LocationPermissionScreen from '../screens/LocationPermissionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading, userInfo } = useContext(AuthenticationContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#29AB87" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <>
          <Stack.Screen 
            name="UserRoleSelection" 
            component={UserRoleSelectionScreen} 
          />
          <Stack.Screen 
            name="Registration" 
            component={RegistrationScreen} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          />
        </>
      ) : !userInfo?.username ? (
        <Stack.Screen 
          name="Username" 
          component={UsernameScreen} 
        />
      ) : !userInfo?.latitude ? (
        <Stack.Screen 
          name="LocationPermission" 
          component={LocationPermissionScreen} 
        />
      ) : userInfo?.role?.toLowerCase() === 'farmer' ? (
        <Stack.Screen 
          name="FarmerTabs" 
          component={FarmerTabs} 
        />
      ) : userInfo?.role?.toLowerCase() === 'serviceprovider' ? (
        <Stack.Screen 
          name="ServiceProviderTabs" 
          component={ServiceProviderTabs} 
        />
      ) : userInfo?.role?.toLowerCase() === 'buyer' ? (
        <Stack.Screen 
          name="ProductBuyerTabs" 
          component={ProductBuyerTabs} 
        />
      ) : (
        <Stack.Screen
          name="UnknownRole"
          component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Unknown user role: {userInfo?.role}</Text>
            </View>
          )}
        />
      )}
    </Stack.Navigator>
  );
}