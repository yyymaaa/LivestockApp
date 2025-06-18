import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, createContext, useEffect } from 'react';
import { BASE_URL } from '../config';
import axios from 'axios';

export const AuthenticationContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const register = async (email, username, password, role) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        email,
        username,
        password,
        role,
      });

      const { token } = res.data;
      setUserToken(token);
      setUserInfo(res.data);
      await AsyncStorage.setItem('userToken', token);
      return true;

    } catch (err) {
      console.log('Registration Error:', err.response?.data || err.message);
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });

      const { token } = res.data;
      setUserToken(token);
      setUserInfo(res.data);
      await AsyncStorage.setItem('userToken', token);
    } catch (err) {
      console.log('Login Error:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (err) {
      console.log('Check login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/check-username?username=${username}`);
      return res.data.available;
    } catch (error) {
      console.log('Username availability error:', error.response?.data || error.message);
      return false;
    }
  };

  const saveUsernameToBackend = async (username) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/save-username`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return res.data.success;
    } catch (err) {
      console.log('Save username error:', err.response?.data || err.message);
      return false;
    }
  };

  const saveLocationToBackend = async (latitude, longitude) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/save-location`,
      { latitude, longitude },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return res.data.success;
  } catch (err) {
    console.log('Save location error:', err.response?.data || err.message);
    throw err;
  }
};

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        register,
        login,
        logout,
        isLoading,
        userToken,
        userInfo,
        checkUsernameAvailability,
        saveUsernameToBackend,
        saveLocationToBackend,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
