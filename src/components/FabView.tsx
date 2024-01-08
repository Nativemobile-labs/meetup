import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';

const FabView: React.FC = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();
  const [isFABOpen, setIsFABOpen] = useState<boolean>(false);
  const [fabImage, setFabImage] = useState<string>('')

  useEffect(() =>{
    const imageUrl: any = auth().currentUser?.photoURL
    setFabImage(imageUrl)
  }, [])
  
  return (
    <SafeAreaView style={styles.container}>
      {isFABOpen && (
        <View style={styles.subButtons}>
          <TouchableOpacity
            style={styles.subButton}
            onPress={() => [nav.push("My Profile"), setIsFABOpen(false)]}
          >
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/user-avatar.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subButtonText}>PROFILE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subButton}
            onPress={() => [nav.push("My Twibs"), setIsFABOpen(false)]}
          >
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/pin.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subButtonText}>POST</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subButton}
            onPress={() => [nav.push("Friends"), setIsFABOpen(false)]}
          >
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/multiple-users-silhouette.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subButtonText}>FRIENDS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subButton}
            onPress={() => [nav.push("Settings"), setIsFABOpen(false)]}
          >
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/setting.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subButtonText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => [setIsFABOpen(!isFABOpen)]}
        style={[styles.fabButton, isFABOpen && styles.fabButtonOpen]}
      >
        {!isFABOpen ? (
          <Image
            source={{uri: fabImage}}
            style={{  height: 90, width: 90, borderRadius: 45 }}
          />
        ) : (
          <Image
            source={require("../../assets/boy-avatar.png")}
            style={{ height: 90, width: 90, borderRadius: 45 }}
          /> 
         )} 
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    left: 20,
  },
  subButtons: {
    position: "absolute",
    bottom: 90,
  },
  fabButton: {
    backgroundColor: "white",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gray",
  },
  subButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    width: 150,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "gray",
  },
  subButtonText: {
    color: "black",
    fontWeight: "bold",
    paddingLeft: 5,
  },
  imageView: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 2,
  },
  image: {
    height: 28,
    width: 28,
    borderRadius: 24,
    alignSelf: "center",
    marginTop: 4,
  },
  fabButtonOpen: {
    backgroundColor: "#FF3B30",
  },
});

export default FabView;
