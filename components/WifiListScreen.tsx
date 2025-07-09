import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button, Alert, PermissionsAndroid, TouchableOpacity } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { database } from "../configs/firebaseConfig";
import { ref, set } from "firebase/database";

const WifiSetup = () => {
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState("");
  const [password, setPassword] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Wi-Fi Scan Permission",
          message: "This app requires location access to scan for Wi-Fi networks.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "Wi-Fi scanning requires location permission.");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Scan for Wi-Fi networks
  const scanWifi = async () => {
    try {
      const networks: any = await WifiManager.loadWifiList();
      setWifiList(networks);
    } catch (error) {
      Alert.alert("Error", "Could not scan Wi-Fi networks. Make sure location services are enabled.");
    }
  };

  // Connect to Wi-Fi and save credentials
  const connectAndSaveWifi = async (): Promise<void> => {
    if (!selectedSSID || !password) {
      Alert.alert("Enter Wi-Fi details");
      return;
    }
  
    try {
      await WifiManager.connectToProtectedSSID(selectedSSID, password, false, false);
      Alert.alert("Connected", `Connected to ${selectedSSID}, password: ${password}`);
  
      //Save credentials in Firebase Realtime Database
      if (uid) {
        await set(ref(database, `users/${uid}/wifi`), {
          ssid: selectedSSID,
          password: password,
        });
        Alert.alert("Saved", "Wi-Fi credentials stored securely.");
      } else {
        Alert.alert("Error", "User authentication required.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect. Check credentials.");
      console.error("Wi-Fi Connection Error:", error);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity  onPress={scanWifi} style={{ marginVertical: 10, borderWidth: 1, backgroundColor: "#63D2DB", borderRadius: 5,  }} >
       <Text style={{color: '#fff', textAlign: 'center', paddingVertical: 10, fontFamily: "cairo-semiBold" }}>
        Scan WiFi
       </Text>
      </TouchableOpacity>

      {wifiList.length > 0 && (
        <FlatList
        data={wifiList}
        keyExtractor={(item : any) => item.SSID}
        renderItem={({ item }) => (
          <Text style={{color: '#fff'}}  onPress={() => {
            setSelectedSSID(item.SSID);
            setWifiList([]); // Close the FlatList after selecting a Wi-Fi
          }}>{item.SSID}</Text>
        )}
      />
      )}
      
      <Text style={{color: '#fff', fontFamily: "cairo-regular"}}>Selected Wi-Fi: {selectedSSID}</Text>
      <TextInput
        placeholder="Enter Wi-Fi password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={'#fff'}
        style={{ marginVertical: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10 , color: '#fff', height: 50, fontFamily: "cairo-regular"}}
      />
      <TouchableOpacity style={{ marginVertical: 10, borderWidth: 1, backgroundColor: "#63D2DB", borderRadius: 5,  }}  onPress={connectAndSaveWifi} >
        <Text style={{color: '#fff', textAlign: 'center', paddingVertical: 10, fontFamily: "cairo-regular" }}>
          Connect & Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WifiSetup;
