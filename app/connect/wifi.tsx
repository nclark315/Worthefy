import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { database } from "../../configs/firebaseConfig";
import { ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
const WifiModal = () => {
  const [visible, setVisible] = useState(true);
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState("");
  const [password, setPassword] = useState("");
  const [selectedBSSID, setSelectedBSSID] = useState("");


  useEffect(() => {
    if (visible) requestPermissions();
  }, [visible]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Wi-Fi Permission",
            message: "App needs access to scan Wi-Fi networks",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Cannot scan without location permission.");
        }
      } catch (error) {
        console.warn("Permission Error:", error);
      }
    }
  };

  const scanWifi = async () => {
    try {
      const networks: any = await WifiManager.loadWifiList();
      setWifiList(networks);
    } catch (error) {
      Alert.alert("Error", "Wi-Fi scan failed. Make sure location is enabled.");
    }
  };

  const handleSave = async () => {
    if (!selectedBSSID || !password) {
      Alert.alert("Missing Info", "Please select a Wi-Fi and enter a password.");
      return;
    }
  
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not logged in", "Please log in first");
      return;
    }
  
    const uid = user.uid;
  
    try {
      await set(ref(database, `users/${uid}/wifi`), {
        selectedBSSID,
        password,
      });
      Alert.alert("Saved", "Wi-Fi credentials saved.");
      setVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save to Firebase.");
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Wi-Fi Setup</Text>

          <TouchableOpacity onPress={scanWifi} style={styles.button}>
            <Text style={styles.buttonText}>Scan WiFi</Text>
          </TouchableOpacity>

          {wifiList.length > 0 && (
            <FlatList
              data={wifiList}
              keyExtractor={(item: any) => item.SSID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSSID(item.SSID);
                    setSelectedBSSID(item.BSSID); 
                    setWifiList([]);
                  }}
                >
                  <Text style={styles.listItem}>{item.SSID}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={styles.label}>Selected Wi-Fi: {selectedSSID || "None"}</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Save & Send </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={{ color: "#ff4d4d", textAlign: "center", marginTop: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WifiModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#282E3E",
    padding: 20,
    
  },
  modalContainer: {
    backgroundColor: "#282E3E",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#9B9B9B',
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "cairo-semiBold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontFamily: "cairo-regular",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    padding: 10,
    color: "#fff",
    fontFamily: "cairo-regular",
    height: 50,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4099D099",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "cairo-semiBold",
  },
  listItem: {
    color: "#fff",
    paddingVertical: 8,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    fontFamily: "cairo-regular",
  },
});
