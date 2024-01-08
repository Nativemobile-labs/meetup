import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const EditPostEdting: React.FC = ({ route, navigation }: any) => {
  const { item } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [choseFile, setChoseFile] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectFree, setSelectFree] = useState<string>("");
  const [selectPublic, setSelectPublic] = useState<string>("");
  const [showPaying, setShowPaying] = useState<boolean>(false);
  const [showVisibleTo, setShowVisibleTo] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);

  // set data in state.....
  useEffect(() => {
    const setData = async () => {
      await setSelectedDate(item.name.Date);
      await setSelectedTime(item.name.Time);
      await setDescription(item.name.Note);
      await setChoseFile(item.name.Image);
      await setSelectFree(item.name.PaymentType);
      await setSelectPublic(item.name.VisibleTo);
    };
    setData();
  }, [item]);

  // handle Update_Image.....
  const handleUpdateImage = async () => {
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
          .child("Posts/" + filename);
        const response = await fetch(localUri);
        const blob = await response.blob();
        await storageRef.put(blob);
        const imageURL = await storageRef.getDownloadURL();
        setChoseFile(imageURL);
        // setLoading(false);
      } catch (e) {
        console.error("Error uploading image:", e);
        // setLoading(false);
      }
    }
  };

  // handle Payment Type.....
  const handlePayingBills = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => [setSelectFree(item.message), setShowPaying(false)]}
      >
        <View
          style={{ flexDirection: "row", height: 40, alignItems: "center" }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={item.image}
              style={{ height: 18, width: 15, marginLeft: 8 }}
            />
            <Text
              style={{
                color: "black",
                fontWeight: "500",
                marginHorizontal: 8,
              }}
            >
              {item.message}
            </Text>
          </View>
          <View style={{ position: "absolute", right: 15 }}>
            <Image
              source={require("../../assets/right-arrow.png")}
              style={{ height: 15, width: 15 }}
            />
          </View>
        </View>
        <View
          style={{ marginHorizontal: 5, borderWidth: 0.7, borderColor: "gray" }}
        />
      </TouchableOpacity>
    );
  };

  // handle Public Type.....
  const handleVisibleData = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => [setSelectPublic(item.message), setShowVisibleTo(false)]}
      >
        <View
          style={{ flexDirection: "row", height: 40, alignItems: "center" }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={item.image}
              style={{ height: 18, width: 18, marginLeft: 8 }}
            />
            <Text
              style={{
                color: "black",
                fontWeight: "500",
                marginHorizontal: 8,
              }}
            >
              {item.message}
            </Text>
          </View>
          <View style={{ position: "absolute", right: 15 }}>
            <Image
              source={require("../../assets/right-arrow.png")}
              style={{ height: 15, width: 15 }}
            />
          </View>
        </View>
        <View
          style={{ marginHorizontal: 5, borderWidth: 0.7, borderColor: "gray" }}
        />
      </TouchableOpacity>
    );
  };

  // handle Update_Post......
  const handleUpdatePost = () => {
    try {
      setLoading(true);
      firestore()
        .collection('Treat')
        .doc(item.id)
        .update({
          Date: selectedDate,
          Time: selectedTime,
          Note: description,
          Image: choseFile,
          PaymentType: selectFree,
          VisibleTo: selectPublic,
        })
        .then(() => {
          console.log("Update successful");
          navigation.navigate("Home");
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error updating post:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // handle delete post.......
  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setLoading(true);
            try {
              firestore()
                .collection('Treat')
                .doc(item.id)
                .delete()
                .then(() => {
                  console.log("Post deleted successfully");
                  navigation.navigate("Home");
                  setLoading(false);
                });
            } catch (error) {
              console.error("Error deleting post:", error);
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // handle calendar.....
  const onDayPress = (day: any) => {
    const selectDate = moment(day.dateString).format("DD-MM-YYYY");
    setSelectedDate(selectDate);
    setShowDate(false);
  }

  // handle watch......
 
  return (
    <SafeAreaView style={styles.container}>
      {!loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <ScrollView style={{flex: 1}}>
          <View style={styles.mainContainer}>
            <View style={styles.placeView}>
              <TouchableOpacity
                style={{ position: "absolute", right: 10 }}
                onPress={() => handleDeletePost()}
              >
                <Image
                  source={require("../../assets/delete.png")}
                  style={{ height: 30, width: 30, tintColor: "red" }}
                />
              </TouchableOpacity>

              <Text style={styles.placeName}>
                {item.name && item.name.Location.place_name.length > 30
                  ? item.name.Location.place_name.slice(0, 30)
                  : item.name.Location.place_name}
              </Text>
              <Text style={{ color: "gray", fontWeight: "400" }}>
                {item.name && item.name.Location.place_name.length > 30
                  ? item.name.Location.place_name.slice(0, 30)
                  : item.name.Location.place_name}
              </Text>
            </View>

            <View style={styles.dateMainView}>
              <TouchableOpacity
                onPress={() => setShowDate(true)}
                style={styles.dateView}
              >
                <Text style={[styles.dateText, { fontWeight: "500" }]}>
                  {selectedDate}
                </Text>
              </TouchableOpacity>

              {/* modal show Date */}
              <Modal
                visible={showDate}
                transparent={true}
                animationType="slide"
              >
                <View style={{flex: 1, marginTop: 50}}>
                  <Calendar
                  onDayPress={onDayPress}
                  style={styles.calendarModal}
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
                 <TouchableOpacity
                    onPress={() => setShowDate(false)}
                    style={{ position: "absolute", right: 55, top: 55 }}
                  >
                    <Image
                      source={require("../../assets/multiply.png")}
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>
                </View>
              </Modal>

              <TouchableOpacity
                onPress={() => setShowTime(true)}
                style={styles.dateView}
              >
                <Text style={[styles.dateText, { fontWeight: "500" }]}>
                  {selectedTime}
                </Text>
              </TouchableOpacity>

              {/* modal show time */}
              <Modal
                visible={showTime}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.openModal}>
                  <TouchableOpacity
                    onPress={() => setShowTime(false)}
                    style={{ position: "absolute", right: 5, top: 5 }}
                  >
                    <Image
                      source={require("../../assets/multiply.png")}
                      style={{ height: 25, width: 25 }}
                    />
                  </TouchableOpacity>
                 
                </View>
              </Modal>
            </View>

            <View style={styles.desc}>
              <TextInput
                style={{ fontWeight: "500", color: "black", padding: 5 }}
                multiline={true}
                value={description}
                onChangeText={(description) => setDescription(description)}
              />
            </View>

            {choseFile !== null ? (
              <View style={styles.imageView}>
                <Image source={{ uri: choseFile }} style={styles.image} />
              </View>
             ) : (
               <View style={[styles.imageView, {borderWidth: 2}]}>
                 <Text style={{color: 'gray', fontWeight:'bold'}}>No image uploaded !</Text>
               </View>
             )} 

            <TouchableOpacity
              onPress={() => handleUpdateImage()}
              style={[styles.imageButton, { height: 35, flexDirection: "row" }]}
            >
              <Image
                source={require("../../assets/image.png")}
                style={{ height: 15, width: 15 }}
              />
              <Text style={[styles.imageText, { marginLeft: 5 }]}>
                Update_Image
              </Text>
            </TouchableOpacity>

            <View style={[styles.line, { marginHorizontal: 5 }]} />

            <View style={styles.payingView}>
              <Text style={styles.payingText}>Who's Paying:</Text>
              <TouchableOpacity
                onPress={() => setShowPaying(true)}
                style={styles.public}
              >
                <Text style={{ color: "black" }}>{selectFree}</Text>
                <Image
                  source={require("../../assets/right-arrow.png")}
                  style={{ height: 10, width: 10, marginTop: 4 }}
                />
              </TouchableOpacity>
            </View>

            {/* modal show paying */}
            <Modal visible={showPaying} transparent={true}>
              <View style={styles.openModal}>
                <TouchableOpacity
                  onPress={() => setShowPaying(false)}
                  style={{ position: "absolute", right: 5, top: 5 }}
                >
                  <Image
                    source={require("../../assets/multiply.png")}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
                <Text style={styles.modalPlace}>
                  {item.name && item.name.Location.place_name.length > 25
                    ? item.name.Location.place_name.slice(0, 25)
                    : item.name.Location.place_name}
                </Text>
                <FlatList
                  data={payingBill}
                  keyExtractor={(item) => item.id}
                  renderItem={handlePayingBills}
                />
              </View>
            </Modal>

            <View style={[styles.line, { marginHorizontal: 5 }]} />

            <View style={styles.payingView}>
              <Text style={styles.payingText}>Visible To:</Text>
              <TouchableOpacity
                onPress={() => setShowVisibleTo(!showVisibleTo)}
                style={styles.public}
              >
                <Text style={{ color: "black" }}>{selectPublic}</Text>
                <Image
                  source={require("../../assets/right-arrow.png")}
                  style={{ height: 10, width: 10, marginTop: 4 }}
                />
              </TouchableOpacity>
            </View>

            {/* modal show visibility */}
            <Modal visible={showVisibleTo} transparent={true}>
              <View style={[styles.openModal, { height: 210 }]}>
                <TouchableOpacity
                  onPress={() => setShowVisibleTo(false)}
                  style={{ position: "absolute", right: 5, top: 5 }}
                >
                  <Image
                    source={require("../../assets/multiply.png")}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
                <Text style={[styles.modalPlace, { marginBottom: 4 }]}>
                  {item.name && item.name.Location.place_name.length > 25
                    ? item.name.Location.place_name.slice(0, 25)
                    : item.name.Location.place_name}
                </Text>
                <FlatList
                  data={visibleData}
                  keyExtractor={(item) => item.id}
                  renderItem={handleVisibleData}
                />
              </View>
            </Modal>

            <View
              style={[styles.line, { marginBottom: 15, marginHorizontal: 5 }]}
            />
          </View>
        </ScrollView>
      )}
      
      <TouchableOpacity
        onPress={() => handleUpdatePost()}
        style={[styles.imageButton, { backgroundColor: "black" , borderColor: 'silver', marginBottom: 10}]}
      >
        <Text style={[styles.imageText, { color: "white" }]}>Update Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditPostEdting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    marginHorizontal: 10,
    marginTop: 50,
  },
  placeView: {
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  placeName: {
    color: "black",
    fontWeight: "400",
    fontSize: 18,
  },
  dateMainView: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  dateView: {
    height: 40,
    width: 170,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dateText: {
    color: "black",
    marginLeft: 5,
  },
  desc: {
    height: 80,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "silver",
    marginHorizontal: 5,
  },
  imageView: {
    height: 150,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  line: {
    marginTop: 10,
    borderWidth: 0.7,
    borderColor: "gray",
  },
  payingView: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    height: 40,
    marginHorizontal: 10
  },
  payingText: {
    color: "black",
  },
  public: {
    backgroundColor: "silver",
    padding: 4,
    flexDirection: "row",
  },
  imageButton: {
    height: 40,
    marginTop: 10,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  imageText: {
    color: "black",
    fontWeight: "bold",
  },
  openModal: {
    height: 250,
    width: 300,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: 220,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
  },
  image: {
    height: 145,
    width: 360,
    borderRadius: 5,
    resizeMode: "cover",
    borderColor: 'gray',
    borderWidth: 2,

  },
  modalPlace: {
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 3,
  },
  calendarModal: {
    borderRadius: 5,
    margin: 50,
    elevation: 5,
    borderWidth: 4,
    borderColor: "gray",
  },
});

const payingBill: payingBillItem[] = [
  {
    id: "1",
    image: require("../../assets/magic-dust.png"),
    message: "Treat Me",
  },
  {
    id: "2",
    image: require("../../assets/cherries.png"),
    message: "Splitsies",
  },
  {
    id: "3",
    image: require("../../assets/giftbox.png"),
    message: "My Treat",
  },
  {
    id: "4",
    image: require("../../assets/prize.png"),
    message: "Free",
  },
  {
    id: "5",
    image: require("../../assets/money.png"),
    message: "Pay what you can",
  },
];

const visibleData: VisibleDataItem[] = [
  {
    id: "1",
    image: require("../../assets/globe.png"),
    message: "Public",
  },
  {
    id: "2",
    image: require("../../assets/multiple-users-silhouette.png"),
    message: "Friends & Their Friends",
  },
  {
    id: "3",
    image: require("../../assets/friends.png"),
    message: "Friends",
  },
  {
    id: "4",
    image: require("../../assets/selection.png"),
    message: "Select Friends",
  },
];

// Define a type or interface for the objects in the array
type VisibleDataItem = {
  id: string;
  image: null;
  message: string;
};

// Define a type or interface for the objects in the array
type payingBillItem = {
  id: string;
  image: null;
  message: string;
};
