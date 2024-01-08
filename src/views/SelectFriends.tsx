import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import CheckBox from "react-native-check-box";
const db = firestore();
const currentUser = auth().currentUser?.uid;

const SelectFriends: React.FC = ({ route, navigation }: any) => {
  const { item } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState<User[]>([]);
  const [selectAllUser, setSelectAllUser] = useState<User[]>([]);

  // fetch user data.....
  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const usersRef = db.collection("user");
        const users: User[] = [];
        const querySnapshot = await usersRef.get();
        querySnapshot.forEach((doc: any) => {
          const user = doc.data() as User;
          user.id = doc.id;
          users.push(user);
        });
        const filteredUsers = users.filter((use) => use.id !== currentUser);
        setUserList(filteredUsers);
      } catch (error) {
        console.error("Error fetching user list:", error);
      } finally {
        setLoading(false);
      }
      setLoading(false)
    };
    fetchUserList();
  }, [item]);

  // selected all users....
  const toggleSelectAllUsers = () => {
    setUserList((prevUsers) =>
      prevUsers.map((user) => ({ ...user, selected: !allSelected }))
    );
    setSelectAllUser(userList);
  };

  const allSelected = userList.every((user) => user.selected);
 
  // send invite from multiple or single user in current Post
  const handleSelectUser = async () => {
    try {
      setLoading(true);
      // Fetch the current invitations for the post
      const postInvitesSnapshot = await firestore()
        .collection("postInvites")
        .where("postId", "==", item.id)
        .get();

      let currentInvitations: any = [];
      let selectedUserIdsForMatching = []; // Declare the array here

      // Check if there is an existing document for the post
      if (!postInvitesSnapshot.empty) {
        const postInvitesDoc = postInvitesSnapshot.docs[0];
        currentInvitations = postInvitesDoc.data().inviteUser || [];

        // Filter out duplicate user IDs from the selected users
        const selectedUserIds = userList
          .filter((user) => user.selected)
          .map((user) => user.id)
          .filter(
            (userId) =>
              !currentInvitations.some(
                (invite: { userId: string }) => invite.userId === userId
              )
          );

        if (selectedUserIds.length === 0) {
          console.log("No new users selected for invitation.", selectedUserIds);
          return;
        }

        // Update existing document with new invitations and status for each user
        const updatedInvitations = selectedUserIds.map((userId) => ({
          userId,
          status: "pending",
        }));

        console.log("updatedInvitations", updatedInvitations);
        await postInvitesDoc.ref.update({
          inviteUser: [...currentInvitations, ...updatedInvitations],
          status: "pending",
        });

        // Store user IDs for matching in a separate array
        selectedUserIdsForMatching = [...selectedUserIds];

        console.log("Post invitations updated successfully.");
        console.log(
          "Selected user IDs for matching:",
          selectedUserIdsForMatching
        );

        // Update the user list if needed
        setUserList((prevUsers) =>
          prevUsers.map((user) =>
            selectedUserIds.includes(user.id)
              ? { ...user, selected: false }
              : user
          )
        );
      } else {
        // If no existing document, create a new one
        const selectedUserIds = userList
          .filter((user) => user.selected)
          .map((user) => user.id);

        if (selectedUserIds.length === 0) {
          console.log("No users selected for invitation.");
          return;
        }

        const newInvitations = selectedUserIds
          .filter(
            (userId) =>
              !currentInvitations.some(
                (invite: { userId: string }) => invite.userId === userId
              )
          ) // Filter out duplicates
          .map((userId) => ({
            userId,
            status: "pending",
          }));

        // Store user IDs for matching in a separate array
        selectedUserIdsForMatching = [...selectedUserIds];

        await firestore()
          .collection("postInvites")
          .add({
            senderId: auth().currentUser?.uid,
            invitedUserIds: selectedUserIdsForMatching,
            inviteUser: [...currentInvitations, ...newInvitations],
            postId: item.id,
          });

        console.log("New document created for post invitations.");
        console.log(
          "Selected user IDs for matching:",
          selectedUserIdsForMatching
        );
      }
      setLoading(false);
      navigation.navigate("My Profile");
    } catch (error) {
      setLoading(false);
      console.error("Error updating post invitations:", error);
      navigation.navigate("My Profile");
    }
  };

  // render user list.....
  const renderUser = ({ item }: any) => {
    // selected only checked user
    const toggleSelectUser = (userId: any) => {
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, selected: !user.selected } : user
        )
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.renderView}>
            <ActivityIndicator size={"small"} color={"orange"} />
          </View>
        ) : (
          <View style={styles.renderView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <CheckBox
                  style={{ padding: 10 }}
                  onClick={() => toggleSelectUser(item.id)}
                  isChecked={item.selected}
                />
              </View>
              {item.Image !== null ? (
                <View style={styles.imageView}>
                  <Image
                    source={{ uri: item.Image }}
                    style={{ height: 45, width: 45, borderRadius: 22.5 }}
                  />
                </View>
              ) : (
                <View style={styles.imageView}>
                  <Image
                    source={require("../../assets/boy-avatar.png")}
                    style={styles.image}
                  />
                </View>
              )}
              <Text style={{ marginLeft: 10 }}>{item.Name}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {userList.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={{ color: "black" }}>Empty friend list</Text>
            </View>
          ) : (
            <View style={styles.viewContainer}>
              <CheckBox
                style={{ padding: 10 }}
                onClick={toggleSelectAllUsers}
                isChecked={allSelected}
                rightText={"Select All"}
              />
              <FlatList
                data={userList}
                scrollEnabled={true}
                keyExtractor={(item, index) => item.id}
                renderItem={renderUser}
                // nestedScrollEnabled={true}
              />
            </View>
          )}
        </View>
      )}
      <TouchableOpacity
        onPress={() => handleSelectUser()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  viewContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  renderView: {
    height: 60,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    justifyContent: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "green",
    height: 35,
    width: 110,
    position: "absolute",
    right: 15,
    bottom: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageView: {
    height: 50,
    width: 50,
    borderColor: "gray",
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
  emptyView: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    height: 40,
    marginHorizontal: 10,
    marginTop: 10,
  },
});

export default SelectFriends;

interface User {
  id: string;
  Name: string;
  UserName: string;
  DOB: string;
  Gender: string;
  Image: null;
  selected?: boolean; // Add selected property
}
