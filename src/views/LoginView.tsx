import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../state/hooks";
import { setApiUser, setUserAuth } from "../features/user/user-slice"; //define types
import { createUser, fetchUser } from "../lib/api/users";
import { StatusBar } from "expo-status-bar";



const LoginView: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const appUser = useAppSelector((state) => state.user.user);
  const appAuth = useAppSelector((state) => state.user.auth);

  const [phone, setPhone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState("");


  // Handle login
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  };

  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged);
  }, []);


  // Handle the button press
  async function signInWithPhoneNumber(phone: string) {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    console.log('confirmation',confirmation)
    setConfirm(confirmation);
  }

  // handle phone validation.....
  const handleSubmit = async () => {
    if (phone.length !== 10) {
      return;
    }
    setIsSubmitting(true);
    await signInWithPhoneNumber(`+91${phone}`);
    setIsSubmitting(false);
  };


  // handle confirmation........
  const handleConfirm = async () => {
    try {
      const userCredential = await confirm!.confirm(code);
      navigation.replace(auth().currentUser ? "Home" : "Signup"); 
      // navigation.replace("Signup"); 
      if (!userCredential) {
        return;
      }
      const user = userCredential.user;
      dispatch(
        setUserAuth({
          user,
          accessToken: (await user.getIdTokenResult()).token,
          uid: user.uid,
        })
      );

      const appuser = await createUser(phone);
      dispatch(setApiUser(appuser));

      if (appuser.status === "created") {
        navigation.push("Signup");
      } else {
        const appuser = await fetchUser();
        dispatch(setApiUser(appuser));
        navigation.replace(auth().currentUser ? "Home" : "Signup"); 
        // navigation.replace("Home"); 
      }
      console.log(user);
    } catch (error) {
      // @ts-ignore
      console.log(error, error.message, error.stack, error.trace);
      console.log("Invalid otp code.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {confirm === null && (
        <View>
          <Text style={styles.text}>Phone Login</Text>
          {!isSubmitting && (
            <TextInput
              style={styles.textInput}
              placeholder="Phone Number"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={phone}
              onChangeText={(phone) => setPhone(phone)}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Get Otp!</Text>
          </TouchableOpacity>
          {isSubmitting && <ActivityIndicator size="large" color="orange" />}
        </View>
      )}

      {confirm !== null && (
        <View>
          <Text style={styles.text}>Confirm Otp</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter otp"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={code}
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 30,
    color: "orange",
    fontWeight: "bold",
    marginTop: 200,
    alignSelf: "center",
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    paddingLeft: 15,
    width: "80%",
    alignSelf: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "orange",
    borderRadius: 25,
    height: 40,
    width: "70%",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 8,
  },
});

export default LoginView;
