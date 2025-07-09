import React from "react";
import { View, Button, Alert, Text } from "react-native";
import { useTellerConnect } from "teller-connect-react";


export default function Teller() {
  const { open, ready } = useTellerConnect({
    applicationId: "app_peln2crirofp6upddo000",
    onSuccess: (enrollment) => {
      // enrollment: { enrollment_id, access_token, institution }
      console.log("Success:", enrollment);
      Alert.alert("Bank Connected");
    },
    onExit: () => {
      console.log("User exited Teller Connect");
    },
    onFailure: (error) => {
      console.error("Teller Error:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button
        title="Connect Bank Account"
        onPress={() => open()}
      />
      <Text>Connect Bank Account</Text>
    </View>
  );
}
