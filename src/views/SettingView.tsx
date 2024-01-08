import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import auth from "@react-native-firebase/auth";
import * as Notifications from "expo-notifications";
import firestore from "@react-native-firebase/firestore";

const SettingView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const settings = await Notifications.getPermissionsAsync();
      setSwitchValue(settings.granted);
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const handleNotification = (notification: Notifications.Notification) => {
    // Handle the received notification based on your app's requirements
    console.log('Received notification:', notification);
  };

  // enable or disable notification.....
  const toggleSwitch = async (value: boolean) => {
    setLoading(true);
    try {
      if (value) {
        await Notifications.requestPermissionsAsync();
        Notifications.setNotificationHandler({
          handleNotification: async (notification) => {
            handleNotification(notification);
            return {
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            };
          },
        });
      } else {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
      }
      setSwitchValue(value);
    } catch (error) {
      console.error("Error toggling notification switch:", error);
      Alert.alert("Error", "Failed to toggle notification switch.");
    } finally {
      setLoading(false);
    }
  };

  // sign out.......
  const handleSignOut = () => {
    setLoading(true);
    try {
      Alert.alert(
        "Logout Confirmation",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              navigation.replace("Auth");
              await auth().signOut();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("Logout Error", error);
      setLoading(false);
    }
    setLoading(false);
  };

  // delete current user account.....
  const handleDeleteAccount = () => {
    const user = auth().currentUser;
    setLoading(true);
    if (user) {
      try {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account? This action is irreversible.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: async () => {
                const uid = user.uid; // Get the user's UID
                await firestore().collection("users").doc(uid).delete(); // Delete the user's data from Firestore
                await user.delete(); // Delete the user account
                navigation.navigate("Auth");
                console.log("Account and Firestore data deleted successfully");
              },
              style: "destructive",
            },
          ],
          { cancelable: false }
        );
        setLoading(false);
      } catch (error) {
        console.error("Error deleting account:", error);
        setLoading(false);
      }
    } else {
      console.error("No user signed in");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
      {!loading ? (
        <MapView data={""} />
      ) : (
        <ActivityIndicator
          size={"large"}
          color={"orange"}
          style={{ flex: 1 }}
        />
      )}
      <View style={styles.parentView}>
        {loading ? (
          <View style={[styles.subView, { justifyContent: "center" }]}>
            <ActivityIndicator size={"small"} color={"orange"} />
          </View>
        ) : (
          <View style={styles.subView}>
            <Text style={styles.text}>Notifications</Text>
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              <Switch
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.7 }] }}
                onValueChange={toggleSwitch}
                value={switchValue}
              />
              <Text style={styles.enableText}>
                {switchValue
                  ? "Notifications Enabled"
                  : "Notifications Disabled"}
              </Text>
            </View>
          </View>
        )}

        {!showDelete && (
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSignOut()}
            >
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={() => setShowDelete(!showDelete)}
            >
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {showDelete && (
          <View>
            <Text style={styles.message}>
              Are you sure? This can't be undone.
            </Text>
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() => setShowDelete(!showDelete)}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Never mind
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => handleDeleteAccount()}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parentView: {
    backgroundColor: "black",
    height: "auto",
    width: "96%",
    alignSelf: "center",
    marginTop: 25,
    borderRadius: 5,
    position: "absolute",
  },
  subView: {
    backgroundColor: "white",
    height: 90,
    width: "97%",
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  enableText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 8,
  },
  buttonView: {
    flexDirection: "row",
    height: 60,
    width: "98%",
    alignSelf: "center",
    marginTop: 13,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "orange",
    height: 40,
    width: "48%",
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    marginTop: 11,
    fontWeight: "bold",
  },
  message: {
    color: "white",
    alignSelf: "center",
    marginTop: 13,
    fontWeight: "bold",
  },
});
export default SettingView;
