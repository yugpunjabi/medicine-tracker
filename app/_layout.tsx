import { Stack } from "expo-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Ionicons font
  useEffect(() => {
    (async () => {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    })();
  }, []);

  // Show loading spinner until fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {/* Toast container should be outside the Stack so it overlays all screens */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="action-modal"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
