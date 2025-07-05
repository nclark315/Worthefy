import React from "react";
import { View, Button, Alert, Platform } from "react-native";
import * as Linking from "expo-linking";

const OpenPlaid = () => {
  const openInGoogleChrome = async () => {
    const url = "https://plaid-11.vercel.app/";
    const googleChromeScheme = `googlechrome://${url.replace("https://", "")}`;

    if (Platform.OS === "android") {
      Linking.openURL(url);
    } else if (Platform.OS === "ios") {
      const supported = await Linking.canOpenURL(googleChromeScheme);
      if (supported) {
        Linking.openURL(googleChromeScheme);
      } else {
        Alert.alert("Google Chrome is not installed, opening in default browser.");
        Linking.openURL(url);
      }
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open in Google Chrome" onPress={openInGoogleChrome} />
    </View>
  );
};

export default OpenPlaid;