import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import WifiSetup from "@/components/WifiListScreen";

const Page = () => {
  const router = useRouter();
  const [wifiModalVisible, setWifiModalVisible] = useState(false);

  const handleSignUp = () => {
    router.push('/login/signup');
  };

  const handleLogin = () => {
    router.push('/login/page');
  };

  return (
    <>
      <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
      <View style={styles.container}>
        <Text onPress={handleLogin} style={styles.skip}>Skip</Text>

        {/* WiFi Setup Button */}
        {/* <TouchableOpacity style={styles.wifiButton} onPress={() => setWifiModalVisible(true)}>
          <Text style={styles.wifiButtonText}>Set up Wi-Fi</Text>
        </TouchableOpacity> */}

        {/* Wi-Fi Setup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={wifiModalVisible}
          onRequestClose={() => setWifiModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setWifiModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <WifiSetup />
            </View>
          </View>
        </Modal>

        <Text style={styles.logo}>WORTHEFY</Text>
        <Text style={styles.description}>
          Consolidate all your financial accounts into a single, powerful dashboard.
        </Text>

        <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp}>
          <Text style={styles.createAccountText}>Create an account</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account? <Text onPress={handleLogin} style={styles.loginLink}>Login</Text>
        </Text>

        <View style={styles.orContainer}>
          <View style={styles.line}></View>
          <Text style={styles.orText}>or continue with</Text>
          <View style={styles.line}></View>
        </View>

        <View style={styles.socialButtons}>
          <FontAwesome name="google" size={24} color="white" style={styles.icon} />
          <FontAwesome name="apple" size={24} color="white" style={styles.icon} />
        </View>
      </View>
    </>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282E3E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  skip: {
    position: 'absolute',
    top: 50, 
    right: 20,
    color: "#53A8E2",
    fontSize: 14,
    fontFamily: "cairo-regular",
  },
  wifiButton: {
    backgroundColor: "#63D2DB",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  wifiButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "cairo-bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#282E3E",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
  },
  logo: {
    fontSize: 34,
    color: "#63D2DB",
    fontFamily: "digital",
    marginBottom: 10,
  },
  description: {
    color: "#9B9B9B",
    textAlign: "center",
    fontFamily: "cairo-regular",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  createAccountButton: {
    backgroundColor: "#53A8E2",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  createAccountText: {
    color: "white",
    fontSize: 16,
    fontFamily: "cairo-bold",
  },
  loginText: {
    color: "white",
    fontFamily: "cairo-regular",
  },
  loginLink: {
    color: "#53A8E2",
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  orText: {
    color: "#9B9B9B",
    marginVertical: 10,
    fontFamily: "cairo-regular",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 15,
  },
  icon: {
    backgroundColor: "#1E2A40",
    borderWidth: 1,
    borderColor: "#9B9B9B",
    paddingVertical : 10,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: "#9B9B9B",
    marginTop: 5,
  },
});
