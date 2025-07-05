import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "../lib/useBLE";

const BluetoothScanner = () => {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    disconnectFromDevice,
    
  } = useBLE();
   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };  
  

  return (
    <View style={[styles.container]}>
      <View style={{ height: 55, width: 300, justifyContent: "center", alignItems: "center", borderRadius: 8}}>
        {connectedDevice ? (
          <>
            <Text style={{ color: "#fff", fontFamily: "cairo-bold", textAlign: "center", fontSize: 24 }}>Connected </Text>
          </>
        ) : (
          <Text style={{ color: "#fff", fontFamily: "cairo-bold", textAlign: "center", fontSize: 24 }}>Connect to a device</Text>
        )}
      </View>
      <TouchableOpacity onPress={connectedDevice ? disconnectFromDevice : openModal}  style={{backgroundColor: "#555B73", height: 55, width: 300, justifyContent: "center", alignItems: "center", borderRadius: 8}}>
        <Text style={{ color: "#fff", fontFamily: "cairo-bold", textAlign: "center", fontSize: 24 }}>{connectedDevice ? "Disconnect" : "Connect"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#282E3E",
    // borderWidth: 1,
    // borderColor: "lightgray",
    // borderRadius: 8,
    // padding: 20,
    // margin: 20,
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default BluetoothScanner;
