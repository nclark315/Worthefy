import React, { useState } from 'react';
import { View, Text,Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ApifyClient } from 'apify-client';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { database } from "@/configs/firebaseConfig";
import { getAuth } from "firebase/auth";
import { ref, get, set } from "firebase/database";


const InstagramFollowers = () => {

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState<any | null>(null);
  const [totalFollowers, setTotalFollowers] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { media } = useLocalSearchParams();

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

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}  >
        <TouchableOpacity onPress={() => router.navigate({pathname: '/(tabs)', params: {InstagramFollowers: followers}})}
         style= {{ borderWidth: 1, backgroundColor: '#60A4E5', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesome size={28} name="angle-left" color={'#fff'}  />
        </TouchableOpacity>
        <Text style={styles.title}>Add {media} Followers </Text>
        <Text style={{ color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular', textAlign: 'left', }}>
                View and edit your information
        </Text>
      </View>
      
      
      <TextInput
        style={styles.input}
        placeholder={`Enter ${media} Username`}
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#ccc"
      />
      
      <TouchableOpacity style={styles.button} onPress={async () => {
                      if (!username.trim()) {
                        Alert.alert("Invalid Input", "Username cannot be empty.");
                        return;
                      }
      
                      setIsUpdating(true);
      
                      if (media === 'Instagram') {
                        const fetchedFollowers = await fetchFollowers(); // Wait for data
                        if (fetchedFollowers !== null) {
                          await updateFollowers(fetchedFollowers); // Pass fetched data
                        }
                      }
      
                      setIsUpdating(false);
                      setUsername('');
                    }}
                    disabled={isUpdating}
                    >
        <Ionicons name="sync" size={24} color="#fff" style={{marginRight: 10}} />
        <Text style={styles.buttonText}>Sync Instagram</Text>
      </TouchableOpacity>
      
      {loading && <ActivityIndicator style={{marginTop: 20}} size="large" color="#20446f" />}
      
      {followers !== null && !loading && (
        <Text style={styles.result}>Followers: {followers}</Text>
      )}
      
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.textView}>
        <Text style={{color: '#fff', fontSize: 16, fontFamily: 'cairo-regular'}}>Why use our Instagram Analytics?</Text>
          <View style={{gap: 5}}>
          <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start', gap: 5}}>
            <Ionicons name="checkmark-circle" size={20} color="lightgreen" /> 
            <Text style={styles.itemText}>Real-time followers Stats and analytics</Text>
          </View>
          <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start', gap: 5}}>
            <Ionicons name="checkmark-circle" size={20} color="lightgreen" />
            <Text style={styles.itemText}> Track engagement and growth over time</Text>
          </View>
          <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start', gap: 5}}>
            <Ionicons name="checkmark-circle" size={20} color="lightgreen" />
            <Text style={styles.itemText}> Compare with Competitors accounts</Text>
          </View>
          </View>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282E3E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'cairo-bold',
    
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#282E3E',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    fontFamily: 'cairo-regular',
  },
  button: {
    backgroundColor: '#60A4E599',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'cairo-bold',
  },
  result: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontFamily: 'cairo-regular',
  },
  error: {
    color: '#ff5252',
    fontSize: 14,
    marginTop: 20,
  },
  backButton: {
    color: '#20446f',
    fontSize: 18,
    fontFamily: 'cairo-semiBold',
    textAlign: 'center',
  },
  backButtonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 40,
  },
textView:{
  borderWidth: 1,
  borderColor: '#555B73',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal:10,
  marginTop: 20,
  display: 'flex',
  gap: 15,
  alignItems:'center',
  justifyContent: 'center',

},
itemText :{
  color: '#9B9B9B',
  fontSize: 14,
  fontFamily: 'cairo-regular',

}
  
});

export default InstagramFollowers;
