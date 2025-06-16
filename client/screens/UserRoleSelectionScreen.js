import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserRoleSelectionScreen = () => {
  const navigation = useNavigation();
  const options = [
    {
      title: 'Selling Service',
      subtitle: "I'd like to grow, advertise, and offer my services.",
      action: () => navigation.navigate('Registration', { role: 'serviceProvider' }),
    },
    {
      title: 'Find a Service and Selling products',
      subtitle: "I'm looking for a service provider and I want to sell my livestock products.",
      action: () => navigation.navigate('Registration', { role: 'farmer' }),
    },
    {
      title: 'Find livestock products',
      subtitle: "I'm looking for a farmer to supply livestock products.",
      action: () => navigation.navigate('Registration', { role: 'buyer' }),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Prompt Text */}
        <Text style={styles.promptText}>What best describes you?</Text>

        {/* Option Cards */}
        <View style={styles.cardsContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={opt.action}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>
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
    marginTop: 32,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  signInButton: {
    backgroundColor: '#3366FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserRoleSelectionScreen;
