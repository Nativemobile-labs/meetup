import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BiBorderRadius } from "react-icons/bi";

const ViewJoinPost: React.FC = ({ route }: any) => {
  const item = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  console.log("item============", item);

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
    return <Image source={imageSource} style={styles.publicImage} />;
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
    return <Image source={imageSource} style={styles.publicImage} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <ScrollView style={styles.mainContainer}>
          <Text style={styles.placeText}>
            {item.name.Location.place_name.length > 25
              ? item.name.Location.place_name.slice(0, 25)
              : item.name.Location.place_name}
          </Text>

          {item.name.Image ? (
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <Image
                source={{ uri: item.name.Image }}
                style={{
                  height: 160,
                  width: "97%",
                  borderWidth: 2,
                  borderColor: "gray",
                  borderRadius: 5,
                }}
              />
            </View>
          ) : (
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/cafe.png")}
                style={styles.image}
              />
            </View>
          )}

          <View style={styles.mainDateView}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../assets/december-2.png")}
                style={styles.icon}
              />
              <Text style={styles.dateText}>{item.name.Date}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../assets/stop-watch.png")}
                style={styles.icon}
              />
              <Text style={styles.dateText}>{item.name.Time}</Text>
            </View>
          </View>

          <View style={{ alignSelf: "center" }}>
            <View style={styles.public}>
              {renderVisibilityIcon(item.name.VisibleTo)}
              <Text
                style={{ color: "black", fontWeight: "bold", marginTop: 5 }}
              >
                {item.name.VisibleTo}
              </Text>
            </View>
            <View style={styles.public}>
              {getPaymentTypeIcon(item.name.PaymentType)}
              <Text
                style={{ color: "black", fontWeight: "bold", marginTop: 5 }}
              >
                {item.name.PaymentType}
              </Text>
            </View>
          </View>

          <Image
            source={require("../../assets/post-it.png")}
            style={[
              styles.publicImage,
              { alignSelf: "center", marginBottom: 5 },
            ]}
          />
          <View style={styles.address}>
            <Text style={{ color: "black", fontWeight: "600", padding: 5 }}>
              {item.name.Note}
            </Text>
          </View>

          <Image
            source={require("../../assets/home.png")}
            style={[
              styles.publicImage,
              { alignSelf: "center", marginBottom: 5 },
            ]}
          />
          <View style={styles.address}>
            <Text style={{ color: "black", fontWeight: "600", padding: 5 }}>
              {item.name.Location.place_name}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ViewJoinPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    margin: 10,
  },
  placeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 10,
  },
  imageView: {
    height: 150,
    width: "98%",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "gray",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  mainDateView: {
    backgroundColor: "black",
    flexDirection: "row",
    height: 35,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
  },
  address: {
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5,
  },

  public: {
    height: 100,
    width: 100,
    marginTop: 10,
    alignItems: "center",
  },
  publicImage: {
    height: 70,
    width: 70,
  },
});
