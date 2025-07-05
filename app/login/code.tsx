import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams, useRouter } from 'expo-router';


const Code = () => {
  const router = useRouter();

  const {email} = useLocalSearchParams()
  const handleConfirmCode = () => {
    
    router.replace('/connect/page');
  };



  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text.charAt(text.length - 1);
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return ( 
    // <>
    //   <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
    // <View style={styles.container}>
    //   <View style={styles.topView}>
    //     <TouchableOpacity onPress={() => router.back()} >
    //       <FontAwesome size={28} name="angle-left" color={'#fff'} />
    //     </TouchableOpacity>
    //     <Text style={styles.title}>Welcome back</Text>
    //     <Text style={{color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular',}}>A 6 digit code was sent to 
    //     <Text style={{color: '#4099D0',}}> Johndoe@icloud.com</Text>, enter the code to continue.</Text>
    //   </View>
      
    //   <View style={styles.View}>
        
    //     <View style={{width: '100%', alignItems: 'center', }}>
        
    //     <View style={styles.otpContainer}>
    //     {otp.map((value, index) => (
    //       <TextInput
    //         key={index}
    //         ref={(el) => (inputs.current[index] = el)}
    //         style={styles.otpBox}
    //         value={value}
    //         onChangeText={(text) => handleChange(text, index)}
    //         onKeyPress={(event) => handleKeyPress(event, index)}
    //         keyboardType="number-pad"
    //         maxLength={1}
    //         returnKeyType="done"
    //       />
    //     ))}
    //   </View>
    //   <Text style={styles.text}>Didn’t get a code? <Text onPress={() => []} style={styles.resendText}>Resend code</Text> </Text>
        
      
    //     </View>

    //     <TouchableOpacity style={styles.button} onPress={handleConfirmCode}>
    //         <Text style={styles.buttonText}>Confirm Code</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    // </>

    <>
    <StatusBar backgroundColor="#282E3E" barStyle="light-content" />
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => router.back()} >
          <FontAwesome size={28} name="angle-left" color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={{color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular'}}>
          A verification email was sent to 
          <Text style={{color: '#4099D0'}}> {email}</Text>, please check your inbox and click on the link.
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login/page')}>
                  <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  </>
  )
}

export default Code

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
  otpContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#4F4F4F",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#FFFFFF",
    backgroundColor: "#1F2937",
  },
  text: {
    color: "#A3A3A3",
    fontSize: 14,
    
  },
  resendText: {
    color: "#4099D099",
    fontSize: 14,
    fontWeight: "bold",
  },
  
});

