import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClockProps {
  followers: number;
  totalWorth: string;
  subscribers: number;
}

export default function HexagonPrice({followers, totalWorth, subscribers}: ClockProps) {

  const [values, setValues] = useState<string[]>([followers.toString(),  totalWorth, subscribers.toString()]);
  const [currentValueIndex, setCurrentValueIndex] = useState(0);

  useEffect(() => {
    setValues([followers.toString(), totalWorth, subscribers.toString()]);
  }, [followers, totalWorth, subscribers]); // This will trigger when any of the props change
  

  useEffect(() => {
    // Cycle through the values array every 5 seconds
    const interval = setInterval(() => {
      setCurrentValueIndex((prevIndex) => (prevIndex + 1) % values.length);
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [values.length]);

  // Function to add new values dynamically
  const addValue = (newValue: string) => {
    setValues((prevValues) => [...prevValues, newValue]);
  };

  // Example: Adding a new value after 10 seconds
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     addValue('$ 50.00');
  //   }, 1000);

  //   return () => clearTimeout(timeout);
  // }, []);
;

  return (
    
    <View style={styles.container}>
      <View style={styles.hexagon}>
        <View style={styles.hexagonInner}>
          <View style={styles.hexagonBefore}>
          </View>
          <Text style={styles.priceText}>{values[currentValueIndex]}</Text> 
        </View>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width:'84%',
  },
  priceText: {
    color: 'white',
    fontFamily: 'clock-font', // Ensure you have a digital-style font like 'digital-7'
    fontSize: 40,
    transform: [{ rotate: '0deg' }], // Fix text orientation to make it readable
  },

  hexagon: {
    width: '100%',
    height: 55
  },
  hexagonInner: {
    width: "100%",
    height: 55,
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  hexagonBefore: {
    position: 'absolute',
    top: -15,
    left: 0,
    width: '100%',
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: 'transparent',
    borderBottomWidth: 15,
    borderBottomColor: '#00'

  }
});
