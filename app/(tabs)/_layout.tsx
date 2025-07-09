import { Tabs } from "expo-router";
import {FontAwesome, Ionicons, Octicons, AntDesign} from "@expo/vector-icons";
import { Image, View, StyleSheet, Text,Alert } from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


export default function TabLayout() {
  
  const [username, setUsername] = useState("");

  const getUserProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) return;
  
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.fullName);
        console.log("Display Name:", data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    
    <Tabs
      screenOptions={{
        headerRight: () => <View style={{ flexDirection: "row" , gap: 10}}>
          <Ionicons size={23} name="scan" color={'#fff'} />
          <Octicons size={20} name="bell" color={'#fff'} />
          
        </View>,

        headerLeft: () => (
          <View style={styles.headerLeftContainer}>

            <View style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: "#fff", overflow: "hidden", marginRight: 5 }}> 
              <Image source={require("../../assets/images/followers.png")} style={{width: "100%", height: "100%", resizeMode: "cover"}} />
            </View>

            <View>
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: "cairo-regular" }}>Welcome, {username}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Text style={{ color: "#fff", fontSize:12, fontFamily: "cairo-regular" }}>09283237677 </Text> <FontAwesome size={14} name="clone" color={'#fff'} />
              </View>
              
            </View>
          </View>
        ),
        headerTitle: "",
        headerLeftContainerStyle: { paddingLeft: 20 },
        headerRightContainerStyle: { paddingRight: 20 },
        headerStyle: { backgroundColor: "#282E3E", },
        headerShadowVisible: false,
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          backgroundColor: "#282E3E",
          height: "9%",
          width: '100%', // Custom width (90% of the screen width)
          position: 'absolute', // Optional: Floating effect
          display:'flex',
          alignItems:'center', 
          justifyContent:'center',
          paddingTop:16, 
        },
        tabBarLabelStyle: { display: "none", paddingTop: 4, fontSize: 12, fontFamily: "cairo-bold" },
        tabBarActiveTintColor: "#20446f",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign size={34} name="home" color={'#fff'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="address-book" color={'#fff'} />
          ),
          headerShown: false
        }}
      />

    <Tabs.Screen
          name="asset"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="bar-chart" color={'#fff'} />
            ),
            headerShown: false
          }}
        />
      </Tabs>
    
  );
}

const styles = StyleSheet.create({
  headerLeftContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop:10
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    height: "9%",
    width: "90%",
    borderRadius: 20,
    marginHorizontal: "5%",
    position: "absolute",
    bottom: 10,
  },
});
