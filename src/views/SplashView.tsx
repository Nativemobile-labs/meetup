import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

const SplashView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(auth().currentUser ? "Home" : "Auth");
      setLoading(false);
    }, 3000);
  }, [loading]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="orange"
          style={styles.container}
        />
      ) : (
        <View style={styles.container}>
          <Image
            source={require("../../assets/cafe.png")}
            style={styles.image}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
  },
  image: {
    height: 250,
    width: 250,
  },
});
export default SplashView;
