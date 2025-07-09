// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
// import { firebase } from '../configs/firebaseConfig';

// const NetWorthCard: React.FC = () => {
//   const [netWorth, setNetWorth] = useState<string>('');
//   const [newNetWorth, setNewNetWorth] = useState<string>('');

//   // Fetch data from Firebase
//   useEffect(() => {
//     const networthRef = firebase.database().ref('networth');
//     networthRef.on('value', (snapshot) => {
//       if (snapshot.exists()) {
//         setNetWorth(snapshot.val());
//       }
//     });

//     // Cleanup listener
//     return () => networthRef.off();
//   }, []);

//   // Update Net Worth in Firebase
//   const updateNetWorth = () => {
//     if (newNetWorth) {
//       firebase
//         .database()
//         .ref('networth')
//         .set(newNetWorth)
//         .then(() => {
//           alert('Net worth updated successfully!');
//           setNetWorth(newNetWorth);
//           setNewNetWorth('');
//         })
//         .catch((error) => console.error('Error updating net worth:', error));
//     }
//   };

//   return (
//     <View style={styles.cardView}>
//       {/* <Image style={styles.image} source={require('../../assets/images/worth.png')} /> */}
//       <View style={styles.worthView}>
//         <Text style={styles.headerText}>Total Worth</Text>
//         <Text style={styles.valueText}>{netWorth}</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter new net worth"
//         keyboardType="numeric"
//         value={newNetWorth}
//         onChangeText={setNewNetWorth}
//       />
//       <Button title="Update Net Worth" onPress={updateNetWorth} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cardView: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     margin: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     alignSelf: 'center',
//   },
//   worthView: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   valueText: {
//     fontSize: 24,
//     color: 'green',
//     marginTop: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 5,
//   },
// });

// export default NetWorthCard;
