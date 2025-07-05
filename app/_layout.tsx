import { Stack } from "expo-router/stack";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from "@/configs/AuthContext";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "cairo-regular": require("../assets/fonts/Cairo-Regular.ttf"),
    "cairo-black": require("../assets/fonts/Cairo-Black.ttf"),
    "cairo-bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "cairo-extraLight": require("../assets/fonts/Cairo-ExtraLight.ttf"),
    "cairo-light": require("../assets/fonts/Cairo-Light.ttf"),
    "cairo-semiBold": require("../assets/fonts/Cairo-SemiBold.ttf"),
    "logo-font": require("../assets/fonts/MajorMonoDisplay-Regular.ttf"),
    "clock-font": require("../assets/fonts/Font2.ttf"),
    "digital": require("../assets/fonts/DigitalNumbers-Regular.ttf"),
    
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login/page" options={{ headerShown: false }} />
        <Stack.Screen name="login/signup" options={{ headerShown: false }} />
        <Stack.Screen name="finance/page" options={{ headerShown: false }} />
        <Stack.Screen name="landing/page" options={{ headerShown: false }} />
        <Stack.Screen name="login/forgotPass" options={{ headerShown: false }} />
        <Stack.Screen name="connect/page" options={{ headerShown: false }} /> 
        <Stack.Screen name="teller/page" options={{ headerShown: false }} /> 
      </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
