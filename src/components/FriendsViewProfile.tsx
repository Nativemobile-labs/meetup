import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
const token =  'dMIZB-fWRgy1hd5-2E9SGK:APA91bEnGf63Xrec-yLRasT12lWS8N8Kzpq32JV-q3N7QNtNXS_IXZEDvWCpcHCMrPMKLSfxK3b81AsrYd79RAJu4vFjzemib0xSlkp1q0qVaB3dpi20U3vg85j1RfCq4gAmokVmw_pG'
const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send';
const accessToken = 'AAAA1ehA1gc:APA91bE7DbNIwV798vB2X91DGcn8N2FRLlZSY9jWQyWBAW8s8COrQmplkOvrQ4vDXtmwmdKeJeaFxX4ouocRtcTlq7aEFdmmbSmndvbr0A0mC0OX-XltUu43OXyDrPLffuywADfKF18J';   
const FriendsViewProfile = ({ route, navigation }: any) => {
  const UserItem = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<UserDetails[]>([]);
  const [selectPostUserId, setSelectPostUserId] = useState<string>("");
  const [postResults, setPostResults] = useState<postIds[]>([]);
  const currentUser = auth().currentUser?.uid;

  // fetch data from firebase......
  useEffect(() => {
    try {
      setLoading(true);
      firestore()
        .collection("Treat")
        .get()
        .then((querySnapshot) => {
          const temp: UserDetails[] = [];
          querySnapshot.forEach((documentSnapshot) => {
            const userDetails: UserDetails = {
              id: documentSnapshot.id,
              name: documentSnapshot.data() as any,
            };
            temp.push(userDetails);
            if (temp) {
              setDataList(temp);
            }
          });
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [UserItem]);

  
  // fetch data from join post......
  useEffect(() => {
    const fetchActivePosts = async () => {
      try {
        const currentUserUid = auth().currentUser?.uid;
        if (currentUserUid) {
          const snapshotInv = await firestore()
            .collection("postInvites")
            .where("invitedUserIds", "==", currentUserUid)
            .get();

          const invitePostsWhereCurrentUserIsReceiver = snapshotInv.docs.map(
            (doc) => doc.data()
          );

          // Now, fetch Invited posts where the current user is the sender
          const snapshotSenderInv = await firestore()
            .collection("postInvites")
            .where("senderId", "==", currentUserUid)
            .get();

          const invitePostsWhereCurrentUserIsSender =
            snapshotSenderInv.docs.map((doc) => doc.data());

          const snapshot = await firestore()
            .collection("activePost")
            .where("receiverUid", "==", currentUserUid)
            .get();

          const postsWhereCurrentUserIsReceiver = snapshot.docs.map((doc) =>
            doc.data()
          );

          // Now, Active fetch posts where the current user is the sender
          const snapshotSender = await firestore()
            .collection("activePost")
            .where("senderUid", "==", currentUserUid)
            .get();

          const postsWhereCurrentUserIsSender = snapshotSender.docs.map((doc) =>
            doc.data()
          );

          // Combine the results or use them as needed
          const allPosts = [
            ...invitePostsWhereCurrentUserIsReceiver,
            ...invitePostsWhereCurrentUserIsSender,
            ...postsWhereCurrentUserIsReceiver,
            ...postsWhereCurrentUserIsSender,
          ];

          // Extract unique postIds using a Set
          const uniquePostIds = new Set(allPosts.map((post) => post.postId));
          const postIdsArray = Array.from(uniquePostIds);
          setPostResults(postIdsArray);
          // console.log("Active Posts for Current User:", postIdsArray);
          const postIds = allPosts.map((post) => post.postId);
          setPostResults(postIds)
          // console.log("Active Posts for Current User:", postIds);
        }
      } catch (error) {
        console.error("Error fetching active posts:", error);
      }
    };
    fetchActivePosts();
  }, [currentUser]);

  // handle join post .......
  const handleJoinPost = async (Post: any) => {
    try {
      setLoading(true);
      // Fetch the current invitations for the post
      const postInviteSnapShort = await firestore()
        .collection("postInvites")
        .where("postId", "==", Post.id)
        .get();
  
      let currentInvitations: any = [];
  
      // Check if there is an existing document for the post
      if (!postInviteSnapShort.empty) {
        // Document(s) exist for the given postId
        console.log('Working: Documents found in "postInvites" collection.');
  
        // Extract data from existing document(s)
        currentInvitations = postInviteSnapShort.docs[0].data().inviteUser || [];
  
        // Log data for each document
        postInviteSnapShort.docs.forEach((doc) => {
          console.log("Document data:", doc.data());
        });
      } else {
        // No document found for the given postId
        console.log('No documents found in "postInvites" collection for the given postId.');
  
        // Add a new document with the specified data structure
        await firestore()
          .collection("postInvites")
          .add({
            senderId: auth().currentUser?.uid,
            invitedUserIds: [Post.name.UserID],
            inviteUser: [{ userId: Post.name.UserID, status: "pending" }],
            postId: Post.id,
          });

          // Notification
          var axios = require('axios');
          var data = JSON.stringify({
            data: {},
            notification: {
              body:'click to check open post',
              title: 'New Post Added',
            },
            to: accessToken
          })
          var config = {
            method: 'Post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers:{
              'Content-Type': 'application/json',
              'Authorization': fcmEndpoint,
            },
            data: data,
          }
          axios(config).then((response: any) =>{
            console.log(JSON.stringify(response.data));
          }).catch((err:any) => {
            console.log(err)
          })
      }
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("Join post error:", err);
    }
  };
  

  // render list......
  const renderList = ({ item }: { item: any }) => {
    // Function to get the payment type image
    const getPaymentTypeImage = (paymentType: string) => {
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
      return <Image source={imageSource} style={styles.giftImage} />;
    };

    // Function to render the visibility icon
    const renderVisibilityIcon = (visibilityType: string) => {
      let iconSource = "";
      switch (visibilityType) {
        case "Public":
          iconSource = require("../../assets/globe.png");
          break;
        case "Friends & Their Friends":
          iconSource = require("../../assets/multiple-users-silhouette.png");
          break;
        case "Friends":
          iconSource = require("../../assets/friends.png");
          break;
        case "Select Friends":
          iconSource = require("../../assets/selection.png");
          break;
        default:
          break;
      }
      return iconSource && <Image source={iconSource} style={styles.public} />;
    };

    // setSelectPostUserId
    setSelectPostUserId(item.name?.UserID);

    return (
      <TouchableOpacity onPress={() => navigation.navigate("Join Post", item)} >
        {item.name.UserID === UserItem.userIm && (
          <View style={styles.container}>
            <View style={styles.containerView}>
              <View style={styles.visibilityContainer}>
                <Text style={{ width: 60, height: 20, fontWeight: "bold" }}>
                  {item.name.Location.place_name}
                </Text>
                {renderVisibilityIcon(item.name.VisibleTo)}
              </View>

              {item.name.PaymentType && (
                <View style={styles.free}>
                  {getPaymentTypeImage(item.name.PaymentType)}
                  <Text style={styles.giftText}>{item.name.PaymentType}</Text>
                </View>
              )}
            </View>

            <View style={styles.anyDayView}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={require("../../assets/december-2.png")}
                  style={styles.calender}
                />
                <Text style={styles.anyDay}>{item.name.Date}</Text>
              </View>
              <Text style={{ color: "gray" }}>|</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../assets/stop-watch.png")}
                  style={styles.calender}
                />
                <Text style={styles.anyDay}>{item.name.Time}</Text>
              </View>
            </View>

            {!postResults.includes(item.id) && (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinPost(item)}
              >
                <Text style={styles.joinText}>Join</Text>
              </TouchableOpacity>
            )}

            {postResults.includes(item.id) && (
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: "black" }]}
                onPress={() => navigation.navigate("Active", { item })}
              >
                <Text style={[styles.joinText, { color: "white" }]}>
                  Chat Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <View style={styles.mainSubContainer}>
              {UserItem.Image !== null ? (
                <Image
                  source={{ uri: UserItem.Image }}
                  style={{ height: 115, width: 115, borderRadius: 57.5 }}
                />
              ) : (
                <Image
                  source={require("../../assets/boy-avatar.png")}
                  style={{ height: 140, width: 140 }}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <Text style={{ color: "black", fontWeight: "bold" }}>
                {UserItem.Name}
              </Text>
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                @{UserItem.UserName}
              </Text>
            </View>
          </View>
          <View>
            {!dataList || dataList.length === 0 ? (
              <View style={styles.noList}>
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  No Post add by @{UserItem.Name}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.postText}>{UserItem.Name}:Post</Text>
                <FlatList
                  data={dataList}
                  renderItem={renderList}
                  scrollEnabled={true}
                  keyExtractor={(item, index) => item.id.toString()}
                  contentContainerStyle={{paddingBottom: 100}}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: "silver",
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  mainSubContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "97%",
    height: "auto",
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "silver",
  },
  containerView: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-around",
    marginBottom: 20,
  },
  anyDayView: {
    flexDirection: "row",
    backgroundColor: "silver",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  anyDay: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
  },
  calender: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  joinButton: {
    backgroundColor: "#a473ce",
    height: 35,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  joinText: {
    color: "black",
    fontWeight: "bold",
  },
  public: {
    height: 18,
    width: 18,
    marginLeft: 5,
  },
  free: {
    flexDirection: "row",
    position: "absolute",
    right: 15,
  },
  noList: {
    height: 40,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  giftImage: {
    height: 18,
    width: 18,
  },
  giftText: {
    color: "black",
    marginLeft: 5,
    fontWeight: "bold",
  },
  visibilityContainer: {
    flexDirection: "row",
    position: "absolute",
    left: 15,
  },
  postText: {
    marginLeft: 10,
    marginBottom: 8,
    color: "black",
    fontWeight: "bold",
  },
  loaderView: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default FriendsViewProfile;

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

interface postIds {
  id: string;
  // Add other properties based on your actual data structure
}
