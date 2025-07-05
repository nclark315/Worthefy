import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity,PermissionsAndroid, Image,Modal,  Alert, StatusBar } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useRouter } from 'expo-router';
import { Linking } from "react-native";
import DeviceModal from "../../components/DeviceConnectionModal";
import useBLE from "../../lib/useBLE";
import { database } from "../../configs/firebaseConfig";
import { ref, set } from "firebase/database";
import WifiManager from "react-native-wifi-reborn";
import WifiModal from './wifi'

const page = () => {
  const router = useRouter();
  const [wifiModalVisible, setWifiModalVisible] = useState(false);
  const [selectedSSID, setSelectedSSID] = useState("");
  const [password, setPassword] = useState("");
  const [uid, setUid] = useState("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);

  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    disconnectFromDevice,
    resetESP32
  } = useBLE();
   

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  useEffect(() => {
    setWifiModalVisible(true);
  }, []);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };  

  useEffect(() => {
    if (connectedDevice) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [connectedDevice]);

  const getPermissions = async () => {
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

  const checkCurrentConnection = async (): Promise<boolean> => {
    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      if (currentSSID) {
        setSelectedSSID(currentSSID);
  
        if (uid && password) {
          await set(ref(database, `users/${uid}/wifi`), {
            ssid: currentSSID,
            password: password,
          });
          Alert.alert("Wi-Fi Saved", `SSID: ${currentSSID} stored successfully.`);
          return true;
        } else {
          console.log("Missing UID or password.");
          return false;
        }
      } else {
        console.log("No Wi-Fi connected.");
        return false;
      }
    } catch (error) {
      console.error("Wi-Fi Check Error:", error);
      return false;
    }
  };
  
  

  useEffect(() => {
    const init = async () => {
      await getPermissions();
      const isConnected = await checkCurrentConnection();
  
      // Show Wi-Fi modal if not connected or can't save
      if (!isConnected) {
        setWifiModalVisible(true);
      }
    };
  
    init();
  }, []);
  
  
  return ( 
    <>
    <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
    <View style={styles.container}>

      <View style={styles.topView}>
        <TouchableOpacity onPress={() => router.back()} >
          <FontAwesome size={28} name="angle-left" color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.title}>Add a device</Text>
        <Text style={{color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular',}}>By adding a device, you agree to Worthefy’s 
            <Text style={{color: '#4099D0', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('https://www.privacypolicies.com/live/a5c6fa71-5807-4396-a180-0233ec623b79')}>Terms of service</Text>. See our 
            <Text style={{color: '#4099D0', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('https://www.privacypolicies.com/live/a5c6fa71-5807-4396-a180-0233ec623b79')}>Privacy Notice</Text> for additional information.</Text>

      </View>

      
      
     <View style={styles.View}>
        
        <TouchableOpacity style={styles.box} onPress={connectedDevice ? disconnectFromDevice : openModal} >
          <Image source={require('../../assets/images/clock.png')} style={styles.image} />
          <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start',}}>
            <Text style={{fontSize: 18, fontFamily: 'cairo-regular', color: '#fff'}}>WORTHEFY</Text>
            <Text style={{fontSize: 12, fontFamily: 'cairo-regular', color: '#9B9B9B', width: 180}}>
                {connectedDevice ? "Device is connected" : "Connect Automatically to the Worthefy easily from anywhere."}</Text>
          </View>
          
          <FontAwesome name={connectedDevice ? "check" : "plus"} size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity disabled={disabled}  onPress={() => router.push('/(tabs)')} style={{width: '100%', height: 50, backgroundColor: disabled ? '#9B9B9B' : '#4099D0', justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 8}}>
          <Text style={{color: '#fff', fontSize: 16, fontFamily: 'cairo-regular',}}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={disabled}  onPress={resetESP32} style={{width: '100%', height: 50, backgroundColor: disabled ? '#9B9B9B' : '#4099D0', justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 8}}>
          <Text style={{color: '#fff', fontSize: 16, fontFamily: 'cairo-regular',}}>Reset ESP32</Text>
        </TouchableOpacity>

        <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
        />

      </View>

      {wifiModalVisible && (
        <WifiModal />
      )}

    </View>
    </>
  )
}

export default page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282E3E',
    height: '100%'
  },

  topView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop :30
  },
  title: {
    fontSize: 28,
    textAlign: 'auto',
    marginTop: 15,
    fontFamily: 'cairo-bold',
    color: '#fff',
  },
  View: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height:'90%',
    marginTop: 30,
    paddingHorizontal: 15,
    gap: 25
  },
  box:{
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#282E3E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#9B9B9B',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  image: {
    width: 70,
    height: 50,
    resizeMode: 'contain'
  },
  wifiButton: {
    backgroundColor: "#63D2DB",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
   
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
});

