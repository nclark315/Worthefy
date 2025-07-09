import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../configs/firebaseConfig'; // make sure this is correct
import { useContext } from "react";
import { AuthContext } from "../../configs/AuthContext";

const page: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
  if (!loading && user) {
    router.replace('/connect/page');
  }
}, [loading, user]);
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if email is verified
      if (user.emailVerified) { // .emailVerified
        router.replace('/connect/page'); // ✅ verified → allow access
      } else {
        Alert.alert(
          'Email not verified',
          'Please verify your email address before continuing.'
        );
        // Optionally resend email verification
        // await sendEmailVerification(user);
      }
    } catch (error: any) {
      Alert.alert('Sign in failed', error.message);
    }
  };

  const handleForgotPassword = () => {
    router.push('/login/forgotPass');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#282E3E' }}>
        <ActivityIndicator size="large" color="#4099D0" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}>
      <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity onPress={() => router.back()} >
            <FontAwesome size={28} name="angle-left" color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={{color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular'}}>Enter your email and password to sign in</Text>
        </View>

        <View style={styles.View}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="Enter email address"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
            <Text onPress={handleForgotPassword} style={styles.forgotPassword}>Forgot Password?</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default page;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282E3E',
    paddingBottom: 50
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
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555B73',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'cairo-semiBold',
   
  },
  forgotPassword: {
    color: '#4099D0',
    fontSize: 14,
    textAlign: 'right',
    width: '100%',
    paddingBottom: -20,
    fontFamily: 'cairo-semiBold',
    right: 5
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
    marginBottom: 5,
    fontFamily: 'cairo-semiBold',
  },
  
});

