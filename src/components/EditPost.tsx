import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import firestore from "@react-native-firebase/firestore";

const EditPost = ({ route, navigation }: any) => {
  const { item } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [getPostId, setGetPostId] = useState<string>("");

  // fetch post id....
  useEffect(() => {
    const fetchPostId = async () => {
      try {
        setLoading(true);
        if (item.id) {
          const snapShort = await firestore()
            .collection("activePost")
            .where("postId", "==", item.id)
            .get();
          const activeIds = snapShort.docs.map((doc) => doc.data());
          if (activeIds[0].postId) {
            setGetPostId(activeIds[0].postId);
          } else {
            setGetPostId("");
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false)
        console.log("postId is not found:", error);
        return error;
      }
    };
    fetchPostId();
  }, [item]);

  // Function to get the payment type icon
  const getPaymentTypeIcon = (paymentType: string) => {
    let imageSource = "";
    switch (paymentType) {
      case "Free":
        imageSource = require("../../assets/prize.png");
        break;
      case "Splitsies":
        imageSource = require("../../assets/cherries.png");
        break;
      case "Treat Me":
        imageSource = require("../../assets/magic-dust.png");
        break;
      case "My Treat":
        imageSource = require("../../assets/giftbox.png");
        break;
      case "Pay what you can":
        imageSource = require("../../assets/money.png");
        break;
      default:
        break;
    }
    return <Image source={imageSource} style={styles.timeImg} />;
  };

  // Function to render the visibility icon
  const renderVisibilityIcon = (visibilityType: string) => {
    let imageSource = "";
    switch (visibilityType) {
      case "Public":
        imageSource = require("../../assets/globe.png");
        break;
      case "Friends & Their Friends":
        imageSource = require("../../assets/multiple-users-silhouette.png");
        break;
      case "Friends":
        imageSource = require("../../assets/friends.png");
        break;
      case "Select Friends":
        imageSource = require("../../assets/selection.png");
        break;
      default:
        break;
    }
    return <Image source={imageSource} style={styles.timeImg} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 10 }}>
            <View style={styles.noteText}>
              <Text style={[styles.timeText, { color: "black" }]}>
                {item.name.Note}
              </Text>
            </View>

            <View>
              {item.name.Image !== null? (
                <View style={styles.container}>
                  <Image
                    source={{ uri: item.name.Image }}
                    style={styles.image}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.container,
                    { height: 185, width: '100%', borderWidth: 2 },
                  ]}
                >
                  <Image
                    source={require("../../assets/cafe.png")}
                    style={{ height: 150, width: 150 }}
                  />
                </View>
              )}
            </View>

            <View style={{ marginTop: 5 }}>
              <View style={[styles.timeView, { backgroundColor: "orange" }]}>
                <View style={styles.timeSub}>
                  {renderVisibilityIcon(item.name.VisibleTo)}
                  <Text style={styles.timeText}>{item.name.VisibleTo}</Text>
                </View>

                <View style={styles.timeSub}>
                  {getPaymentTypeIcon(item.name.PaymentType)}
                  <Text style={styles.timeText}>{item.name.PaymentType}</Text>
                </View>
              </View>

              <View style={[styles.timeView, { marginTop: 5 }]}>
                <View style={styles.timeSub}>
                  <Image
                    source={require("../../assets/december-2.png")}
                    style={styles.timeImg}
                  />
                  <Text style={styles.timeText}>{item.name.Date}</Text>
                </View>

                <View style={styles.timeSub}>
                  <Image
                    source={require("../../assets/stop-watch.png")}
                    style={styles.timeImg}
                  />
                  <Text style={styles.timeText}>{item.name.Time}</Text>
                </View>
              </View>

              <View style={styles.map}>
                <MapView data={""} />
              </View>

              <View style={styles.place}>
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  {item.name.Location.place_name}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <View>
        {getPostId !== "" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Active", { item })}
            style={styles.chatBtn}
          >
            <Text style={styles.btnText}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Edit Post", { item })}
          style={styles.btnView}
        >
          <Text style={styles.btnText}>Edit Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Select Friend", { item })}
          style={[styles.btnView, { backgroundColor: "black" }]}
        >
          <Text style={styles.btnText}>Invite user</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  image: {
    height: 185,
    width: 365,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "gray",
  },
  map: {
    height: 300,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    marginTop: 5,
  },
  place: {
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 5,
    borderRadius: 5,
  },
  timeView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    padding: 5,
    borderRadius: 5,
  },
  timeSub: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontWeight: "900",
    marginLeft: 5,
  },
  timeImg: {
    height: 20,
    width: 20,
  },
  btnContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  btnView: {
    backgroundColor: "green",
    height: 35,
    width: 170,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  noteText: {
    marginTop: 5,
    marginBottom: 5,
    width: "auto",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  chatBtn: {
    height: 35,
    backgroundColor: "black",
    marginHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
});
