import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import FabView from "../components/FabView";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
// "pk.eyJ1Ijoic3FtLXByYWRlZXAiLCJhIjoiY2xteXJpZW0wMDZzNjJrbGtzNzZtMHVyMSJ9.VFEzZoBqNAEqwwHZeiBzBA";

type Coordinates = [number, number];
type LocationResult = {
  place_name: string;
  geometry: { center: Coordinates };
};

const RootView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchActive, setSearchActive] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [passData, setPassData] = useState<any>([]);
  const dataToPass: any = passData; // pass data from child component(MapView)

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  // handle search button......
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${mapboxToken}`
      );
      if (response.data.features.length > 0) {
        const results = response.data.features.map((feature: any) => ({
          place_name: feature.place_name,
          geometry: feature.geometry,
        }));
        setLocationResults(results);
        setLoading(false);
      } else {
        setLocationResults([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while geocoding:", error);
      setLoading(false);
    }
  };

  // clear search text......
  const clearSearch = () => {
    setSearchText("");
    setSearchActive(false);
    setSearchOpen(false);
    setLoading(false);
  };

  // render map list.......
  const renderMap = ({ item }: any) => {
    setPassData(item.geometry.coordinates);
    return (
      <View style={styles.list}>
        <TouchableOpacity
          onPress={() => [
            navigation.navigate("twinModal", { item }),
            clearSearch(),
          ]}
          style={{ height: "auto", justifyContent: "center" }}
        >
          <Text style={styles.placeText}>
            {item.place_name}
            {"\t\t\t\n"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // useEffect(() => {
  //   // Register background handler
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log("Message handled in the background!", remoteMessage);
  //   });

  //   // Register foreground handler
  //   messaging().onMessage(async (remoteMessage) => {
  //     console.log("Message handled in the foreground!", remoteMessage);
  //   });

  //   // Check if the app was opened by a notification
  //   messaging()
  //     .getInitialNotification()
  //     .then((remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open in the foreground:",
  //           remoteMessage
  //         );
  //       }
  //     });
  // }, []);
  
  // received push Notification....
  const handleNotification = () => {
    navigation.navigate('Notification')
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={"orange"}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <MapView data={dataToPass} />
        </View>
      )}
      {isSearchOpen && (
        <View style={styles.searchView}>
          <TextInput
            style={styles.input}
            placeholder="Search for a location"
            placeholderTextColor="silver"
            keyboardType="default"
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            onSubmitEditing={handleSearch}
          />
          {isSearchActive && (
            <TouchableOpacity style={styles.CancelButton} onPress={clearSearch}>
              <Image
                source={require("../../assets/multiply.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {isSearchOpen && (
        <View style={styles.listView}>
          <FlatList
            data={locationResults}
            keyExtractor={(item) => item.place_name}
            scrollEnabled={true}
            renderItem={renderMap}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.twibButton}
        onPress={() => setSearchOpen(true)}
      >
        <Image
          source={require("../../assets/location.png")}
          style={styles.locationIcon}
        />
        <Text style={styles.twibText}>Create</Text>
      </TouchableOpacity>

      <FabView />

      <TouchableOpacity
        onPress={() => handleNotification()}
        style={{
          position: "absolute",
          left: 10,
          top: 90,
        }}
      >
        <Image
          source={require("../../assets/alarm-bell.png")}
          style={{
            height: 60,
            width: 60,
            borderWidth: 4,
            borderRadius: 30,
            borderColor: "white",
          }}
        />
        {!loading && (
          <View
            style={{
              height: 16,
              width: 16,
              borderRadius: 8,
              backgroundColor: "red",
              position: "absolute",
              left: 5,
            }}
          />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 20,
    height: 50,
    width: "97%",
    marginTop: 250,
    backgroundColor: "white",
    paddingLeft: 20,
  },
  CancelButton: {
    position: "absolute",
    left: 175,
  },
  image: {
    height: 30,
    width: 30,
    position: "absolute",
    marginTop: 110,
    left: 158,
  },
  twibButton: {
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 30,
    width: 130,
    height: 45,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    right: 25,
  },
  twibText: {
    color: "gray",
    fontSize: 18,
    fontWeight: "bold",
  },
  locationIcon: {
    height: 28,
    width: 28,
    borderRadius: 12.5,
    tintColor: "gray",
    marginRight: 4,
  },
  list: {
    backgroundColor: "silver",
    height: "auto",
    width: 350,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  listView: {
    position: "absolute",
    top: 285,
    alignSelf: "center",
  },
  placeText: {
    fontSize: 15,
    fontWeight: "400",
    paddingLeft: 10,
  },
});

export default RootView;
