
import { useMemo, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { useEffect } from "react";
import * as ExpoDevice from "expo-device";
import { getAuth } from "firebase/auth";
import {
  BleError,
  BleManager,
  Device,
  DeviceId,
  State
  
} from "react-native-ble-plx";
import { database } from "../configs/firebaseConfig";
import { ref, get, set } from "firebase/database";

import base64 from "react-native-base64";

const DATA_SERVICE_UUID = "b2bbc642-46da-11ed-b878-0242ac120002";
const CHARACTERISTIC_UUID = "c9af9c76-46de-11ed-b878-0242ac120002";

interface BluetoothLowEnergyApi {
  scanForPeripherals: () => void;
  requestPermissions: () => Promise<boolean>;
  allDevices: Device[];
  connectToDevice: (deviceId: Device) => Promise<void>;
  connectedDevice: Device | null;
  disconnectFromDevice: () => void;
  sendDataToDevice: (device: Device, data: string) => Promise<void>;
  checkBluetooth: () => Promise<boolean>;
  isDuplicteDevice: (devices: Device[], nextDevice: Device) => boolean;
  resetESP32: () => Promise<void>;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [data, setData] = useState<{
    selectedBSSID: string;
    password: string;
    userId: string;
  } | null>(null);

  const fetchDataFromFirebase = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert("Not logged in", "Please log in first");
      return;
    }
  
    const uid = user.uid;
   
    try {
      const snapshot = await get(ref(database, `users/${uid}/wifi`));
      if (snapshot.exists()) {
        const wifiData = snapshot.val();
        const selectedBSSID = wifiData.selectedBSSID || "";
        const password = wifiData.password || "";
  
        setData({
          selectedBSSID,
          password,
          userId: uid,
        });

        console.log("Sent data from BLE:", data);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Firebase error:", error);
    }
  };
  
  useEffect(() => {
    fetchDataFromFirebase();
  }, []);
  
  // To log the updated data whenever it changes
  useEffect(() => {
    if (data) {
      console.log("user data", data);
    }
  }, [data]);
  
  

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, []);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Bluetooth Scan Permission",
        message: "App requiers Blutoothe Scanning",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Bluetooth Connect Permission",
        message: "Bluetooth connection requires this permission.",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }

  };


  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    console.log("Scanning for BLE devices...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error:", error);
      }

      if (device && device.name) { //(device && device.name?.includes("CorSense")
        setAllDevices((prevState: Device[]) => {
          if(!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }

          const devicesMap = new Map(prevState.map((d) => [d.id, d]));
          devicesMap.set(device.id, device);
          return Array.from(devicesMap.values());
          return prevState;
        });
      }
    });
 
    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      console.log("Stopped scanning for BLE devices.");
    }, 30000);
  };

  

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      console.log("CONNECTED TO DEVICE ", device.id);
      console.log("Data to send", data);
      
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 0.5s
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      Alert.alert("CONNECTED TO DEVICE", device.id);

      //Send data automatically 
      if (data) {
        const payload = JSON.stringify(data); // Convert object to string
        await sendDataToDevice(deviceConnection, payload); // Send string
        console.log("DATA SENT TO DEVICE");
      } else {
        console.warn("No data available to send");
      }

    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      const reconnected = await bleManager.connectToDevice(device.id);
      await reconnected.discoverAllServicesAndCharacteristics();
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const sendDataToDevice = async (device: Device, data: string) => {
    try {
      const encoded = base64.encode(data);
  
      await device.writeCharacteristicWithResponseForService(
        DATA_SERVICE_UUID,
        CHARACTERISTIC_UUID,
        encoded
      );
  
      console.log("✅ Data sent to ESP32:", data);
    } catch (error) {
      console.error("❌ Failed to send data to device:", error);
    }
  };

  const resetESP32 = async () => {

     if (!connectedDevice || !data) {
    Alert.alert("Device not connected or data is missing");
    return;
  }

  try {
    const payload = JSON.stringify({ reset: true });
    const encoded = base64.encode(payload);

    await connectedDevice.writeCharacteristicWithResponseForService(
      DATA_SERVICE_UUID,
      CHARACTERISTIC_UUID,
      encoded
    );

    Alert.alert("Reset Sent", "ESP32 has been instructed to reset.");
  } catch (error) {
    console.error("Failed to reset ESP32:", error);
    Alert.alert("Error", "Could not send reset command.");
  }
};

  

const checkBluetooth = async (): Promise<boolean> => {
  try {
    const state = await bleManager.state();

    if (state === State.PoweredOn) {
      console.log("✅ Bluetooth is ON");
      return true;
    } else {
      console.warn("❌ Bluetooth is NOT ON:", state);

      if (Platform.OS === 'android') {
        Alert.alert("Bluetooth Off", "Please turn on Bluetooth to continue.");
      }

      return false;
    }
  } catch (error) {
    console.error("Error checking Bluetooth state:", error);
    return false;
  }
};


  return {
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectedDevice,
    disconnectFromDevice, 
    sendDataToDevice,
    checkBluetooth,
    isDuplicteDevice,
    resetESP32
  };
}

export default useBLE;
