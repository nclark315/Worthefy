import React from 'react'; 
import { View, StyleSheet, Text } from 'react-native'; 
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu'; 
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MenuIcon from "react-native-vector-icons/Entypo";
import LogoutIcon from "react-native-vector-icons/MaterialIcons";
import { router } from 'expo-router';

const SimpleMenu = () => { 

return ( 
	<View style={styles.container}>
    <Menu>
      <MenuTrigger>
        <MenuIcon name='menu' size={35} color="#20446f" />
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles}>
        <MenuOption  onSelect={() => router.push("/finance/page")}>
          <View style={styles.menuItem}>
            <Text style={styles.text}>Adding Finances</Text>
            <FontAwesome name="dollar" size={20} color="#20446f" />

          </View>
        </MenuOption>
        <MenuOption  onSelect={() => router.push("/followers/page")}>
          <View style={styles.menuItem}>
            
            <Text style={styles.text}>Instagram</Text>
            <FontAwesome name="instagram" size={20} color="#20446f" />
          </View>
        </MenuOption>
        <MenuOption  >
          <View style={styles.menuItem}>
            
            <Text style={styles.text}>Log Out</Text>
            <LogoutIcon name="logout" size={20} color="#20446f" />
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </View>
); 
}; 

//onSelect={() => router.push("")}


export default SimpleMenu;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: 'row', // Align the text and icon horizontally
    alignItems: 'center', // Vertically center the items
    justifyContent: 'space-between', // Add space between text and icon
    padding: 5, // Add padding to the menu items
  },
  text: {
    fontSize: 16,
    color: '#20446f',
    fontFamily:'cairo-regular'
  },
  icon: {
    marginRight: 10, // Add some space between text and icon
  }
});

const menuOptionsStyles = {
  optionsContainer: {
    borderRadius: 8,
    marginTop: 40, // Adjust this value based on where you want the menu to appear
    width: 200, // Set a fixed width to the menu
    padding: 5, // Add padding inside the menu
  },
};
