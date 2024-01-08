import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import RootView from "../views/RootView";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import moment from "moment";

const TwibModal: React.FC = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showWatch, setShowWatch] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formateTime, setFormatTime] = useState<string>("");
  const [showPaying, setShowPaying] = useState<boolean>(false);
  const [selectFree, setSelectFree] = useState<string>("Treat Me");
  const [showVisibleTo, setShowVisibleTo] = useState<boolean>(false);
  const [selectPublic, setSelectPublic] = useState<string>("Public");
  const [choseFile, setChoseFile] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [inputHeight, setInputHeight] = useState(70);
  const uid: any = auth().currentUser?.uid;
  const { item } = route.params;

  useEffect(() => {
    // Function to format the current time in 12-hour format with AM/PM
    const formatTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      // Create a string in the format "hh:mm AM/PM"
      const formattedTime = `${formattedHours}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
      setFormatTime(formattedTime);
    };
    // Call the formatTime function to get and display the current time
    formatTime();

    // Update the time every minute
    const interval = setInterval(formatTime, 60000);
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  // upload photo.......
  const handlePhoto = async () => {
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
        setLoading(false);
      } catch (e) {
        console.error("Error uploading image:", e);
        setLoading(false);
      }
    }
  };

  // handle calender.....
  const onDayPress = (day: any) => {
    const selectDate = moment(day.dateString).format("DD-MM-YYYY");
    setSelectedDate(selectDate);
    setShowCalendar(false);
  };

  // handle time....
  const handleSetTime = () => {
    setSelectedTime(selectedTime);
    setShowWatch(false);
  };

  // add new treat......
  const addNewTwibs = async () => {
    try {
      setLoading(true);
      await firestore()
        .collection("Treat")
        .doc()
        .set({
          Date: selectedDate,
          Time: selectedTime,
          Note: description,
          Image: choseFile,
          PaymentType: selectFree,
          VisibleTo: selectPublic,
          Location: item,
          UserID: uid,
        })
        .then(() => {
          console.log("update successfully");
          navigation.navigate("Home");
          setSelectedDate(""),
            setSelectedTime(""),
            setDescription(""),
            setChoseFile(null),
            setSelectFree("Treat Me"),
            setSelectPublic("Public");
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    console.log('button is working')
      // navigation.navigate("Home"), 
    setShowModal(false)

  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={"orange"}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <RootView />
          <Modal animationType="slide" transparent={true} visible={showModal}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={[styles.modalContainer, { position: "relative" }]}>
                <TouchableOpacity
                  style={styles.closeView}
                  onPress={() => handleModalClose()}
                >
                  <Image
                    source={require("../../assets/close.png")}
                    style={styles.closeButton}
                  />
                </TouchableOpacity>

                <View>
                  <Text
                    style={{
                      alignSelf: "center",
                      marginTop: 40,
                      fontWeight: "bold",
                    }}
                  >
                    I want to go to
                  </Text>
                  <Text style={styles.placeTextView}>
                    {item && item.place_name.length > 30
                      ? item.place_name.slice(0, 30)
                      : item.place_name}
                  </Text>
                  <Text
                    style={[
                      styles.placeTextView,
                      { color: "gray", fontSize: 13 },
                    ]}
                  >
                    {item && item.place_name.length > 30
                      ? item.place_name.slice(0, 30)
                      : item.place_name}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                >
                  <Text style={{ marginTop: 5, color: "black", fontSize: 15 }}>
                    Add Details
                  </Text>
                  <Text style={{ marginTop: 5, color: "gray", fontSize: 15 }}>
                    (optional):
                  </Text>
                </View>

                <View style={styles.anyDayView}>
                  <TouchableOpacity
                    style={styles.anyDay}
                    onPress={() => setShowCalendar(true)}
                  >
                    {!selectedDate ? (
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/calendar.png")}
                          style={styles.modalImage}
                        />
                        <Text style={{ color: "black" }}>Any Day</Text>
                      </View>
                    ) : (
                      <Text>{selectedDate}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.anyDay}
                    onPress={() => setShowWatch(true)}
                  >
                    {!selectedTime ? (
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/clock.png")}
                          style={styles.modalImage}
                        />
                        <Text style={{ color: "black" }}>Any Time</Text>
                      </View>
                    ) : (
                      <Text>{selectedTime}</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <Modal
                  visible={showCalendar}
                  transparent={true}
                  animationType="fade"
                >
                  <View style={{ flex: 1 }}>
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
                      onPress={() => {
                        setShowCalendar(false);
                      }}
                      style={{ position: "absolute", right: 45, top: 45 }}
                    >
                      <Image
                        source={require("../../assets/multiply.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Modal
                  visible={showWatch}
                  transparent={true}
                  animationType="fade"
                >
                  <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.watchView}>
                      <TextInput
                        style={styles.watchText}
                        value={selectedTime}
                        onChangeText={(selectedTime) =>
                          setSelectedTime(selectedTime)
                        }
                      />
                      <TouchableOpacity
                        onPress={() => handleSetTime()}
                        style={{
                          backgroundColor: "gray",
                          height: 40,
                          width: 50,
                          marginLeft: 10,
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>Set</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowWatch(false);
                        }}
                        style={{ position: "absolute", right: 3, top: 3 }}
                      >
                        <Image
                          source={require("../../assets/multiply.png")}
                          style={{ height: 20, width: 20 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </Modal>

                {/* who is paying modal...... */}
                <View>
                  <Modal
                    visible={showPaying}
                    transparent={true}
                    animationType="slide"
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        position: 'relative'
                      }}
                    >
                      <View style={[styles.modalContainer, { width: 370 }]}>
                        <TouchableOpacity
                          onPress={() => setShowPaying(false)}
                          style={styles.closeView}
                        >
                          <Image
                            source={require("../../assets/close.png")}
                            style={styles.closeButton}
                          />
                        </TouchableOpacity>
                        <View style={{ marginTop: 40 }}>
                          <Text
                            style={{ alignSelf: "center", fontWeight: "bold" }}
                          >
                            I want to go to
                          </Text>
                          <Text style={styles.placeTextView}>
                            {item && item.place_name.length > 30
                              ? item.place_name.slice(0, 30)
                              : item.place_name}
                          </Text>
                          <Text
                            style={[
                              styles.placeTextView,
                              { color: "gray", fontSize: 13, marginBottom: 20 },
                            ]}
                          >
                            {item && item.place_name.length > 30
                              ? item.place_name.slice(0, 30)
                              : item.place_name}
                          </Text>
                        </View>

                        <View>
                          <FlatList
                            data={payingBill}
                            keyExtractor={(item) => item.id}
                            renderItem={({
                              item,
                            }: {
                              item: payingBillItem;
                            }) => {
                              return (
                                <View
                                  style={{ width: 330, alignSelf: "center" }}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      height: 1,
                                      backgroundColor: "black",
                                    }}
                                  />
                                  <TouchableOpacity
                                    onPress={() => [
                                      setSelectFree(item.message),
                                      setShowPaying(false),
                                    ]}
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      marginTop: 8,
                                      marginBottom: 8,
                                    }}
                                  >
                                    <View style={{ flexDirection: "row" }}>
                                      <Image
                                        source={item.image}
                                        style={styles.giftBox}
                                      />
                                      <Text>{item.message}</Text>
                                    </View>
                                    <Image
                                      source={require("../../assets/right-arrow.png")}
                                      style={{ height: 15, width: 15 }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>

                {/* public visible to modal...... */}
                <View>
                  <Modal
                    visible={showVisibleTo}
                    transparent={true}
                    animationType="slide"
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                        position: 'relative'
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          height: "auto",
                          width: 360,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "black",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setShowVisibleTo(false)}
                          style={styles.closeView}
                        >
                          <Image
                            source={require("../../assets/close.png")}
                            style={styles.closeButton}
                          />
                        </TouchableOpacity>

                        <View
                          style={{ alignItems: "center", marginBottom: 15 }}
                        >
                          <Text style={{ marginTop: 40, fontWeight: "bold" }}>
                            I want to meet you
                          </Text>
                          <Text style={styles.placeTextView}>
                            {item && item.place_name.length > 30
                              ? item.place_name.slice(0, 30)
                              : item.place_name}
                          </Text>
                          <Text
                            style={[
                              styles.placeTextView,
                              { color: "gray", fontSize: 13 },
                            ]}
                          >
                            {item && item.place_name.length > 30
                              ? item.place_name.slice(0, 30)
                              : item.place_name}
                          </Text>
                        </View>

                        <View>
                          <FlatList
                            data={visibleData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                              return (
                                <View
                                  style={{ width: 330, alignSelf: "center" }}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      height: 1,
                                      backgroundColor: "black",
                                    }}
                                  />
                                  <TouchableOpacity
                                    onPress={() => [
                                      setSelectPublic(item.message),
                                      setShowVisibleTo(false),
                                    ]}
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      marginTop: 8,
                                      marginBottom: 8,
                                    }}
                                  >
                                    <Text>{item.message}</Text>
                                    <Image
                                      source={require("../../assets/right-arrow.png")}
                                      style={{ height: 15, width: 15 }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>

                <TextInput
                  style={[styles.descriptionTextInput, { height: inputHeight }]}
                  placeholder="Description"
                  placeholderTextColor="gray"
                  multiline
                  value={description}
                  onChangeText={(description) => setDescription(description)}
                />

                {!choseFile  ? (
                  <TouchableOpacity
                    onPress={() => handlePhoto()}
                    style={styles.addPhoto}
                  >
                    <Image
                      source={require("../../assets/image.png")}
                      style={styles.modalImage}
                    />
                    <Text>Add Photo</Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      height: 150,
                      marginHorizontal: 15,
                      marginTop: 5,
                    }}
                  >
                    <Image
                      source={{ uri: choseFile }}
                      style={{ height: 135, width: "auto" }}
                    />
                    <TouchableOpacity
                      onPress={() => setChoseFile(null)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 5,
                      }}
                    >
                      <Image
                        source={require("../../assets/image.png")}
                        style={styles.modalImage}
                      />
                      <Text>Clear Image</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{ marginTop: 15 }}>
                  <View style={styles.drawLine} />

                  <View style={styles.payingView}>
                    <Text style={{ marginLeft: 15 }}>who's Paying:</Text>
                    <TouchableOpacity
                      onPress={() => setShowPaying(!showPaying)}
                      style={styles.freeButton}
                    >
                      <Text>{selectFree}</Text>
                      <Image
                        source={require("../../assets/right-arrow.png")}
                        style={styles.alignImage}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawLine} />

                  <View style={styles.payingView}>
                    <Text style={{ marginLeft: 15 }}>Visible to:</Text>
                    <TouchableOpacity
                      onPress={() => setShowVisibleTo(!showVisibleTo)}
                      style={styles.freeButton}
                    >
                      <Text>{selectPublic}</Text>
                      <Image
                        source={require("../../assets/right-arrow.png")}
                        style={styles.alignImage}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawLine} />
                </View>

                <TouchableOpacity
                  style={[
                    styles.addPhoto,
                    { backgroundColor: "black", marginBottom: 15 },
                  ]}
                  onPress={() => addNewTwibs()}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Add Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  meetText: {
    alignSelf: "center",
    color: "black",
    fontWeight: 400,
    marginTop: 30,
  },
  anyDay: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    height: 40,
    width: 170,
    marginLeft: 2,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhoto: {
    flexDirection: "row",
    borderWidth: 2,
    height: 40,
    marginTop: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  drawLine: {
    height: 1,
    backgroundColor: "gray",
    marginHorizontal: 15,
    margin: 7,
  },
  modalImage: {
    height: 18,
    width: 18,
    marginRight: 5,
  },
  alignImage: {
    height: 10,
    width: 10,
    alignSelf: "center",
  },
  payingView: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 40,
    alignItems: "center",
  },
  freeButton: {
    flexDirection: "row",
    position: "absolute",
    right: 20,
    backgroundColor: "silver",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "auto",
    // width: 400,
    alignSelf: "center",
    borderRadius: 10,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  closeButton: {
    height: 15,
    width: 15,
  },
  placeTextView: {
    alignSelf: "center",
    marginTop: 5,
    color: "black",
    fontSize: 22,
  },
  anyDayView: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  descriptionTextInput: {
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "silver",
    marginTop: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    paddingLeft: 15,
    textAlign: "left",
  },
  calendarModal: {
    borderRadius: 5,
    margin: 50,
    elevation: 5,
    borderWidth: 4,
    borderColor: "gray",
  },
  watchView: {
    height: 100,
    width: 300,
    backgroundColor: "black",
    marginTop: 180,
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  watchText: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "white",
    paddingLeft: 20,
  },
  giftBox: {
    height: 20,
    width: 20,
    marginRight: 8,
    marginLeft: 5,
  },
  closeView: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30,
    position: "absolute",
    right: 5,
    top: 5,
  },
});
export default TwibModal;

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
