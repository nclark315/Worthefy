import React, { FC, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { useRouter } from "expo-router";
import useBLE from "../lib/useBLE";
import { ScrollView } from "react-native-gesture-handler";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const router = useRouter();
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={modalStyle.ctaButton}>
      <Text style={modalStyle.ctaButtonText}>
        {item.item.name ?? item.item.localName ?? "Unknown Device"}
      </Text>
    </TouchableOpacity>
  );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, connectToPeripheral, closeModal } = props;
  const {checkBluetooth} = useBLE();
  const [bluetoothOn, setBluetoothOn] = useState<boolean>(true);

  useEffect(() => {
    if (visible) {
      checkBluetooth().then(setBluetoothOn);
    }
  }, [visible]);

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );



  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <SafeAreaView style={modalStyle.modalTitle}>
        
        {/* Close Button */}
        <TouchableOpacity onPress={closeModal} style={modalStyle.closeButton}>
          <Text style={modalStyle.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <Text style={modalStyle.modalTitleText}>
          {bluetoothOn
            ? "Tap on a device to connect"
            : "⚠️ Please turn on Bluetooth to see devices"}
        </Text>

        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContainer}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
       
        </SafeAreaView>
       </ScrollView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  modalTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#20446f",
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
  closeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
    width: "30%",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DeviceModal;
