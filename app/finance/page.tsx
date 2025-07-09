import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Link, useRouter } from 'expo-router';
import { database } from "@/configs/firebaseConfig";
import { getAuth } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { ApifyClient } from 'apify-client';
import { WebView } from 'react-native-webview';

export default function CustomForm() {
  const router = useRouter();
  
  // State for selected services, cryptos, and social media
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [selectedCryptos, setSelectedCryptos] = useState<any>([]);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<any>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showTellerWebView, setShowTellerWebView] = useState<boolean>(false);

  // Modal and username state for social media
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSocialMedia, setCurrentSocialMedia] = useState<any | null>(null);
  const [username, setUsername] = useState('');

  const [totalWorth, setTotalWorth] = useState<string>("0");  // Keeping totalWorth as string initially
    const [newWorth, setNewWorth] = useState<string>("");

  // Enter by hand state
  const [followers, setFollowers] = useState<any | null>(null);
  const [totalFollowers, setTotalFollowers] = useState<any | null>(null);
   const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const [showWebView, setShowWebView] = useState(false);

  // Data for dropdowns
  const services = [
    { label: 'Stripe', value: 'stripe', color: '#008CFF', diabled: true },
    { label: 'Shopify', value: 'shopify', color: '#7AB55C',  diabled: true  },
    { label: 'Teller', value: 'teller', color: '#4355F9',  diabled: false },
  ];

  const cryptos = [
    { label: 'Ethereum', value: 'ethereum', color: '#3C3C3D',  diabled: true  },
    { label: 'Bitcoin', value: 'bitcoin', color: '#F7931A',  diabled: true  },
    { label: 'Binance', value: 'binance', color: '#F0B90B',  diabled: true  },
  ];

  const socialMedia = [
    { label: 'Behance', value: 'behance', color: '#1769FF', diabled: true  },
    { label: 'YouTube', value: 'youtube', color: '#FF0000',  diabled: true },
    { label: 'Facebook', value: 'facebook', color: '#3B5998' ,  diabled: true },
    { label: 'Instagram', value: 'instagram', color: '#DD2A7B',  diabled: false  },
     { label: 'Linkedin', value: 'linkedin', color: '#0077B5',  diabled: true },
  ];

  

  const fetchFollowers = async () => {
    if (!username) {
      setError('Username is required');
      return null; // Ensure null is returned if input is invalid
    }
  
    setError(null);
    setFollowers(null);
    setLoading(true);
  
    try {
      const client = new ApifyClient({
        token: '',
      });
  
      const input = {
        usernames: [username],
      };
  
      const run = await client.actor('').call(input);
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
  
      console.log(items);
  
      if (items.length > 0) {
        const count = items[0]?.followersCount || 'Not available';
        setFollowers(count);
        return count; // Return followers count
      } else {
        setError('No data found for the given username.');
        return null;
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  

  const updateTotalWorth = async () => {
    if (!newWorth) {
        Alert.alert("Invalid Input", "Please enter a valid number.");
        return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Not logged in", "Please log in first");
        return;
    }
    const uid = user.uid;

    try {
        const totalWorthRef = ref(database, `users/${uid}/networth`);
        await set(totalWorthRef, newWorth);
        setTotalWorth(newWorth);
        setNewWorth("");
        Alert.alert("Success", "Total worth updated successfully!");
    } catch (error) {
        console.error("Error updating total worth:", error);
        Alert.alert("Error", "Failed to update total worth.");
    }
};


const updateFollowers = async (followersCount: any) => {
  if (!followersCount) {
      Alert.alert("Invalid Input", "No followers data available to update.");
      return;
  }

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
      Alert.alert("Not logged in", "Please log in first");
      return;
  }
  const uid = user.uid;

  try {
      setIsUpdating(true);
      const totalFollowersRef = ref(database, `users/${uid}/sub`);
      await set(totalFollowersRef, followersCount);
      setTotalFollowers(followersCount);
      setFollowers(null);
      Alert.alert("Success", "Total followers updated successfully!");
  } catch (error) {
      console.error("Error updating total followers:", error);
      Alert.alert("Error", "Failed to update total followers.");
  } finally {
      setIsUpdating(false);
  }
};

  const onClickMedia = (media: string) =>  {
    router.navigate({pathname:'/followers/page', params:{media: media}});
  }

  // const { open, ready } = useTellerConnect({
  //   applicationId: 'app_peln2crirofp6upddo000',
  //   environment: 'sandbox', // or development/production
  //   products: ['balance', 'transactions'],
  //   onSuccess: (enrollment) => {
  //     const token = enrollment.accessToken;
  //     // Send this token to your backend to fetch data via mTLS
  //     console.log(token);
  //   },
  //   onFailure: (err) => console.error('Teller failed', err),
  // });

  // Handle Save Process
  // const handleSave = () => {
  //   Alert.alert(
  //     'Process Saved',
  //     `Services: ${selectedServices.map((s:any) => s.label).join(', ')}\nCryptos: ${selectedCryptos.map((c:any) => c.label).join(', ')}\nSocial Media: ${selectedSocialMedia
  //       .map((sm: any) => `${sm.label} (${sm.username})`)
  //       .join(', ')}\nAmount: ${currency} ${amount}`
  //   );
  // };
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={{width: '99%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <TouchableOpacity onPress={() => router.back()} style= {{ borderWidth: 1, backgroundColor: '#60A4E5', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesome size={28} name="angle-left" color={'#fff'} />
        </TouchableOpacity>
      <Text style={styles.title}>Sync Assets</Text>
      <Text style={{ color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular', textAlign: 'left' }}>
        View and edit your information
      </Text>
        </View>
      

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Services</Text>
      {services.map((service) => (
        <TouchableOpacity
          disabled={service.diabled}
          key={service.value}
          
          style={[
            styles.option,
            selectedServices.some((s: any) => s.value === service.value) && { backgroundColor: service.color },
            service.diabled && { opacity: 0.4 },
          ]}
          // onPress={() => service.label === 'Teller' && setShowWebView(true)} 
          onPress={() => router.push('/teller/page')}
        >
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesome name={service.value} size={16} color={selectedServices.some((s: any) => s.value === service.value) ? '#FFF' : service.color } />
          <Text style={[
        styles.optionText,
        selectedServices.some((s: any) => s.value === service.value) && { color: '#FFF' }, // Change text color to white when selected
      ]}>{service.label}</Text>
        </View>
        <FontAwesome name="plus" size={16} color={'#fff'} />
        </TouchableOpacity>
      ))} 

      {/* <Modal visible={showWebView} animationType="slide">
        <WebView
          source={{ uri: 'https://teller-1.onrender.com/' }} // ← replace with your hosted page
          onMessage={(event) => {
            const result = JSON.parse(event.nativeEvent.data);
            console.log('Result from Teller:', result);

            // Send result.accessToken to your backend
            setShowWebView(false);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowWebView(false)}
          style={{
            backgroundColor: '#333',
            padding: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </Modal> */}

      {/* <View style={styles.selectedItems}>
        {selectedServices.map((service: any) => (
          <Text key={service.value} style={styles.selectedItem}>
            {service.label}
          </Text>
        ))}
      </View> */}

      {/* Cryptos Section */}
      <Text style={styles.sectionTitle}>Crypto Wallet</Text>
      {cryptos.map((crypto) => (
        <TouchableOpacity
        disabled={crypto.diabled}
          key={crypto.value}
          style={[
            styles.option,
            selectedCryptos.some((c: any) => c.value === crypto.value) && { backgroundColor: crypto.color },
            crypto.diabled && { opacity: 0.4 },
          ]}
          onPress={() =>
            setSelectedCryptos((prev: any) =>
              prev.some((c: any) => c.value === crypto.value)
                ? prev.filter((c: any) => c.value !== crypto.value)
                : [...prev, crypto]
            )
          }
        >
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesome name={crypto.value} size={16} color={selectedCryptos.some((c: any) => c.value === crypto.value) ? '#FFF' : crypto.color} />
          <Text style={[
        styles.optionText,
        selectedCryptos.some((c: any) => c.value === crypto.value) && { color: '#FFF' }, // Change text color to white when selected
      ]}>{crypto.label}</Text>
          </View>
          <FontAwesome name="plus" size={16} color={'#fff'} />
        </TouchableOpacity>
      ))}
      <View style={styles.selectedItems}>
        {selectedCryptos.map((crypto: any) => (
          <Text key={crypto.value} style={styles.selectedItem}>
            {crypto.label}
          </Text>
        ))}
      </View>

      {/* Enter by Hand */}
      <Text style={styles.sectionTitle}>Enter Manually</Text>
      <View style={styles.inputRow}>
      <TouchableOpacity onPress={updateTotalWorth} style={styles.inputCurrency}>
                <Text style={{color: "#fff", fontFamily: "cairo-regular",textAlign: "center"}}>
                USDT
                </Text>
              </TouchableOpacity>
        <TextInput
          style={styles.inputAmount}
          placeholder="Enter new total worth"
          placeholderTextColor={'#fff'}
          keyboardType="numeric"
          value={newWorth}
          onChangeText={setNewWorth}
        />
      </View>

      {/* Social Media Section */}
      <Text style={styles.sectionTitle}>Social Media</Text>
      {socialMedia.map((sm) => (
        <TouchableOpacity
        disabled={sm.diabled}
            key={sm.value}
            style={[
            styles.option,
            selectedSocialMedia.some((s: any) => s.value === sm.value) && { backgroundColor: sm.color },
            sm.diabled && { opacity: 0.4 },
            ]}
            onPress={() => {
            if (selectedSocialMedia.some((s: any) => s.value === sm.value)) {
                // Unselect the social media if already selected
                setSelectedSocialMedia((prev: any) => prev.filter((s: any) => s.value !== sm.value));
            } else {
                // Show modal if not selected
                setCurrentSocialMedia(sm);
                onClickMedia(sm.label);
            }
            }}
        >
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    <FontAwesome name={sm.value} size={16} color={selectedSocialMedia.some((s: any) => s.value === sm.value) ? '#FFF' : sm.color}  />
    <Text style={[
        styles.optionText,
        selectedSocialMedia.some((s: any) => s.value === sm.value) && { color: '#FFF' }, // Change text color to white when selected
      ]}>{sm.label}</Text>
      </View>
      <FontAwesome name="plus" size={16} color={'#fff'} />
  </TouchableOpacity>
))}

      <View style={styles.selectedItems}>
        {selectedSocialMedia.map((sm: any) => (
          <Text key={sm.value} style={styles.selectedItem}>
            {sm.label} ({sm.username})
          </Text>
        ))}
      </View>

      {/* Save Button */}
      {/* <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity> */}

      {/* Modal for Username */}
      {/* <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}> */}
            {/* Close Button */}
            {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enter Username for {currentSocialMedia?.label}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
            />

            <TouchableOpacity
              style={[styles.modalButton, isUpdating && styles.disabledButton]}
              
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#282E3E',
      paddingBottom: 100
    },
    title: {
      fontSize: 24,
      fontFamily: 'cairo-bold',
      textAlign: 'center',
      color: '#fff',
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'cairo-bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#fff',
    },
    option: {
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'center',
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#282E3E',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#555B73',
    },
    optionText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#fff',
      fontFamily: 'cairo-regular',
      marginTop: -4
    },
    selectedItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    selectedItem: {
      backgroundColor: '#60A4E5',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      marginRight: 10,
      marginBottom: 10,
      fontSize: 14,
      color: '#fff',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    inputCurrency: {
      flex: 1,
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#282E3E',
      borderWidth: 1,
      borderColor: '#fff',
      marginRight: 10,
      fontSize: 16,
      color: '#fff',
    },
    inputAmount: {
      flex: 2,
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#282E3E',
      borderWidth: 1,
      borderColor: '#fff',
      fontSize: 16,
      color: '#fff',
    },
    button: {
      backgroundColor: '#60A4E5',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontFamily: 'cairo-bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#282E3E',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'cairo-bold',
      marginBottom: 15,
      textAlign: 'center',
      color: '#fff',
    },
    modalInput: {
      width: '100%',
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#Fff',
      borderWidth: 1,
      borderColor: '#fff',
      fontSize: 16,
      marginBottom: 20,
      fontFamily: 'cairo-regular',
    },
    modalButton: {
      backgroundColor: '#60A4E5',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'cairo-bold',
    },
    disabledButton: {
      backgroundColor: "#A9A9A9", // Greyed out color
      opacity: 0.7, // Slight transparency to indicate it's disabled
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#ccc',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
    },
  });
  