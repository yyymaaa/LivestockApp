import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FarmerDashboard from '../../screens/farmer/FarmerDashboard';
import FarmerSearch from '../../screens/farmer/FarmerSearch';
import FarmerMyListings from '../../screens/farmer/FarmerMyListings';
import FarmerProfile from '../../screens/farmer/FarmerProfile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function FarmerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={FarmerDashboard}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Search"
        component={FarmerSearch}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="MyListings"
        component={FarmerMyListings}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={FarmerProfile}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
