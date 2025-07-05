import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,  Alert,  ScrollView, StatusBar, TouchableOpacity, Image } from "react-native";
import { ref, get, set } from "firebase/database";
import { database } from "@/configs/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { Link, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useBLE from "../../lib/useBLE";

// const assets = [
//   { id: "1", name: "Bitcoin", icon: "bitcoin", increase: "2.67%", color: '#F7931A'},
//   { id: "2", name: "Ethereum", icon: "ethereum", increase: "1.67%", color: '#3C3C3D' },
//   { id: "3", name: "Youtube", icon: "youtube", increase: "1.20%", color: '#FF0000' },
//   { id: "4", name: "Instagram", icon: "instagram", increase: "1.01%",color: '#0077B5' },
// ];

// const actions = [
//   {id:"1",title:"Add Asset", icon:"add", link:''},
//   {id:"2",title:"Sync", icon:"sync", link:'/followers/page'},
//   {id:"3",title:"Update Value", icon:"download-outline", link:''},
//   {id:"4",title:"Insights", icon:"trending-up-sharp", link:''}
// ];


export default function Tab() {
  const { InstagramFollowers } = useLocalSearchParams();
  const [totalWorth, setTotalWorth] = useState<string>("0");  // Keeping totalWorth as string initially
  const [newWorth, setNewWorth] = useState<string>("");
  const [subscribers, setSubscribers] = useState<number>(0); 
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State to control modal visibility
  const router = useRouter();
  const [visible, setVisible] = useState(false);


  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    disconnectFromDevice,
    resetESP32
  } = useBLE();
   const [isModalVisible2, setIsModalVisible2] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
      setIsModalVisible2(false);
    };
  
    const openModal = async () => {
      scanForDevices();
      setIsModalVisible2(true);
    };  
  
    useEffect(() => {
      if (connectedDevice) {
        router.replace('/(tabs)');
      }
    }, [connectedDevice]);
 

  useEffect(() => {
    // Show popup when the home screen opens
    setVisible(true);
  }, []);


  useFocusEffect(
    useCallback(() => {
      const fetchTotalWorth = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
            if (!user) {
                Alert.alert("Not logged in", "Please log in first");
                return;
            }
        const uid = user.uid;

        try {
          const totalWorthRef = ref(database, `users/${uid}/networth`);
          const snapshot = await get(totalWorthRef);
          if (snapshot.exists()) {
            setTotalWorth(snapshot.val());
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error("Error fetching total worth:", error);
        }
      };
  
      const fetchSubscribers = async () => {
         const auth = getAuth();
        const user = auth.currentUser;
          if (!user) {
              Alert.alert("Not logged in", "Please log in first");
              return;
          }
          const uid = user.uid;
        try {
          const subscribersRef = ref(database, `users/${uid}/sub`);
          const snapshot = await get(subscribersRef);
          if (snapshot.exists()) {
            setSubscribers(snapshot.val());
          } else {
            console.log("No data available for subscribers");
          }
        } catch (error) {
          console.error("Error fetching subscribers:", error);
        }
      };
  
      fetchSubscribers();
      fetchTotalWorth();
    }, [])
  );

  // Update Total Worth (Handle string values)
  // const updateTotalWorth = async () => {
  //   if (!newWorth ) {
  //     Alert.alert("Invalid Input", "Please enter a valid number.");
  //     return;
  //   }

  //   try {
  //     const totalWorthRef = ref(database, "networth");
  //     await set(totalWorthRef, newWorth);  // Store the value as string
  //     setTotalWorth(newWorth);  // Update the local state with the string value
  //     setNewWorth(""); // Clear the input field
  //     setIsModalVisible(false); // Close the modal
  //     Alert.alert("Success", "Total worth updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating total worth:", error);
  //     Alert.alert("Error", "Failed to update total worth.");
  //   }
  // };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    return num.toLocaleString(); // Format with commas for thousands
  };

  return (
    <>
    <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
    <ScrollView style={styles.container} contentContainerStyle={{alignItems: "center",justifyContent: "flex-start", paddingBottom: 120}}>
      {/* <Clock followers={Number(InstagramFollowers)} totalWorth={totalWorth} subscribers={subscribers} /> */}
      <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 15}}>
        <TouchableOpacity style={styles.cardView} onPress={() => router.push("/finance/page")}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
            <Ionicons name="trending-up-sharp" size={24} color="white" style={{marginRight: 2, marginBottom: 10}}/>
            <Text style={styles.headerText}>Net Worth</Text></View>
          <Text style={styles.valueText}>{totalWorth}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardView} onPress={() => router.navigate({pathname: "/followers/page", params: {media: "Instagram"}})}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5}}>
            <Ionicons name="people-outline" size={24} color="white" style={{marginRight: 2, marginBottom: 10}}/>
            <Text style={styles.headerText}>Subscribers</Text>
          </View>
          <Text style={styles.valueText}>{formatNumber(subscribers)} </Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        style={[styles.cardView, { marginTop: 15, backgroundColor: "#444" }]}
        onPress={resetESP32}
      >
        <Ionicons name="refresh-outline" size={24} color="white" />
        <Text style={[styles.headerText, { marginLeft: 8 }]}>Reset ESP32</Text>
      </TouchableOpacity> */}

      {/* <View style={styles.View}>
      <TouchableOpacity style={styles.box} onPress={connectedDevice ? disconnectFromDevice : openModal} >
          <Image source={require('../../assets/images/clock.png')} style={styles.image} />
          <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start',}}>
            <Text style={{fontSize: 18, fontFamily: 'cairo-regular', color: '#fff'}}>WORTHEFY</Text>
            <Text style={{fontSize: 12, fontFamily: 'cairo-regular', color: '#9B9B9B', width: 180}}>
                {connectedDevice ? "Device is connected" : "Connect Automatically to the Worthefy easily from anywhere."}</Text>
          </View>
          
          <FontAwesome name={connectedDevice ? "check" : "plus"} size={20} color="#fff" />
        </TouchableOpacity>

        <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible2}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
        />
        </View> */}

     

      {/* <Text style={styles.increaseText}>
        <Ionicons name="arrow-up" size={14} color="#60A4E5" /> 2.3% <Text style={{color:'#fff', fontFamily: "cairo-regular"}}>Increase compared to yesterday</Text>
      </Text> */}

      {/* Action Buttons */}
      {/* <View style={styles.buttonContainer}>
        {actions.map((item: any, index) => (
          <View key={index} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <TouchableOpacity  style={styles.button} onPress={() => router.push(item.link)}>
            <Ionicons name={item.icon} size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>{item.title}</Text>
          </View>
        ))}
      </View> */}


      

      {/* Asset List */}
      {/* <View>
      <View style={styles.assetContainer}>
        <Text style={styles.sectionTitle}>Top Assets</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      {assets.map((item) => (
          <View key={item.id} style={styles.assetItem}>
            <FontAwesome5 name={item.icon} size={30} color="white" style={styles.assetIcon} />
            <View>
              <Text style={styles.assetName}>{item.name}</Text>
              <Text style={styles.increaseText}>
                <Ionicons name="arrow-up" size={12} color="#60A4E5" /> {item.increase} <Text style={{color:'#fff', fontFamily: "cairo-regular"}}>Increase Yesterday</Text>
              </Text>
            </View>
          </View>
        ))}
      </View> */}

      {/* <View style={{backgroundColor: "#555B73", height: 55, width: 300, justifyContent: "center", alignItems: "center", borderRadius: 8, marginBottom: 10}}>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://plaid-11.vercel.app/")}
        style={{ backgroundColor: "#555B73", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", fontFamily: "cairo-bold", textAlign: "center", fontSize: 24 }}>
          Plaid
        </Text>
      </TouchableOpacity>
      </View> */}

    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#282E3E",
    paddingTop: 40,
    height: "100%",
    paddingBottom: 200
  },
  cardView: {
    width: "48%", display: "flex", flexDirection: "column", alignItems: "center",
     borderWidth: 1, padding: 10,
    borderRadius: 10,borderColor: "#555B73",
  },
  
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "cairo-regular",
    marginBottom: 15,
  },
  valueText: {
    color: "#63D2DB",
    fontSize: 24,
    fontFamily: "digital",
  },
  increaseText: {
    color: "lightgreen",
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: '#555B73',
    padding: 15,
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "cairo-regular",
  },
  assetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "cairo-bold",
  },
  seeAll: {
    color: "lightblue",
    fontSize: 14,
    fontFamily: "cairo-regular",
  },
  assetItem: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555B73',
  
  },
  assetIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  assetName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "cairo-semiBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderWidth: 1,
    borderColor: '#555B73',
  },
  
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
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

  View: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height:'90%',
    marginTop: 30,
    paddingHorizontal: 15,
    gap: 25
  },

});
