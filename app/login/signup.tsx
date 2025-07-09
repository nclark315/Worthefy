import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,Platform, KeyboardAvoidingView  , StatusBar, ActivityIndicator } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../configs/firebaseConfig";

const SignUp: React.FC = () => {
  const router = useRouter();
  
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  

  const handleSignUp = async () => {
    let newErrors: Record<string, string> = {};

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    // if (!confirmEmail) newErrors.confirmEmail = "Please confirm your email";
    // if (email !== confirmEmail) newErrors.confirmEmail = "Emails do not match";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,
      });

      await sendEmailVerification(user);

      Alert.alert("Success", "Verification email sent! Please check your inbox.");

      router.replace({
        pathname: '/login/code',
        params: { email }
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login/page');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
      <View style={styles.container} >
        <View style={styles.topView}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome size={28} name="angle-left" color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.title}>Create an account</Text>
          <Text style={{ color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular', textAlign: 'left' }}>
            Enter your details below to create your account.
          </Text>
        </View>

        <View style={styles.View} >

          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter Full Name"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="Enter email address"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* <Text style={styles.label}>Confirm Email Address</Text>
            <TextInput
              placeholder="Confirm email address"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              keyboardType="email-address"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
            />
            {errors.confirmEmail && <Text style={styles.error}>{errors.confirmEmail}</Text>} */}

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#a9a9a9"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create an account</Text>}
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'cairo-regular', textAlign: 'center' }}>
              Already have an account?
              <Text onPress={navigateToLogin} style={{ color: '#4099D0' }}> Login</Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;


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
    marginBottom: 5,
    fontFamily: 'cairo-semiBold',
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  }
  
  
});

