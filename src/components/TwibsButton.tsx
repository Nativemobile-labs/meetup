import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface MapresponseItem {
  id: string;
  place_name: string;
}

const TwibsButton: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchActive, setSearchActive] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<MapresponseItem[]>([]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const handleSearch = async () => {
    try {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=pk.eyJ1IjoidHdpbmMiLCJhIjoiY2trMGFzNXU3MDQ0ZzJvbnBncTYwMmQ3dyJ9.-Rlp0RxbyvTjoH2Ax0xYFw`
        )
        .then((response) => {
          const data: MapresponseItem[] = response.data.features.map(
            (feature: any) => ({
              id: feature.id,
              place_name: feature.place_name,
            })
          );
          setLocationData(data);
        })
        .catch((er) => {
          console.log("er=========>", er);
        });
    } catch (error) {
      console.log("searching error", error);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchActive(false);
    setSearchOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      <View>
        <FlatList
          data={locationData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text style={{color: 'black', fontWeight: '400'}}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.twibButton}
        onPress={() => setSearchOpen(true)}
      >
        <Image
          source={require("../../assets/location.png")}
          style={styles.locationIcon}
        />
        <Text style={styles.twibText}>Twibs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    height: 40,
    width: "90%",
    marginTop: 150,
    backgroundColor: "white",
    paddingLeft: 20,
  },
  CancelButton: {
    position: "absolute",
  },
  image: {
    height: 30,
    width: 30,
    position: "absolute",
    marginTop: 60,
    left: 318,
  },
  twibButton: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    width: 100,
    height: 40,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  twibText: {
    color: "red",
    fontSize: 18,
  },
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: "gray",
  },
});

export default TwibsButton;
