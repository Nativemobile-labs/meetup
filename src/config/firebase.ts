// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // import { getMessaging, getToken, isSupported } from "firebase/messaging";
// // import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// // export const storage = getStorage(app);
// // export const messaging = getMessaging(app);

// export const supportsMessaging = async (): Promise<boolean> => {
//   return await isSupported();
// };

// export const getFirebasePushToken = async (): Promise<string> => {
//   if (!(await supportsMessaging())) return "";

//   try {
//     return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
//   } catch (e) {
//     console.error(e);
//     return "";
//   }
// };


import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase};