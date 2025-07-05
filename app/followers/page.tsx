import React from 'react'
import InstagramFollowers from '@/components/InstaFollowers'
import { Link, useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const page = () => {

    const router = useRouter();

  return (
    <View style={styles.container}>
        <InstagramFollowers/>
        
    </View>
    
  )
}

export default page

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#282E3E',
      },
})