import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapboxGL, { Logger, Camera, PointAnnotation } from "@rnmapbox/maps";
import logger from "../lib/utils/logger";
import * as Location from "expo-location";
import firestore from "@react-native-firebase/firestore";

const mapboxToken: any = process.env.REACT_APP_MAPBOX_TOKEN;

if (!mapboxToken) {
  console.error("Mapbox access token is not available.");
} else {
  MapboxGL.setAccessToken(mapboxToken);
}

// MapboxGL.setTelemetryEnabled(true);

Logger.setLogCallback((log: any) => {
  const { message } = log;
  if (
    message.match("Request failed due to a permanent error: Canceled") ||
    "Request failed due to a permanent error: Socket Closed"
  ) {
    return true;
  }
  return false;
});

const MapView: React.FC<MapViewProps> = ({ data }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationData | null>(null);
  const [treatList, setTreatList] = useState<TreatDetails[]>([]);
 

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, [loading]);

  // fetch Post data from firestore.......
  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection("Treat")
      .onSnapshot((querySnapshot) => {
        const updatedTreatList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data() as any,
        }));
        setTreatList(updatedTreatList);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // request Location Permission......
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
        } catch (err) {
          console.error("Error getting location:", err);
        }
      }
    };
    requestLocationPermission();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <ActivityIndicator size={"large"} color={"orange"} />
          </View>
        ) : (
          <View style={styles.page}>
            <StatusBar style="auto" />
            <View style={styles.container}>
              <MapboxGL.MapView
                style={{ flex: 1 }}
                zoomEnabled={true}
                surfaceView={true}
                logoEnabled={false}
                scrollEnabled={true}
                pitchEnabled={true}
                compassEnabled={true}
                attributionEnabled={false}
                rotateEnabled={true}
                styleURL={MapboxGL.StyleURL.Street}
              >
                <MapboxGL.Camera
                  zoomLevel={5}
                  centerCoordinate={[
                    userLocation?.longitude || 0,
                    userLocation?.latitude || 0,
                  ]}
                  pitch={45}
                  heading={90}
                  animationDuration={2000}
                  animationMode="flyTo"
                />

                {treatList.map((post) => (
                  <MapboxGL.PointAnnotation
                    key={post.id}
                    id={post.id}
                    coordinate={post.name.Location.geometry.coordinates as any}
                    title={post.name.Note}
                    snippet="Additional information about the marker"
                    selected={true}
                    draggable={true}
                    onSelected={(da) => alert(da.geometry.coordinates)}
                  >
                    <View style={{ flex: 1 }}>
                      {post.name.Image !== null ? (
                        <Image
                          source={{ uri: post?.name.Image }}
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            borderWidth: 3,
                            backgroundColor: "red",
                            borderColor: "gray",
                          }}
                        />
                      ) : null}
                    </View>
                  </MapboxGL.PointAnnotation>
                ))}
              </MapboxGL.MapView>
            </View>
          </View>
        )}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  imageView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {},
  modalContent: {},
  closeButton: {},
});

export default MapView;

interface MapViewProps {
  data: any; // Replace any with the actual type of your data
}

interface TreatDetails {
  id: string;
  name: {
    Date: string;
    Location: location;
    Image: null;
    Note: string;
    paymentType: string;
    Time: string;
    VisibleTo: string;
  };
}
interface location {
  geometry: Geometry;
  place_name: string;
}
interface Geometry {
  coordinates: Coordinates;
}
interface Coordinates {
  coordinates: [Latitude: number, Longitude: number];
}

interface Coordinates {
  latitude: number;
  longitude: number;
}
interface Position {
  x: number;
  y: number;
}
