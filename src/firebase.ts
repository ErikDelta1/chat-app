import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAY0nE0jOxNR8YpxAlbvgOzUV4x5pqPHHo",
  authDomain: "chat-app-89695.firebaseapp.com",
  projectId: "chat-app-89695",
  storageBucket: "chat-app-89695.appspot.com",
  messagingSenderId: "532516252555",
  appId: "",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);