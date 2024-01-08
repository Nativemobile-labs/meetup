// import {
//         View,
//         Text,
//         ActivityIndicator,
//         SafeAreaView,
//         Platform,
//         Button,
//       } from "react-native";
//       import React, { useState, useEffect, useRef } from "react";
//       import * as Notifications from "expo-notifications";
//       import * as Device from "expo-device";
//       import Constants from 'expo-constants'; 

//       Notifications.setNotificationHandler({
//         handleNotification: async () => ({
//           shouldShowAlert: true,
//           shouldPlaySound: false,
//           shouldSetBadge: false,
//         }),
//       });
      
//       const NotificationView = () => {
//         const [loading, setLoading] = useState<boolean>(true);
//         const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//         const [notification, setNotification] = useState<Notifications.Notification>();
//         const notificationListener = useRef<Notifications.Subscription>();
//         const responseListener = useRef<Notifications.Subscription>();
      
//         useEffect(() => {
//           const registerForPushNotificationsAsync = async () => {
//             let token;
      
//             if (Platform.OS === "android") {
//               await Notifications.setNotificationChannelAsync("default", {
//                 name: "default",
//                 importance: Notifications.AndroidImportance.MAX,
//                 vibrationPattern: [0, 250, 250, 250],
//                 lightColor: "#FF231F7C",
//               });
//             }
      
//             if (Device.isDevice) {
//               const { status: existingStatus } = await Notifications.getPermissionsAsync();
//               let finalStatus = existingStatus;
      
//               if (existingStatus !== "granted") {
//                 const { status } = await Notifications.requestPermissionsAsync();
//                 finalStatus = status;
//               }
      
//               if (finalStatus !== "granted") {
//                 alert("Failed to get push token for push notification!");
//                 return;
//               }
      
//               // Explicitly provide the projectId
//               const expoPushToken = await Notifications.getExpoPushTokenAsync({
//                 projectId: Constants.expoConfig.extra.eas.projectId, // Replace with your actual project ID
//               });
//               token = expoPushToken.data;
//               setExpoPushToken(token);
//               setLoading(false);
//             } else {
//               alert("Must use physical device for Push Notifications");
//             }
      
//             return token;
//           };
      
//           registerForPushNotificationsAsync();
      
//           notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//             console.log('notification is received', notification);
//             setNotification(notification);
//           });
      
//           responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//             console.log('response', response);
//           });
      
//           return () => {
//             if (notificationListener.current) {
//               Notifications.removeNotificationSubscription(notificationListener.current);
//             }
//             if (responseListener.current) {
//               Notifications.removeNotificationSubscription(responseListener.current);
//             }
//           };
//         }, []);
      
//         const schedulePushNotification = async () => {
//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: "You've got mail! 📬",
//               body: "Here is the notification body",
//               data: { data: "goes here" },
//             },
//             trigger: { seconds: 2 },
//           });
//         };
//       console.log(expoPushToken)
//         return (
//           <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//             {loading ? (
//               <View style={{ flex: 1, justifyContent: "center" }}>
//                 <ActivityIndicator size={"large"} color={"orange"} />
//               </View>
//             ) : (
//               <View style={{ flex: 1, backgroundColor: "red", marginHorizontal: 10 }}>
//                 <Button
//                   title="Press to schedule a notification"
//                   onPress={async () => {
//                     await schedulePushNotification();
//                   }}
//                 />
//                 <Text>Expo Push Token: {expoPushToken}</Text>
//                 {notification && (
//                   <View>
//                     <Text>Received Notification:</Text>
//                     <Text>Title: {notification.request.content.title}</Text>
//                     <Text>Body: {notification.request.content.body}</Text>
//                   </View>
//                 )}
//               </View>
//             )}
//           </SafeAreaView>
//         );
//       };
      
//       export default NotificationView;
      import { View, Text } from 'react-native'
      import React from 'react'
      
      const NotificationView = () => {
        return (
          <View>
            <Text>NotificationView</Text>
          </View>
        )
      }
      
      export default NotificationView