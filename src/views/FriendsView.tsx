import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import MapView from "../components/MapView";
import Share from "react-native-share";

const FriendsView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSegment, setSelectedSegment] = useState<string>("Friends");
  const [friendList, setFriendList] = useState<User[]>([]); // friend list
  const [friendRequests, setFriendRequests] = useState<User[]>([]); // friend request
  const [filteredData, setFilteredData] = useState<[]>([]); // filter friend list
  const [search, setSearch] = useState<string>(""); // search bar
  const [searchList, setSearchList] = useState<User[]>([]);
  const currentUser = auth().currentUser?.uid; // current user id

  // handle share.......
  const handleShare = () => {
    Share.open({
      title: "Share via",
      message: "Check out this link!",
      url: "https://example.com",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  // segment control......
  const handleSegmentPress = (segment: any) => {
    setSelectedSegment(segment);
  };

  // Retrieving friend list for a user......
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        setLoading(true);
        const currentUser = auth().currentUser;
        if (currentUser) {
          const snapshot = await firestore()
            .collection("friends")
            .where("receiverId", "==", currentUser.uid)
            .get();
          const updatedFriendList: any = [];
          for (const doc of snapshot.docs) {
            const senderId = doc.data().senderId;
            if (!updatedFriendList.includes(senderId)) {
              updatedFriendList.push(senderId);
              const senderSnapshot = await firestore()
                .collection("user")
                .doc(senderId)
                .get();
              const senderDetails = senderSnapshot.data();
              updatedFriendList.push(senderDetails);
            }
          }
          setFriendList(updatedFriendList);
          // console.log('friendList:', updatedFriendList)
          setLoading(false);
        } else {
          console.log("No current user.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching friend list:", error);
        setLoading(false);
      }
    };
    fetchFriendList();
  }, [friendList, friendRequests]);

  // Retrieving friend requests for the current user......
  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        setLoading(true);
        const snapshot = await firestore()
          .collection("friendRequests")
          .where("receiverUid", "==", currentUser)
          .where("status", "==", "pending")
          .get();

        if (snapshot && !snapshot.empty) {
          const friendRequests: any = [];

          for (const doc of snapshot.docs) {
            const data = doc.data();
            // console.log('Document data:', data);
            const senderUid =
              typeof data.senderUid === "function"
                ? data.senderUid()
                : data.senderUid;

            if (!friendRequests.includes(senderUid)) {
              friendRequests.push(senderUid);

              const senderSnapshot = await firestore()
                .collection("user")
                .doc(senderUid)
                .get();

              if (senderSnapshot.exists) {
                const senderDetails = senderSnapshot.data();
                friendRequests.push(senderDetails);
              } else {
                console.log(`Sender document not found for UID: ${senderUid}`);
                setLoading(false);
              }
            }
          }
          setFriendRequests(friendRequests);
          // console.log('friendRequest:',friendRequests)
          setLoading(false);
        } else {
          console.log("No friend requests found for the user.");
          setFriendRequests([]);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching friend requests:", error);
        throw error;
        
      }
    };
    getFriendRequests();
  }, []);

  // Retrieving search friend for the current user......
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = await auth().currentUser;
        // Step 1: Get the list of friend UIDs
        const friendsSnapshot = await firestore()
          .collection("friends")
          .where("receiverId", "==", currentUser?.uid)
          .get();
        const friendUids = friendsSnapshot.docs.map(
          (doc) => doc.data().senderId
        );

        // Step 2: Get the list of friend request UIDs
        const friendRequestsSnapshot = await firestore()
          .collection("friendRequests")
          .where("receiverUid", "==", currentUser?.uid)
          .where("status", "==", "accepted")
          .get();
        const friendRequestUids = friendRequestsSnapshot.docs.map(
          (doc) => doc.data().senderUid
        );

        // Step 3: Fetch user data
        const usersSnapshot = await firestore().collection("user").get();
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Step 4: Filter users locally
        const filteredUsers = users.filter(
          (user) =>
            user.id !== currentUser?.uid &&
            !friendUids.includes(user.id) &&
            !friendRequestUids.includes(user.id)
        );
        setFilteredData(filteredUsers);
        // console.log('searchList:',filteredUsers)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // filter User and userName.....
  useEffect(() => {
    if (filteredData && Array.isArray(filteredData)) {
      // setLoading(true);
      const filtered = filteredData.filter((item: any) => {
        const nameMatches =
          item.Name?.toLowerCase().includes(search.toLowerCase()) || "";
        const usernameMatches =
          item.UserName?.toLowerCase().includes(search.toLowerCase()) || "";
        return nameMatches || usernameMatches;
      });
      setSearchList(filtered);
      // setLoading(false);
    } else {
      console.error("filteredData is not an array or is undefined");
      setLoading(false);
    }
  }, [search, filteredData]);

  // render friend list.....
  const renderFriendList = ({ item }: { item: any }) => {
    return (
      <View style={{ flex: 1 }}>
        {!loading ? (
          <View style={styles.friendList}>
            <ActivityIndicator size={"small"} color={"orange"} />
          </View>
        ) : (
          <View key={item.id} style={{flex: 1}}>
            {item.Name && (
              <View style={styles.friendList}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.Image !== null ? (
                    <View style={styles.ImageView}>
                      <Image
                        source={{ uri: item.Image }}
                        style={{ height: 46, width: 46, borderRadius: 23 }}
                      />
                    </View>
                  ) : (
                    <View style={styles.ImageView}>
                      <Image
                        source={require("../../assets/boy-avatar.png")}
                        style={{ height: 55, width: 55, borderRadius: 27.5 }}
                      />
                    </View>
                  )}
                  <View style={{ alignSelf: "center", paddingLeft: 10 }}>
                    <Text style={{ color: "black", fontWeight: "bold" }}>
                      {item.Name}
                    </Text>
                    <Text style={{ color: "gray", fontWeight: "bold" }}>
                      @{item.UserName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Friends Profile", item)}
                    style={styles.friendTouchButton}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      View Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // render added you list.....
  const renderAddedYou = ({ item }: { item: any }) => {
    // Accepting a friend request
    const acceptRequest = async () => {
      try {
        setLoading(true)
        const querySnapshot = await firestore()
          .collection("friendRequests")
          .where("receiverUid", "==", currentUser)
          .where("status", "==", "pending")
          .get();
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const requestId = doc.id;
            const requestData = doc.data();
            console.log("requestData:", requestData);
            await firestore()
              .collection("friendRequests")
              .doc(requestId)
              .update({
                status: "accepted",
              });
            console.log(
              `Friend request with ID ${requestId} updated successfully.`
            );
            await firestore().collection("friends").add({
              receiverId: requestData.receiverUid,
              senderId: requestData.senderUid,
              status: "accepted",
            });
          });
          setLoading(false)
        } else {
          console.log("No matching friend request found.");
          setLoading(false)
        }
      } catch (error) {
        console.error("Error updating friend request:", error);
        setLoading(false)
      }
    };

    // Declining a friend request
    const declineRequest = async () => {
      try {
        setLoading(true)
        const querySnapshot = await firestore()
          .collection("friendRequests")
          .where("receiverUid", "==", currentUser)
          .where("status", "==", "pending")
          .get();
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const requestId = doc.id;
            await firestore()
              .collection("friendRequests")
              .doc(requestId)
              .update({
                status: "declined",
              });
            console.log( `Friend request with ID ${requestId} updated successfully.`);
            setLoading(false)
          });
        } else {
          console.log("No matching friend request found.");
          setLoading(false)
        }
      } catch (error) {
        console.error("Error updating friend request:", error);
        setLoading(false)
      }
    };

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {!loading ? (
          <View style={styles.friendList}>
            <ActivityIndicator size={"small"} color={"orange"} />
          </View>
        ) : (
          <View key={item.id} style={{flex: 1}}>
            {item.Name && (
              <View  style={styles.friendList}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.Image !== null ? (
                    <View style={styles.ImageView}>
                      <Image
                        source={{ uri: item.Image }}
                        style={{ height: 45, width: 45, borderRadius: 22.5 }}
                      />
                    </View>
                  ) : (
                    <View style={styles.ImageView}>
                      <Image
                        source={require("../../assets/boy-avatar.png")}
                        style={{ height: 55, width: 55, borderRadius: 27.5 }}
                      />
                    </View>
                  )}
                  <View style={{ alignSelf: "center", paddingLeft: 10 }}>
                    <Text style={{ color: "black", fontWeight: "bold" }}>
                      {item.Name}
                    </Text>
                    <Text style={{ fontWeight: "bold", color: "gray" }}>
                      @{item.UserName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => declineRequest()}
                    style={[
                      styles.friendTouchButton,
                      { backgroundColor: "red", right: 100, width: 80 },
                    ]}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Decline
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => acceptRequest()}
                    style={[
                      styles.friendTouchButton,
                      { backgroundColor: "green", width: 80 },
                    ]}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // render search list......
  const renderSearchList = ({ item }: { item: any }) => {
    // console.log('============================',item.Image)
    // send friend request fro add friend
    const sendFriendRequest = async (senderUid: any, receiverUid: any) => {
      try {
        setLoading(true)
        const existingRequestSnapshot = await firestore()
          .collection("friendRequests")
          .where("senderUid", "==", senderUid)
          .where("receiverUid", "==", receiverUid)
          .get();

        if (existingRequestSnapshot.size > 0) {
          console.log("Friend request already exists.");
          return;
        }
        await firestore().collection("friendRequests").add({
          senderUid,
          receiverUid,
          status: "pending",
        });
        console.log("Friend request sent successfully.");
        setLoading(false)
      } catch (error) {
        console.log("Error sending friend request:", error);
        setLoading(false)
      }
    };

    return (
      <View style={{ flex: 1 }}>
        {!loading ? (
          <View style={styles.friendList}>
            <ActivityIndicator size={"small"} color={"orange"} />
          </View>
        ) : (
          <View key={item.id} style={{ flex: 1 }}>
            {item.Status !== true && item.SelectUser !== true && (
              <View  style={styles.addFriendView}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.Image !== null ?(
                    <View style={styles.ImageView}>
                      <Image
                        source={{ uri: item.Image }}
                        style={{ height: 45, width: 45, borderRadius: 22.5 }}
                      />
                    </View>
                  ) : (
                    <View style={styles.ImageView}>
                      <Image
                        source={require("../../assets/boy-avatar.png")}
                        style={{ height: 55, width: 55, borderRadius: 27.5 }}
                      />
                    </View>
                  )} 
                  <View style={{ justifyContent: "center", marginLeft: 10 }}>
                    <Text style={{ color: "black", fontWeight: "bold" }}>
                      {item.Name}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontWeight: "bold",
                      }}
                    >
                      @{item.UserName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => sendFriendRequest(currentUser, item.id)}
                    style={styles.addButton}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Add friend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loading ? (
        <View style={styles.mapContainer}>
          <ActivityIndicator
            size="large"
            color="orange"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MapView data={""} />
          <View style={styles.shareView}>
            <TouchableOpacity
              style={styles.inviteView}
              onPress={() => handleShare()}
            >
              <Image
                source={require("../../assets/share.png")}
                style={styles.shareImage}
              />
              <Text style={styles.inviteText}>Invite Friends</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.segmentView}>
            <View style={styles.segmentControl}>
              <TouchableOpacity
                onPress={() => handleSegmentPress("Friends")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "Friends" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "Friends" && styles.selectedSegmentText,
                  ]}
                >
                  Friends
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSegmentPress("AddedYou")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "AddedYou" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "AddedYou" &&
                      styles.selectedSegmentText,
                  ]}
                >
                  Added You
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSegmentPress("Search")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "Search" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "Search" && styles.selectedSegmentText,
                  ]}
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedSegment === "Friends" && (
            <View style={styles.segmentDiv}>
              {friendList.length === 0 ? (
                <View style={[styles.dataView]}>
                  <Text style={styles.emptyMsg}>Empty friend list</Text>
                </View>
              ) : (
                <FlatList
                  data={friendList}
                  keyExtractor={(item, index) => {return item.id}}
                  renderItem={renderFriendList}
                />
              )}
            </View>
          )}

          {selectedSegment === "AddedYou" && (
            <View style={styles.segmentDiv}>
              {friendRequests.length === 0 ? (
                <View style={[styles.dataView]}>
                  <Text style={styles.emptyMsg}>No friend request</Text>
                </View>
              ) : (
                <FlatList
                  data={friendRequests}
                  keyExtractor={(item, index) => {return item.id}}
                  renderItem={renderAddedYou}
                />
              )}
            </View>
          )}

          {selectedSegment === "Search" && (
            <View style={styles.segmentDiv}>
              {filteredData.length === 0 ? (
                <View style={[styles.dataView]}>
                  <Text style={styles.emptyMsg}>No such friend list</Text>
                </View>
              ) : (
                <View style={[styles.dataView, { height: "auto" }]}>
                  <Text style={{ margin: 10 }}>Find Friend:</Text>
                  <TextInput
                    placeholder="Search by Name or userName"
                    value={search}
                    onChangeText={(search) => setSearch(search)}
                    style={styles.textSearch}
                  />

                  {searchList ? (
                    <View>
                      <Text style={{ margin: 5 }}>People you might know:</Text>
                      <FlatList
                        style={{ marginBottom: 15 }}
                        data={searchList}
                        renderItem={renderSearchList}
                        keyExtractor={(item, index) => {return item.id}}
                      />
                    </View>
                  ) : (
                    <Text style={{ margin: 10, alignSelf: "center" }}>
                      No data user list found
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 1,
    position: "relative",

  },
  activityIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  inviteView: {
    backgroundColor: "white",
    height: 25,
    width: 90,
    flexDirection: "row",
    marginTop: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    left: 10,
  },
  shareImage: {
    height: 10,
    width: 10,
  },
  inviteText: {
    color: "black",
    paddingLeft: 5,
    fontSize: 10,
  },
  segmentView: {
    flex: 1,
    position: "absolute",
    marginTop: 30,
    paddingTop: 10,
    paddingBottom: 8,
    width: "100%",
    backgroundColor: "black",
  },
  segmentControl: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 3,
    borderRadius: 20,
  },
  segmentButton: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedSegment: {
    backgroundColor: "black",
    margin: 2.5,
  },
  text: {
    color: "black",
    marginTop: 3,
    fontWeight: "bold",
  },
  selectedSegmentText: {
    color: "white",
    marginTop: 0,
    fontWeight: "bold",
  },
  segmentDiv: {
    position: "absolute",
    width: "98%",
    marginTop: 85,
    alignSelf: "center",
  },
  dataView: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  friendList: {
    width: "98%",
    height: 60,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
  },
  friendTouchButton: {
    backgroundColor: "black",
    height: 35,
    width: 120,
    borderWidth: 2,
    borderColor: "silver",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 6,
    right: 10,
  },
  ImageView: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "sky-blue",
  },
  emptyMsg: {
    color: "gray",
    alignSelf: "center",
    fontWeight: "bold",
  },
  textSearch: {
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingLeft: 20,
    marginBottom: 10,
  },
  shareView: {
    position: "absolute",
    backgroundColor: "black",
    width: "100%",
  },
  addButton: {
    backgroundColor: "black",
    height: 35,
    width: 100,
    borderWidth: 2,
    borderColor: "silver",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  addFriendView: {
    height: 60,
    borderRadius: 5,
    marginTop: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    paddingLeft: 10,
  },
});

export default FriendsView;

interface User {
  id: string;
  Name: string;
  UserName: string;
  DOB: string;
  Gender: string;
  Image: null;
  invitations: [];
}
