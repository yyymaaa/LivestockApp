//client/app/(tabs)/serviceprovider/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceProviderLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            mylistings: 'list',
            profile: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#ccc',
          borderTopWidth: 0.5,
        },
        headerShown: false,
      })}
    >
      {/* This index screen will redirect but won’t appear in tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This removes it from the navigation system completely
        }}
      />

      {/* Visible and evenly spaced tabs */}
      <Tabs.Screen name="mylistings" options={{ title: 'My Listings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
