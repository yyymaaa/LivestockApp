import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0.5, borderTopColor: '#ccc' },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            'farmer/index': 'home',
            'farmer/search': 'search',
            'farmer/mylistings': 'list',
            'farmer/profile': 'person',
          };
          return <Ionicons name={icons[route.name] || 'alert'} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="farmer/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="farmer/search" options={{ title: 'Search' }} />
      <Tabs.Screen name="farmer/mylistings" options={{ title: 'My Listings' }} />
      <Tabs.Screen name="farmer/profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
