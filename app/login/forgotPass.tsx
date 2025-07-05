import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useRouter } from 'expo-router';


const ForgotPassword = () => {
  const router = useRouter();

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "You clicked Forgot Password!");
  };

  return ( 
    <>
      <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => router.back()} >
          <FontAwesome size={28} name="angle-left" color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.title}>Set up Password</Text>
        <Text style={{color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular',}}>Enter your password below to create your an account.</Text>
      </View>
      <View style={styles.View}>
        
        <View style={{width: '100%', alignItems: 'center', }}>
          <View style={{width: '100%', alignItems: 'center', }}>
          <Text style={styles.label}>Enter Password</Text>
          <TextInput
            placeholder="EnterPassword"
            placeholderTextColor="#a9a9a9"
            style={styles.input}
            secureTextEntry
          />
          </View>
          <View style={{width: '100%', alignItems: 'center', }}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#a9a9a9"
            style={styles.input}
            secureTextEntry
          />
          </View>
         
        </View>

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
      </View>
    </View>
    </>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282E3E',
    
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
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
    height:'90%',
    gap: 50,
    paddingHorizontal: 30,
    paddingBottom: 50
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    color: '#fff',
    fontFamily: 'cairo-semiBold',
   
  },
  forgotPassword: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
    width: '100%',
    paddingBottom: -20,
    fontFamily: 'cairo-semiBold',
    right: 20
  },
  button: {
    backgroundColor: '#4099D099',
    padding: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'cairo-bold',
  },

  label: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    marginTop: 10,
    fontFamily: 'cairo-semiBold',
  },
  
});

