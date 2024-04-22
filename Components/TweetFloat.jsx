import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import NewTweet from "./NewTweet";

const TweetFloat = () => {
  const [tweetModel, setTweetModel] = useState(false)
  return (
    <>
      <TouchableOpacity style={styles.Cont} onPress={() => setTweetModel(true)}>
        <Text style={{ color: "white" }}>
          <MaterialIcons name="post-add" size={30} color="white" />
        </Text>
      </TouchableOpacity>
      {tweetModel && <NewTweet setTweetModel={setTweetModel}/>}
    </>
  );
};

export default TweetFloat;

const styles = StyleSheet.create({
  Cont: {
    backgroundColor: "rgba(0, 0, 200, 0.5)",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 100,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 3,
  },
});
