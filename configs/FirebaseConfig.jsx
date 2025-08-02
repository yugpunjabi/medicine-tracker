import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCCG-xSgwkFxTzIAr9jBH3TKMWLQ3YTYZk",
  authDomain: "medicine-tracker-app-898cb.firebaseapp.com",
  projectId: "medicine-tracker-app-898cb",
  storageBucket: "medicine-tracker-app-898cb.firebasestorage.app",
  messagingSenderId: "721634636098",
  appId: "1:721634636098:web:ff78b38a53c285f37218db",
  measurementId: "G-T0EGEB5XBG"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const db = getFirestore(app);

export { auth, db };
