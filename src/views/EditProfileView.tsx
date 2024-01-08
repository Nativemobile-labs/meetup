import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import moment from "moment";

const EditProfileView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [choseFile, setChoseFile] = useState<any>(null);
  const [dropDownIsVisible, setDropDownIsVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<String>("selectedValue");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("SelectDate");
  const [listDataShow, setListDataShow] = useState<any | []>([]);

  const uid: any = auth().currentUser?.uid; // current user id

  useEffect(() => {
    setLoading(false);
    try {
      firestore()
        .collection("user")
        .doc(uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const listDataShow = documentSnapshot.data();
            setListDataShow(listDataShow);
            setLoading(false);
            handleUpdateProfile();
          } else {
            setLoading(false);
            console.log("User document does not exist");
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [uid]);

  // set data in state......
  useEffect(() => {
    setFirstName(listDataShow.Name),
    setUserName(listDataShow.UserName),
    setSelectedDate(listDataShow.DOB);
    setSelectedValue(listDataShow.Gender), 
    setChoseFile(listDataShow.Image);
  }, [listDataShow]);

  // update data on firestore.......
  const handleUpdate = () => {
    try {
      setLoading(true);
      firestore()
        .collection("user")
        .doc(uid)
        .set({
          Name: firstName,
          UserName: userName,
          DOB: selectedDate,
          Gender: selectedValue,
          Image: choseFile,
          userIm: auth().currentUser?.uid,
        })
        .then(() => {
          setFirstName(""), 
          setUserName(""), 
          setSelectedDate("selectDate"),
          setSelectedValue("selectedValue"), 
          setChoseFile(null),
          navigation.navigate("My Profile");
        });
        setLoading(false)
    } catch (error) {
      console.log('user update error',error);
      setLoading(false);
    }
  };

  // handle Update Profile.......
  const handleUpdateProfile = async () => {
    const user = auth().currentUser; // current user id
    setLoading(true)
    if (user) {
      try {
        await user.updateProfile({
          displayName: listDataShow.Name,
          photoURL: listDataShow.Image,
        });
        console.log("Profile set successfully");
        setLoading(false)
      } catch (error) {
        console.error("Error setting profile:", error);
        setLoading(false)
      }
    } else {
      console.error("No user signed in");
      setLoading(false)
    }
  };

  // handle calender.....
  const onDayPress = (day: any) => {
    const selectDate = moment(day.dateString).format("DD-MM-YYYY");
    setSelectedDate(selectDate);
    setShowCalendar(false);
  };

  // handle image picker and upload in firebase storage......
  const handleChosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        const localUri = result.assets[0].uri;
        const filename = localUri.split("/").pop();
        const storageRef = storage()
          .ref()
          .child("profile/" + filename);
        const response = await fetch(localUri);
        const blob = await response.blob();
        await storageRef.put(blob);
        const imageURL = await storageRef.getDownloadURL();
        setChoseFile(imageURL);
        setLoading(false);
      } catch (e) {
        console.error("Error uploading image:", e);
      }
    }
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
        <View style={styles.container}>
          <Text style={styles.text}>First Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor={"gray"}
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
          />

          <Text style={styles.text}>User Name</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.userView}>
              <Text style={{ color: "gray", alignSelf: "center" }}>@</Text>
            </View>
            <TextInput
              style={[styles.textInput, { marginLeft: 30, paddingLeft: 70 }]}
              placeholder="User Name"
              placeholderTextColor={"gray"}
              value={userName}
              onChangeText={(userName) => setUserName(userName)}
            />
          </View>

          <Modal visible={showCalendar} transparent={true} animationType="fade">
            <SafeAreaView style={{ flex: 1 }}>
              <Calendar
                onDayPress={onDayPress}
                style={styles.celandarModal}
                theme={{
                  calendarBackground: "#222",
                  dayTextColor: "#fff",
                  textDisabledColor: "#444",
                  monthTextColor: "#888",
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                }}
              />
              <Button
                title="Close Calendar"
                onPress={() => setShowCalendar(false)}
              />
            </SafeAreaView>
          </Modal>

          <Text style={styles.text}>Birth Date</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={[styles.textInput, { justifyContent: "center" }]}
          >
            {selectedDate !== "" && <Text>{selectedDate}</Text>}
            <Image
              source={require("../../assets/calendar.png")}
              style={styles.calendar}
            />
          </TouchableOpacity>

          <Text style={styles.text}>Gender</Text>
          <TouchableOpacity
            style={[styles.textInput, { justifyContent: "center" }]}
            onPress={() => setDropDownIsVisible(!dropDownIsVisible)}
          >
            <Text>{selectedValue}</Text>
            {dropDownIsVisible ? (
              <Image
                source={require("../../assets/up-arrow.png")}
                style={styles.arrow}
              />
            ) : (
              <Image
                source={require("../../assets/down-arrow.png")}
                style={styles.arrow}
              />
            )}
          </TouchableOpacity>

          {dropDownIsVisible && (
            <View
              style={{
                backgroundColor: "#D8D8D8",
                height: 120,
                width: "85%",
                position: "relative",
                alignSelf: "center",
                marginTop: -10,
                borderRadius: 5,
              }}
            >
              <FlatList
                data={listData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => [
                      setSelectedValue(item.value),
                      setDropDownIsVisible(false),
                    ]}
                  >
                    <View style={[styles.dropDownList]}>
                      <Text style={{ color: "black" }}>{item.value}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Text style={[styles.text]}>Change Your Profile Photo</Text>
          <TouchableOpacity
            onPress={() => handleChosePhoto()}
            style={{ flexDirection: "row" }}
          >
            <>
              <View style={styles.choseView}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Choose file</Text>
              </View>
              <View style={[styles.textInput, styles.chose]}>
                <Text style={{ color: "gray" }}>
                  {choseFile ? choseFile : "No file chosen"}
                </Text>
              </View>
            </>
          </TouchableOpacity>

          <Text style={styles.message}>
            Leave this empty if you don't want to change your photo
          </Text>

          <TouchableOpacity
            onPress={() => handleUpdate()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  text: {
    color: "black",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 40,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    height: 40,
    width: "85%",
    borderRadius: 10,
    alignSelf: "center",
    paddingLeft: 15,
  },
  userView: {
    height: 40,
    width: 60,
    backgroundColor: "#d8D8D8D8",
    justifyContent: "center",
    position: "absolute",
    marginLeft: 30,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  calendar: {
    height: 20,
    width: 20,
    position: "absolute",
    right: 15,
  },
  arrow: {
    height: 15,
    width: 15,
    position: "absolute",
    right: 15,
  },
  dropDownList: {
    marginLeft: 15,
    marginTop: 10,
    position: "relative",
  },
  activeList: {
    backgroundColor: "gray",
  },
  choseView: {
    backgroundColor: "black",
    height: 40,
    borderRadius: 10,
    position: "absolute",
    width: 100,
    marginLeft: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  chose: {
    marginLeft: 30,
    paddingLeft: 110,
    position: "relative",
    justifyContent: "center",
  },
  message: {
    fontSize: 12,
    marginTop: 8,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "black",
    height: 40,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  celandarModal: {
    borderRadius: 5,
    margin: 50,
    elevation: 5,
    borderWidth: 4,
    borderColor: "gray",
  },
});
export default EditProfileView;

const listData = [
  { id: "1", value: "Male" },
  { id: "2", value: "Female" },
  { id: "3", value: "Transgender Male" },
  { id: "4", value: "Transgender Female" },
];
