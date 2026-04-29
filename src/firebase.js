import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBAiqwQTI8-9jksMejtK4JNPFgHlOFR-HE",
    authDomain: "hyte-s-forms.firebaseapp.com",
    projectId: "hyte-s-forms",
    storageBucket: "hyte-s-forms.firebasestorage.app",
    messagingSenderId: "536001930678",
    appId: "1:536001930678:web:5dae2b0a6fbaec40ebcd17"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);