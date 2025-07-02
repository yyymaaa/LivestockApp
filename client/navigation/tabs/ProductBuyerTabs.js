import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductBuyerDashboard from '../screens/productbuyer/ProductBuyerDashboard';
import ProductBuyerSearch from '../screens/productbuyer/ProductBuyerSearch';
import ProductBuyerProfile from '../screens/productbuyer/ProductBuyerProfile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function ProductBuyerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={ProductBuyerDashboard}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Search"
        component={ProductBuyerSearch}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProductBuyerProfile}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
