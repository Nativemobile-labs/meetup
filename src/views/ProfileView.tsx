import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import MapView from "../components/MapView";

const ProfileView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userProfile, setUserProfile] = useState<string>("");
  const [listUserData, setListUserData] = useState<any | []>([]);
  const [listTreatData, setListTreatData] = useState<any | []>([]);
  const uid: any = auth().currentUser?.uid;

  // fetch profile data......
  useEffect(() => {
    try {
      setLoading(true);
      firestore()
        .collection("user")
        .doc(uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const listUserData = documentSnapshot.data();
            setListUserData(listUserData);
            setLoading(false)
          } else {
            console.log("User document does not exist");
            setLoading(false)
          }
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [name, userName, userProfile]);


  // set data in state......
  useEffect(() => {
    setName(listUserData.Name);
    setUserName(listUserData.UserName);
    setUserProfile(listUserData.Image);
  }, [listUserData]);

  // post list data......
  useEffect(() => {
    try {
      setLoading(true);
      firestore()
        .collection("Treat")
        .get()
        .then((querySnapshot) => {
          const temp: UserDetails[] = [];
          querySnapshot.forEach((documentSnapshot) => {
            const userDetails: UserDetails = {
              id: documentSnapshot.id,
              name: documentSnapshot.data() as any,
            };
            temp.push(userDetails);
          });
          setListTreatData(temp);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [listUserData]);

  // render post list......
  const renderPost = ({ item }: { item: any }) => {
    return (
      <View style={{ flex: 1}}>
        {item.name.UserID == uid ? (
          <ScrollView style={{ flex: 1 }}>
            {loading ? (
              <View
                style={[styles.listContainer, { justifyContent: "center" }]}>
                <ActivityIndicator size={"small"} color={"orange"} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.listContainer}
                onPress={() => navigation.navigate("Post", { item })} >
                {item.name.Image !== null ? (
                  <View style={styles.locationImageView}>
                    <Image
                      source={{ uri: item.name.Image }}
                      style={{ height: 45, width: 45, borderRadius: 22.5 }}
                    />
                  </View>
                ) : (
                  <View style={styles.locationImageView}>
                    <Image
                      source={require("../../assets/cafe.png")}
                      style={{ height: 35, width: 35 }}
                    />
                  </View>
                )}
                <Text
                  style={{
                    width: 270,
                    height: 20,
                    marginLeft: 5,
                    color: "black",
                    fontWeight: "500",
                  }}>
                  {item.name.Location.place_name}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={"orange"}
          style={{ flex: 1 }}
        />
      ) : (
        <>
        <MapView data={""} />
        <View style={styles.container}>
          <View style={styles.whiteDiv}>
            <TouchableOpacity
              onPress={() => navigation.push("Edit Profile")}
              style={styles.touchView}
            >
              <Image
                source={require("../../assets/compose.png")}
                style={[styles.edit, {tintColor: 'gray'}]}
              />
            </TouchableOpacity>

            <View style={styles.imageView}>
              {listUserData.Image !== null ? (
                <View style={styles.imageBorder}>
                  <Image source={{ uri: userProfile }} style={{height: 95, width: 95, borderRadius: 47.5}} />
                </View>
              ) : (
                <View style={styles.imageBorder}>
                  <Image
                    source={require("../../assets/boy-avatar.png")}
                    style={styles.image}
                  />
                </View>
              )}
              <Text style={styles.name}>{name}</Text>
              <Text
                style={[
                  { color: "gray", alignSelf: "center", fontWeight: "bold" },
                ]}
              >
                @{userName}
              </Text>
            </View>
            <Text style={styles.text}>Your Post will show up here</Text>
          </View>
          <View style={{ flex: 1}}>
          <FlatList
            data={listTreatData}
            renderItem={renderPost}
            scrollEnabled={true}
            keyExtractor={(item, index) => item.id.toString()}
          />
          </View>
        </View>
        </>
      )}
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    position: "absolute",
    width: "100%",
    height: "auto",
    marginTop: 0,
  },
  whiteDiv: {
    flex: 2,
    backgroundColor: "white",
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 5,
    height: 200,
  },
  touchView: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  edit: {
    height: 25,
    width: 25,
    tintColor: "gray",
  },
  imageView: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
  },
  image: {
    height: 115,
    width: 115,
    borderRadius: 57.5,
  },
  name: {
    color: "black",
    marginTop: 15,
    fontWeight: "bold",
    alignSelf: "center",
  },
  text: {
    color: "black",
    alignSelf: "center",
    marginTop: 55,
    fontSize: 18,
    fontWeight: "400",
  },
  imageBorder: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  locationImageView: {
    borderWidth: 2,
    borderColor: "gray",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    backgroundColor: "white",
    height: 60,
    width: "95%",
    alignSelf: "center",
    marginBottom: 5,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
  },
});

export default ProfileView;

interface UserDetails {
  id: string;
  name: {
    DOB: string;
    Gender: string;
    Image: null;
    Name: string;
    UserName: string;
  };
}
