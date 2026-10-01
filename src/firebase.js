import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAet9afI9cWxyXVM89XsrG4fZ0x3Rp2esU",
  authDomain: "bridgecart-2672f.firebaseapp.com",
  projectId: "bridgecart-2672f",
  storageBucket: "bridgecart-2672f.firebasestorage.app",
  messagingSenderId: "886531980901",
  appId: "1:886531980901:web:2d419a115ef628cfd4908c",
  measurementId: "G-B7QHJCYD3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

export default app;