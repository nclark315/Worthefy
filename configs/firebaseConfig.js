// firebaseConfig.ts
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";


// const firebaseConfig = {
//     apiKey: "AIzaSy...",
//     authDomain: "worthefy-default-rtdb.firebaseapp.com",
//     databaseURL: "https://worthefy-default-rtdb.firebaseio.com",
//     projectId: "worthefy-default-rtdb",
//     storageBucket: "worthefy-default-rtdb.appspot.com",
//     messagingSenderId: "123456789",
//     appId: "1:123456789:web:abcdef123456",
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };

// // Initialize Realtime Database
// export const database = getDatabase(app);
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB20KRSb2wDbJOQ5S-s29A6fAFk2Bm5b40",
    authDomain: "worthefy.firebaseapp.com",
    databaseURL: "https://worthefy-default-rtdb.firebaseio.com",
    projectId: "worthefy",
    storageBucket: "worthefy.firebasestorage.app",
    messagingSenderId: "453329433128",
    appId: "1:453329433128:web:6a9691786d56a5b0cebb1d",
    measurementId: "G-XNS23SRTNS"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
