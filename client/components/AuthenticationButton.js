import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const AuthenticationButton = ({ label, onPress, backgroundColor = '#29AB87'}) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AuthenticationButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1, 
    borderColor: '#29AB87', 
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});