import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setApiUser, setUserAuth } from "../features/user/user-slice";
import { fetchUser } from "../lib/api/users";
import { UserModel } from "../lib/types";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";

import SplashView from "../views/SplashView";
import LoginView from "../views/LoginView";
import RootView from "../views/RootView";
import ProfileView from "../views/ProfileView";
import TwibsView from "../views/TwibsView";
import FriendsView from "../views/FriendsView";
import SettingView from "../views/SettingView";
import EditProfileView from "../views/EditProfileView";
import FriendsViewProfile from "../components/FriendsViewProfile";
import TwibModal from "../components/TwibModal";
import MapView from "../components/MapView";
import SignupView from "../views/SignupView";
import ActiveMessage from "../components/ActiveMessage";
import SelectFriends from "../views/SelectFriends";
import EditPost from "../components/EditPost";
import ViewJoinPost from "../views/ViewJoinPost";
import EditPostEdting from "../components/EditPostEdting";
import NotificationView from "../components/NotificationView";


const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = ({navigation}: any) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.user.auth);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //   });
  //   const unsubscribe2 = auth().onAuthStateChanged((user) => {
  //     if (user === null && authUser !== null) {
  //       dispatch(setUserAuth(null));
  //       dispatch(setApiUser(null));
  //       // nav.push("Login");
  //     }
  //   });
  //   return () => {
  //     unsubscribe2();
  //     unsubscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!isInitialized) {
  //     const user = auth().currentUser;
  //     if (user) {
  //       user
  //         .getIdTokenResult()
  //         .then((tokenResult) => {
  //           dispatch(
  //             setUserAuth({
  //               user: user,
  //               accessToken: tokenResult.token,
  //               uid: user.uid,
  //             })
  //           );
  //         })
  //         .then(fetchUser)
  //         .then((apiUser: UserModel) => {
  //           dispatch(setApiUser(apiUser));
  //           setIsInitialized(true);
  //         });
  //     }
  //   } else {
  //     dispatch(setUserAuth(null));
  //     dispatch(setApiUser(null));
  //     setIsInitialized(true);
  //   }
  // }, [isInitialized]);


  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashView}
        options={{ headerShown: false }}
      />

       <Stack.Screen
        name="Auth"
        component={AuthenticationView}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={RootView}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="twinModal"
        component={TwibModal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="My Profile"
        component={ProfileView}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="My Twibs"
        component={TwibsView}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Friends"
        component={FriendsView}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingView}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Edit Profile"
        component={EditProfileView}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Friends Profile"
        component={FriendsViewProfile}
        options={{ headerShown: true }}
      />  

      <Stack.Screen
        name="MapView"
        component={MapView}
        options={{ headerShown: false }}
      /> 
      
      <Stack.Screen
        name="Active"
        component={ActiveMessage}
        options={{ headerShown: true }}
      /> 

      <Stack.Screen
        name="Select Friend"
        component={SelectFriends}
        options={{ headerShown: true }}
      /> 

      <Stack.Screen
        name="Post"
        component={EditPost}
        options={{ headerShown: true }}
      /> 

      <Stack.Screen
        name="Edit Post"
        component={EditPostEdting}
        options={{ headerShown: true }}
      /> 

      <Stack.Screen
        name="Join Post"
        component={ViewJoinPost}
        options={{ headerShown: true }}
      /> 

      <Stack.Screen
        name="Notification"
        component={NotificationView}
        options={{ headerShown: true }}
      />    
    </Stack.Navigator>
  );
};

export default RootNavigation;

// define authentication routes......
const AuthenticationView = () => {
  return(
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginView}
        options={{ headerShown: true }}
      />
       <Stack.Screen
        name="Signup"
        component={SignupView}
        options={{ headerShown: true }}
      /> 
    </Stack.Navigator>
  )
}