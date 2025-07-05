import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, StatusBar } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { getAuth } from "firebase/auth";
import { db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
   const [user, setUser] = useState<any>({});
  
    const getUserProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) return;
    
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          console.log( data);
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

  const toggleSection = (section: string) => {
    setExpandedSection(prevSection => (prevSection === section ? null : section));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.topView}>
          {/* <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome size={28} name="angle-left" color={'#fff'} />
          </TouchableOpacity> */}
          <Text style={styles.title}>Profile</Text>
          <Text style={{ color: '#9B9B9B', fontSize: 14, fontFamily: 'cairo-regular', textAlign: 'left' }}>
          View and edit your information
          </Text>
        </View>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={require('../../assets/images/clock.png')} style={styles.profilePhoto} />
        <Text style={styles.profileName}>{user.fullName}</Text>
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        {/* Account Information */}
        <TouchableOpacity style={styles.listItem} onPress={() => toggleSection('account')}>
          <View style={styles.iconView}>
            <FontAwesome name="user" size={24} color="#fff" />
          </View>
          
          <View style={styles.listText}>
            <Text style={styles.listTitle}>Account Information</Text>
            <Text style={styles.listSubtitle}>Edit Profile information</Text>
          </View>
          <FontAwesome name={expandedSection === 'account' ? "chevron-down" : "chevron-right"} size={16} color="#fff" />
        </TouchableOpacity>
        {expandedSection === 'account' && (
          <View style={styles.expandedSection}>
            <Text style={styles.infoText}><Text style={styles.label}>Full Name:</Text> {user.fullName}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {user.email}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Phone:</Text> +123 456 7890</Text>
          </View>
        )}

        {/* Privacy */}
        <TouchableOpacity style={styles.listItem} onPress={() => toggleSection('privacy')}>

          <View style={styles.iconView}>
          <FontAwesome name="lock" size={24} color="#fff" />
          </View>
          <View style={styles.listText}>
            <Text style={styles.listTitle}>Privacy</Text>
            <Text style={styles.listSubtitle}>Set a new password</Text>
          </View>
          <FontAwesome name={expandedSection === 'privacy' ? "chevron-down" : "chevron-right"} size={16} color="#fff" />
        </TouchableOpacity>
        {expandedSection === 'privacy' && (
          <View style={styles.expandedSection}>
            <Text style={styles.infoText}><Text style={styles.label}>Password Last Changed:</Text> 2 months ago</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Two-Factor Authentication:</Text> Enabled</Text>
          </View>
        )}

        {/* Notification */}
        <TouchableOpacity style={styles.listItem} onPress={() => toggleSection('notification')}>
          <View style={styles.iconView}>
            <FontAwesome name="bell" size={24} color="#fff" />
          </View>
          <View style={styles.listText}>
            <Text style={styles.listTitle}>Notification</Text>
            <Text style={styles.listSubtitle}>Change notification settings</Text>
          </View>
          <FontAwesome name={expandedSection === 'notification' ? "chevron-down" : "chevron-right"} size={16} color="#fff" />
        </TouchableOpacity>
        {expandedSection === 'notification' && (
          <View style={styles.expandedSection}>
            <Text style={styles.infoText}><Text style={styles.label}>Push Notifications:</Text> Enabled</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Email Alerts:</Text> Disabled</Text>
          </View>
        )}
      </View>

      {/* Logout & Delete Section */}
      <TouchableOpacity style={styles.logoutButton}>
        <View style={styles.iconView}>
          <FontAwesome name="sign-out-alt" size={18} color="#fff" />
        </View>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <View style={styles.iconView}>
          <FontAwesome name="trash" size={18} color="red" />
        </View>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#282E3E',
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: 'cairo-bold',
    color: '#fff',
    
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'cairo-bold',
  },
  section: {
    borderRadius: 10,
    padding: 5,
    marginBottom: 30,
    color: '#fff',
    gap: 10,
    
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'cairo-bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#555B73',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  listText: {
    flex: 1,
    marginLeft: 12,
  },
  listTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'cairo-semiBold',
  },
  listSubtitle: {
    color: '#a0a0a0',
    fontSize: 14,
    fontFamily: 'cairo-regular',
    marginTop: -5,
  },
  expandedSection: {
    padding: 15,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    marginTop: 5,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#555B73',
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'cairo-semiBold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#555B73',
    borderRadius: 10,
  },
  deleteText: {
    color: 'red',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'cairo-bold',
  },
  iconView: {
    borderWidth: 1,
    borderColor: '#555B73',
    borderRadius: 10,
    padding:8
  },
  topView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop :30
  },
});
