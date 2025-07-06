import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';

import AuthenticationButton from '../../components/AuthenticationButton';


const UserRoleSelectionScreen = () => {
  const router = useRouter();

  const options = [
    {
      title: 'Selling Service',
      subtitle: "I'd like to grow, advertise, and offer my services.",
      action: () =>
        router.push({
          pathname: '/register/RegistrationScreen',
          params: { role: 'Livestock Service Provider' },
        }),
    },
    {
      title: 'Find a Service and Selling products',
      subtitle:
        "I'm looking for a service provider and I want to sell my livestock products.",
      action: () =>
        router.push({
          pathname: '/register/RegistrationScreen',
          params: { role: 'Farmer' },
        }),
    },
    {
      title: 'Find livestock products',
      subtitle: "I'm looking for a farmer to supply livestock products.",
      action: () =>
        router.push({
          pathname: '/register/RegistrationScreen',
          params: { role: 'Livestock Product Buyer' },
        }),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.promptText}>What best describes you?</Text>

        <View style={styles.cardsContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={opt.action}
              style={styles.card}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomContainer}>
        <AuthenticationButton
          label="Sign Up"
          onPress={() => router.push('../register/RegistrationScreen')}
        />
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  promptText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#29AB87',
    marginTop: 75,
  },
  cardsContainer: {
    marginTop: 24,
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  bottomContainer: {
  marginBottom: 75, 
  },
});

export default UserRoleSelectionScreen;
