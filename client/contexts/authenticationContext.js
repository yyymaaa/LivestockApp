import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, createContext, useEffect } from 'react';
import Api from '../Api/api';
import { BASE_URL } from '../config';

export const AuthenticationContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const register = async (email, password, role, username = null) => {
    setIsLoading(true);
    try {
      console.log("Registering with:", { email, username, password, role });
      const res = await Api.post(`/auth/register`, {
        email,
        password,
        role,
        username,
      });

      const { token, user } = res.data;
      setUserToken(token);
      setUserInfo(user);
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
      const res = await Api.post(`/auth/login`, { email, password });
      const { token, user } = res.data;
      setUserToken(token);
      setUserInfo(user);
      await AsyncStorage.setItem('userToken', token);
      return user;
    } catch (err) {
      console.log('Login Error:', err.response?.data || err.message);
      return null;
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
      console.log('Token found in storage:', token ? 'YES' : 'NO');

      if (token) {
        const success = await fetchUserProfile(token);
        if (success) {
          setUserToken(token);
        } else {
          await AsyncStorage.removeItem('userToken');
          setUserToken(null);
          setUserInfo(null);
        }
      }
    } catch (err) {
      console.log('Check login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const res = await Api.get('/user/user-details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(res.data);
      return true;
    } catch (err) {
      console.log('Profile fetch error:', err.response?.data || err.message);
      return false;
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const res = await Api.get(`/user/check-username/${username}`);
      return res.data.available;
    } catch (error) {
      console.log('Username availability error:', error.response?.data || error.message);
      return false;
    }
  };

  const saveUsernameToBackend = async (username) => {
    try {
      const res = await Api.post(
        `/user/save-username`,
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
      const res = await Api.post(
        `/user/save-location`,
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
