// import * as firebase from 'firebase';
// import '@firebase/auth';
// import '@firebase/firestore';


// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string,
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export { firebase};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };