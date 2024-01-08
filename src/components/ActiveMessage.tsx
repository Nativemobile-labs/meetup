import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { GiftedChat, User, QuickReplies } from "react-native-gifted-chat"; 
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";

export default function ActiveMessage({ route }: any) {
  const { item } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [receiverId, setReceiverId] = useState<string | undefined>('');

  // fetch active post data....
  useEffect(() => {
    const fetchActivePostData = async () => {
      setLoading(true);
      try {
        if (item.id) {
          const snapShort = await firestore()
            .collection("activePost")
            .where("postId", "==", item.id)
            .get();
          const activeIds = snapShort.docs.map((doc) => doc.data());
          setReceiverId(activeIds[0].receiverUid);
        }
      } catch (error) {
        setLoading(false);
        console.log("activeData error:", error);
      }
    };
    fetchActivePostData();
  }, [item.id, receiverId]);


  // fetch user message data.....
  useEffect(() => {
    const chatRefPath = `chats/${item.id || item.postId}`;
    const chatRef = database().ref(chatRefPath);
  
    try {
      const onValueChange = chatRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const chatMessages: IMessage[] = Object.values(data);
          // chatMessages.sort((a, b) => a.createdAt - b.createdAt);
          setMessages(chatMessages);
        }
      });
      return () => {
        chatRef.off("value", onValueChange);
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [item.id, item.postId]);



  // handle send button........
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const newMessage: IMessage = newMessages[0];
    
    const senderMessage: IMessage = {
      ...newMessage,
      sendBy: auth().currentUser?.uid,
      sendTo: item.senderUid || receiverId,
      createdAt: Date.parse(newMessage.createdAt.toString()),
    };
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    const chatRefPath = `chats/${item.id || item.postId}`;
    database().ref(chatRefPath).push(senderMessage);
  }, [item.id, item.postId, item.senderUid, receiverId]);

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!loading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size={"large"} color={"orange"} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.placeText}>
            {item.treatData &&
              (item.treatData.Location.place_name.length > 25
                ? item.treatData.Location.place_name.slice(0, 25)
                : item.treatData.Location.place_name)}
            {item.name &&
              (item.name.Location.place_name.length > 25
                ? item.name.Location.place_name.slice(0, 25)
                : item.name.Location.place_name)}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.imageView, { marginRight: 140 }]}>
              <Image
                source={require("../../assets/december-2.png")}
                style={{ height: 25, width: 25, marginRight: 5 }}
              />
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {item.treatData && item.treatData.Date}
                {item.name && item.name.Date}
              </Text>
            </View>
            <View style={styles.imageView}>
              <Image
                source={require("../../assets/stop-watch.png")}
                style={{ height: 25, width: 25, marginRight: 5 }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", marginTop: 0 }}
              >
                {item.treatData && item.treatData.Time}
                {item.name && item.name.Time}
              </Text>
            </View>
          </View>

          {!loading ? (
            <View style={[styles.messageView, styles.loadingView]}>
              <ActivityIndicator size={"large"} color={"orange"} /> 
            </View>
          ) : (
            <View style={styles.messageShow}>
              <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                  _id: auth().currentUser?.uid || '',
                  
                }}
                inverted={true} 
                placeholder="Write a message"
                
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  placeView: {
    backgroundColor: "black",
  },
  placeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  messageView: {
    backgroundColor: "white",
    height: 635,
    width: 370,
    borderRadius: 5,
  },
  imageView: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  messageShow: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: 'hidden',
    width: 370,
    
  },
});

interface IMessage {
  _id: string | number
  text: string
  createdAt: Date | number
  user: User
  newMessages: any;
  sendBy: string | undefined;
  sendTo: string | undefined;
  image?: null
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
  quickReplies?: QuickReplies
}


