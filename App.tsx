import React, { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/state/store";
import messaging from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/routes/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [initialRoute, setInitialRoute] = useState("Home");
  
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        sound: true,
        announcement: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log("Authorization status:", authStatus);
      }
    } catch (error) {
      console.error("Error requesting user permission:", error);
    }
  };

  useEffect(() => {
    const getFcmToken = async () => {
      const checkToken = await AsyncStorage.getItem("fcmToken");
      // console.log("the old token:", checkToken);
      if (!token) {
        requestUserPermission()
          .then(() => messaging().getToken())
          .then((newToken: string) => {
            setToken(newToken);
            AsyncStorage.setItem("fcmToken", newToken);
            console.log("Push notification token:", newToken);
            // firestore().collection('DeviceToken').doc().set({
            //   token: newToken
            // })
          })
          .catch((error) => {
            console.error("Error getting token:", error);
          });
      }
    };
    getFcmToken();
  }, [token]);


  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('message handler in the background!:', remoteMessage)
    })
    const unsubscribe = messaging().onMessage(async remoteMessage =>{
      Alert.alert('A new FCM message Arrived!:', JSON.stringify(remoteMessage))
      // console.log('A new FCM message Arrived!:',remoteMessage)
    })
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   // working conditions for foreground
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   // also working for background
  //   const unsubscribe = messaging().setBackgroundMessageHandler(
  //     async (remoteMessage) => {
  //       console.log("Message handled in the background!", remoteMessage);
  //     }
  //   );
  //   return unsubscribe;
  // }, []);



  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
