import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../configs/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const checkCacheAndRedirect = async () => {
      if (loading) return;

      console.log("[Index] Firebase user:", user?.uid || "null");

      if (user && user.emailVerified) {
        console.log("[Index] Routing to /connect/page (user found)");
        router.replace('/connect/page');
        return;
      }

      // Check storage
      const uid = await AsyncStorage.getItem('uid');
      console.log("[Index] UID from AsyncStorage:", uid);

      if (uid) {
        router.replace('/connect/page');
      } else {
        router.replace('/landing/page');
      }
    };
    checkCacheAndRedirect();
  }, [user, loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/images/Counter.png')} style={styles.imageBackground} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#282E3E',
  },
  imageBackground: {
    width: "80%",
    height: "100%",
    resizeMode: "contain",
  },
});
