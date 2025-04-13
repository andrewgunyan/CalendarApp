import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbbf89bfDNfMma_O7gUaW7cCmRusr34K4",
  authDomain: "calender-app-bdb02.firebaseapp.com",
  projectId: "calender-app-bdb02",
  storageBucket: "calender-app-bdb02.firebasestorage.app",
  messagingSenderId: "362099325187",
  appId: "1:362099325187:web:158325d1db73f99c0d5136"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
