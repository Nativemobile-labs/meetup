import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import MapView from "../components/MapView";

const TwibsView: React.FC = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSegment, setSelectedSegment] = useState<string>("Active");
  const [activeList, setActiveList] = useState<UserDetails[]>([]);
  const [inviteUser, setInviteUser] = useState<[]>([]);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const currentUserId = auth().currentUser?.uid;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const currentDate = `${day}-${month}-${year}`;

  const handleSegmentPress = (segment: any) => {
    setSelectedSegment(segment);
  };

  // fetch active post from firebase.....
  useEffect(() => {
    const activePostData = async () => {
      setLoading(true);
      try {
        const currentUser = auth().currentUser?.uid;
        if (currentUser) {
          const snapshot = await firestore()
            .collection("activePost")
            .where("receiverUid", "==", currentUser)
            .get();

          const updatedPostList: any[] = [];

          for (const doc of snapshot.docs) {
            const activeId = doc.id;
            const post = doc.data();

            // Fetch additional data from the "Treat" collection based on the postId
            const treatSnapshot = await firestore()
              .collection("Treat")
              .doc(post.postId)
              .get();
            const treatData = treatSnapshot.data();

            // Fetch additional data from the "user" collection based on the postId
            const userSnapShot = await firestore()
              .collection("user")
              .doc(post.senderUid)
              .get();
            const userData = userSnapShot.data();

            // Add the combined data to the updatedPostList array
            updatedPostList.push({
              activeId,
              ...post,
              treatData,
              userData,
            });
          }
          setLoading(false);
          setActiveList(updatedPostList);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching post list:", error);
      }
    };
    activePostData();
  }, [currentUserId, inviteUser]);

  // fetch invitation post from firebase......
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const invitationSnapshot = await firestore()
          .collection("postInvites")
          .where("invitedUserIds", "array-contains", currentUserId)
          .get();

        if (!invitationSnapshot.empty) {
          const invitations = invitationSnapshot.docs.map(async (doc) => {
            const postId = doc.data().postId;
            const postDataDoc = await firestore()
              .collection("Treat")
              .doc(postId)
              .get();

            // Check if postDataDoc exists and has properties before accessing its data
            const postData =
              postDataDoc && postDataDoc.exists && postDataDoc?.data()
                ? postDataDoc?.data()
                : null;

            console.log("post Data=====================", postData);

            const senderId = doc.data().senderId;
            const senderDoc = await firestore()
              .collection("user")
              .doc(senderId)
              .get();

            // Check if senderDoc exists and has properties before accessing its data
            const senderData =
              senderDoc && senderDoc.exists && senderDoc.data()
                ? senderDoc.data()
                : null;

            // Check if 'invitedUserIds' property exists in doc.data()
            const invitedUserIds = doc.data().invitedUserIds || [];

            const recipientDataPromises = invitedUserIds.map(
              async (recipientId: any) => {
                const recipientDoc = await firestore()
                  .collection("user")
                  .doc(recipientId)
                  .get();

                // Check if recipientDoc exists and has properties before accessing its data
                return recipientDoc &&
                  recipientDoc.exists &&
                  recipientDoc.data()
                  ? recipientDoc.data()
                  : null;
              }
            );

            // Use Promise.all to wait for all recipientDataPromises to resolve
            const recipientData = await Promise.all(recipientDataPromises);
            return {
              id: doc.id,
              post: postData,
              sender: senderData,
              recipients: recipientData.filter(Boolean), // Filter out null values
              ...doc.data(),
            };
          });

          const resolvedInvitations: any = await Promise.all(invitations);
          setInviteUser(resolvedInvitations);
          setLoading(false);
        } else {
          console.log("No invitations found for the current user.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [currentUserId]);

  // render active list.....
  const renderActiveList = ({ item }: { item: any }) => {
    const showActivePlace = (itemID: any) => {
      setSelectedItemID((prevItemId) =>
        prevItemId === itemID?.activeId ? null : itemID?.activeId
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={[styles.activityView, { height: 60 }]}>
            <ActivityIndicator size="small" color="orange" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {item.treatData?.Date >= currentDate &&
              item.status === "accepted" && (
                <View style={styles.friendList}>
                  <View style={styles.touchNote}>
                    {item.userData.Image !== null ? (
                      <View style={styles.imageView}>
                        <Image
                          source={{ uri: item.userData.Image }}
                          style={{ height: 55, width: 55, borderRadius: 27.5 }}
                        />
                      </View>
                    ) : (
                      <View style={styles.imageView}>
                        <Image
                          source={require("../../assets/boy-avatar.png")}
                          style={{ height: 65, width: 65, borderRadius: 32.5 }}
                        />
                      </View>
                    )}
                    <View style={styles.noteView}>
                      <Text style={[styles.noteText, { color: "black" }]}>
                        {item.userData.Name}
                      </Text>
                      <Text style={styles.noteText}>No message Yet</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Active", { item })}
                      style={styles.friendTouchButton}
                    >
                      <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => showActivePlace(item)}
                    style={styles.placeText}
                  >
                    <Text style={styles.place}>
                      {item.treatData &&
                      item.treatData.Location.place_name.length > 30
                        ? item.treatData.Location.place_name.slice(0, 30)
                        : item.treatData.Location.place_name}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/december-2.png")}
                          style={styles.placeImg}
                        />
                        <Text style={styles.placeFont}>
                          {item.treatData.Date}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/stop-watch.png")}
                          style={styles.placeImg}
                        />
                        <Text style={styles.placeFont}>
                          {item.treatData.Time}
                        </Text>
                      </View>

                      <View style={styles.divView}>
                        {selectedItemID == item.activeId ? (
                          <Image
                            source={require("../../assets/down-arrow.png")}
                            style={styles.divImg}
                          />
                        ) : (
                          <Image
                            source={require("../../assets/up-arrow.png")}
                            style={styles.divImg}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {selectedItemID === item.activeId && (
                    <View style={styles.viewProfile}>
                      <Text style={styles.noteShow}>
                        {item.treatData && item.treatData?.Note.length > 0
                          ? item.treatData?.Note.slice(0, 30)
                          : item.treatData?.Note}
                      </Text>
                      {item.treatData?.Image !== null ? (
                        <Image
                          source={{ uri: item.treatData.Image }}
                          style={styles.requirImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/cafe.png")}
                          style={styles.requirImage}
                        />
                      )}
                    </View>
                  )}
                </View>
              )}
          </View>
        )}
      </View>
    );
  };

  // render past list.........
  const renderPastList = ({ item }: { item: any }) => {
    const showActivePlace = (itemID: any) => {
      setSelectedItemID((prevItemId) =>
        prevItemId === itemID.activeId ? null : itemID.activeId
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={[styles.activityView, { height: 60 }]}>
            <ActivityIndicator size="small" color="orange" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {item.treatData?.Date < currentDate &&
              item.status === "accepted" && (
                <View style={styles.friendList}>
                  <View style={styles.touchNote}>
                    {item.userData.Image !== null ? (
                      <View style={styles.imageView}>
                        <Image
                          source={{ uri: item.userData.Image }}
                          style={{ height: 55, width: 55, borderRadius: 27.5 }}
                        />
                      </View>
                    ) : (
                      <View style={styles.imageView}>
                        <Image
                          source={require("../../assets/boy-avatar.png")}
                          style={{ height: 65, width: 65, borderRadius: 32.5 }}
                        />
                      </View>
                    )}
                    <View style={styles.noteView}>
                      <Text style={[styles.noteText, { color: "black" }]}>
                        {item.userData.Name}
                      </Text>
                      <Text style={styles.noteText}>No message Yet</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Active", { item })}
                      style={styles.friendTouchButton}
                    >
                      <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => showActivePlace(item)}
                    style={styles.placeText}
                  >
                    <Text style={styles.place}>
                      {item.treatData &&
                      item.treatData.Location.place_name.length > 0
                        ? item.treatData.Location.place_name.slice(0, 30)
                        : item.treatData.Location.place_name}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/december-2.png")}
                          style={styles.placeImg}
                        />
                        <Text style={styles.placeFont}>
                          {item.treatData.Date}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../assets/stop-watch.png")}
                          style={styles.placeImg}
                        />
                        <Text style={styles.placeFont}>
                          {item.treatData.Time}
                        </Text>
                      </View>

                      <View style={styles.divView}>
                        {selectedItemID == item.activeId ? (
                          <Image
                            source={require("../../assets/down-arrow.png")}
                            style={styles.divImg}
                          />
                        ) : (
                          <Image
                            source={require("../../assets/up-arrow.png")}
                            style={styles.divImg}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {selectedItemID === item.activeId && (
                    <View style={styles.viewProfile}>
                      <Text style={styles.noteShow}>
                        {item.treatData && item.treatData.Note.length > 0
                          ? item.treatData.Note.slice(0, 30)
                          : item.treatData.Note}
                      </Text>
                      {item.treatData.Image !== null ? (
                        <Image
                          source={{ uri: item.treatData.Image }}
                          style={styles.requirImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/cafe.png")}
                          style={styles.requirImage}
                        />
                      )}
                    </View>
                  )}
                </View>
              )}
          </View>
        )}
      </View>
    );
  };

  // render invite list.....
  const renderInviteList = ({ item }: { item: any }) => {
    const showActivePlace = (itemID: any) => {
      setSelectedItemID((prevItemId) =>
        prevItemId === itemID.id ? null : itemID.id
      );
    };

    // accept post request
    const handleAccept = async (invitationId: any) => {
      try {
        setLoading(true);
        const postSnapshot = await firestore()
          .collection("postInvites")
          .doc(invitationId)
          .get();

        if (postSnapshot.exists) {
          const postData = postSnapshot.data();
          if (postData && postData.inviteUser) {
            const updatedInviteUser = postData.inviteUser.map((daa: any) => {
              const userId = daa.userId;
              if (userId === currentUserId) {
                return { ...daa, status: "accepted" };
              } else {
                return daa;
              }
            });

            // Update the Firestore document with the new inviteUser array
            await postSnapshot.ref.update({ inviteUser: updatedInviteUser });

            const postPostId = postData.postId;
            const postSenderId = postData.senderId;

            // Create a new document in the "activePost" collection
            const activePostPromise = firestore().collection("activePost").add({
              postId: postPostId,
              receiverUid: currentUserId,
              senderUid: postSenderId,
              status: "accepted",
            });

            // Wait for both operations to complete
            await Promise.all([activePostPromise]);

            console.log("Post invitations updated successfully.");
            setLoading(false);
          } else {
            console.log(
              "Data or inviteUser property is missing in the document."
            );
            setLoading(false);
          }
        } else {
          console.log("Document does not exist");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching or processing post data:", error);
        setLoading(false);
      }
    };

    // decline post request
    const handleDecline = async (invitationId: any) => {
      try {
        setLoading(true);
        const postSnapshot = await firestore()
          .collection("postInvites")
          .doc(invitationId)
          .get();

        if (postSnapshot.exists) {
          const postData = postSnapshot.data();
          if (postData && postData.inviteUser) {
            const updatedInviteUser = postData.inviteUser.map((daa: any) => {
              const userId = daa.userId;
              if (userId === currentUserId) {
                return { ...daa, status: "decline" };
              } else {
                return daa;
              }
            });
            // Update the Firestore document with the new inviteUser array
            await postSnapshot.ref.update({ inviteUser: updatedInviteUser });

            console.log("Post invitations updated successfully.");
            setLoading(false);
          } else {
            console.log(
              "Data or inviteUser property is missing in the document."
            );
            setLoading(false);
          }
        } else {
          console.log("Document does not exist");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching or processing post data:", error);
        setLoading(false);
      }
    };
    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={[styles.activityView, { height: 60 }]}>
            <ActivityIndicator size="small" color="orange" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {item?.inviteUser.some(
              (invite: { userId: string; status: string }) =>
                invite.userId === currentUserId && invite.status === "pending"
            ) && (
              <View style={[styles.friendList]}>
                <View style={styles.touchNote}>
                  {item.sender.Image !== null ? (
                    <View>
                      <Image
                        source={{ uri: item.sender.Image }}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          borderWidth: 2,
                          borderColor: "gray",
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.imageView}>
                      <Image
                        source={require("../../assets/boy-avatar.png")}
                        style={styles.noteImg}
                      />
                    </View>
                  )}

                  <View style={styles.noteView}>
                    <Text style={[styles.noteText, { color: "black" }]}>
                      {item.sender.Name}
                    </Text>
                    <Text style={styles.noteText}>{item.sender.UserName}</Text>
                  </View>

                  <View style={styles.acceptView}>
                    <TouchableOpacity
                      onPress={() => handleDecline(item.id)}
                      style={styles.acceptBtn}
                    >
                      <Text style={styles.acceptText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAccept(item.id)}
                      style={[styles.acceptBtn, { backgroundColor: "green" }]}
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => showActivePlace(item)}
                  style={styles.placeText}
                >
                  <Text style={styles.place}>
                    {item.post && item.post?.Location.place_name.length > 30
                      ? item.post?.Location.place_name.slice(0, 30)
                      : item.post?.Location.place_name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={require("../../assets/december-2.png")}
                        style={styles.placeImg}
                      />
                      <Text style={styles.placeFont}>{item.post?.Date}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={require("../../assets/stop-watch.png")}
                        style={styles.placeImg}
                      />
                      <Text style={styles.placeFont}>{item.post?.Time}</Text>
                    </View>
                    <View style={styles.divView}>
                      {selectedItemID !== item.id ? (
                        <Image
                          source={require("../../assets/up-arrow.png")}
                          style={styles.divImg}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/down-arrow.png")}
                          style={styles.divImg}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {selectedItemID === item.id && (
                  <View style={styles.viewProfile}>
                    <Text style={styles.noteShow}>
                      {item.post && item.post?.Note.length > 0
                        ? item.post?.Note.slice(0, 30)
                        : item.post?.Note}
                    </Text>
                    {item.post?.Image !== null ? (
                      <Image
                        source={{ uri: item.post?.Image }}
                        style={styles.requirImage}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/cafe.png")}
                        style={styles.requirImage}
                      />
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
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
          <MapView data={""} />
          <View style={styles.segmentView}>
            <View style={styles.segmentControl}>
              <TouchableOpacity
                onPress={() => handleSegmentPress("Active")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "Active" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "Active" && styles.selectedSegmentText,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSegmentPress("Invites")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "Invites" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "Invites" && styles.selectedSegmentText,
                  ]}
                >
                  Invites
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSegmentPress("Past")}
                style={[
                  styles.segmentButton,
                  selectedSegment === "Past" && styles.selectedSegment,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedSegment === "Past" && styles.selectedSegmentText,
                  ]}
                >
                  Past
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedSegment === "Active" && (
            <View style={[styles.segmentDiv, { marginTop: 40 }]}>
              {!activeList || activeList.length === 0 ? (
                <View style={[styles.dataView, styles.whiteView]}>
                  <Text style={styles.emptyMsg}>No active posts available</Text>
                </View>
              ) : (
                <View style={{ flex: 1, marginTop: 15 }}>
                  <FlatList
                    data={activeList}
                    renderItem={renderActiveList}
                    // nestedScrollEnabled={true}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    // scrollEnabled={true}
                  />
                </View>
              )}
            </View>
          )}

          {selectedSegment === "Invites" && (
            <View style={[styles.segmentDiv, { marginTop: 40 }]}>
              {!inviteUser || inviteUser.length === 0 ? (
                <View style={[styles.dataView, styles.whiteView]}>
                  <Text style={styles.emptyMsg}>No invitations available</Text>
                </View>
              ) : (
                <View style={{ marginTop: 15, marginBottom: 200 }}>
                  <FlatList
                    data={inviteUser}
                    // nestedScrollEnabled={true}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderInviteList}
                  />
                </View>
              )}
            </View>
          )}

          {selectedSegment === "Past" && (
            <View style={[styles.segmentDiv, { marginTop: 40 }]}>
              {!activeList || activeList.length === 0 ? (
                <View style={[styles.dataView, styles.whiteView]}>
                  <Text style={styles.emptyMsg}>No post available</Text>
                </View>
              ) : (
                <View style={{ marginTop: 15, marginBottom: 200 }}>
                  <FlatList
                    data={activeList}
                    // nestedScrollEnabled={true}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderPastList}
                  />
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
  segmentView: {
    flex: 1,
    position: "absolute",
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
    justifyContent: "space-evenly",
  },
  segmentButton: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedSegment: {
    backgroundColor: "black",
    margin: 3,
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
    alignSelf: "center",
  },
  dataView: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
  },
  friendList: {
    backgroundColor: "white",
    width: "98%",
    height: "auto",
    borderRadius: 8,
    marginTop: 5,
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  friendTouchButton: {
    backgroundColor: "black",
    height: 35,
    width: 90,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 6,
    right: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  chatText: {
    color: "white",
    fontWeight: "bold",
  },
  twintyText: {
    position: "absolute",
    right: 30,
    top: 15,
    color: "blue",
  },
  touchNote: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
  },
  noteImg: {
    height: 65,
    width: 65,
    borderRadius: 32.5,
  },
  noteText: {
    fontWeight: "bold",
    color: "gray",
  },
  noteView: {
    alignSelf: "center",
    paddingLeft: 10,
    width: 180,
  },
  messageTouch: {
    flexDirection: "row",
    height: 30,
  },
  messageText: {
    position: "absolute",
    left: 20,
    top: 13,
    color: "gray",
  },
  placeText: {
    backgroundColor: "black",
    height: 30,
    justifyContent: "space-around",
    flexDirection: "row",
    borderEndEndRadius: 5,
    borderEndStartRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  place: {
    width: 120,
    height: 20,
    color: "white",
    fontWeight: "600",
  },
  placeImg: {
    height: 20,
    width: 20,
    marginRight: 3,
  },
  placeFont: {
    color: "white",
    marginRight: 10,
    alignSelf: "center",
    fontWeight: "600",
  },
  divView: {
    position: "absolute",
    right: -18,
  },
  divImg: {
    height: 20,
    width: 20,
    tintColor: "white",
    marginRight: 6,
    alignItems: "center",
  },
  viewProfile: {
    backgroundColor: "gray",
    alignItems: "center",
    marginTop: 2,
    borderRadius: 8,
  },
  noteShow: {
    color: "white",
    marginTop: 8,
  },
  requirImage: {
    height: 400,
    width: 400,
    marginTop: 10,
  },
  activityView: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    height: 50,
    marginTop: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
  imageView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptBtn: {
    height: 35,
    width: 90,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 20,
    margin: 2,
  },
  acceptView: {
    flexDirection: "row",
    alignSelf: "center",
    position: "absolute",
    right: 10,
  },
  acceptText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyMsg: {
    alignSelf: "center",
    color: "gray",
    fontWeight: "bold",
  },
  whiteView: {
    backgroundColor: "white",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default TwibsView;

interface UserDetails {
  id: string;
  name: {
    Date: string;
    Location: string;
    Image: null;
    Note: string;
    paymentType: string;
    Time: string;
    VisibleTo: string;
  };
}
