import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ServiceProviderDashboard from '../screens/serviceprovider/ServiceProviderDashboard';
import ServiceProviderSearch from '../screens/serviceprovider/ServiceProviderSearch';
import ServiceProviderMyListings from '../screens/serviceprovider/ServiceProviderMyListings';
import ServiceProviderProfile from '../screens/serviceprovider/ServiceProviderProfile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function ServiceProviderTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={ServiceProviderDashboard}
        options= {{ 
            href: null, // This removes it from the navigation system completely
        }}
      />
      <Tab.Screen
        name="Search"
        component={ServiceProviderSearch}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="MyListings"
        component={ServiceProviderMyListings}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="construct" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ServiceProviderProfile}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
