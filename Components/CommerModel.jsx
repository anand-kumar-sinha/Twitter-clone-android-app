import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import CommentCard from "./CommentCard";
import { UserState } from "../Context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommerModel = ({ setCommentModel, id, commentHandler }) => {
  const { selectComments, loading } = UserState();
  const [comment, setComment] = useState("");

  const startComment = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${value}`,
          },
          withCredentials: true,
          sameSite: "None",
        };
        const { data } = await axios.post(
          `https://backendtwitter.vercel.app/api/v1/users/comment/${id}`,
          { comment },
          config
        );

        if (data) {
          selectComments.push(data?.comment);
          commentHandler();
          setComment("");
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <View style={styles.mainCont}>
      <View style={styles.head}>
        <Text style={styles.txt}>Comments</Text>
        <Entypo
          name="cross"
          size={24}
          color="white"
          onPress={() => setCommentModel(false)}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={styles.inp}
          placeholder="start a comment"
          placeholderTextColor="gray"
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <AntDesign
          name="arrowright"
          size={24}
          color="white"
          onPress={startComment}
        />
      </View>
      <ScrollView nestedScrollEnabled={true}>
        {selectComments && selectComments?.length === 0 ? (
          <Text style={styles.txt}>No comments found.</Text>
        ) : (
          selectComments?.map((item, index) => (
            <CommentCard key={index} item={item} />
          ))
        )}
        {loading && (
          <ActivityIndicator
            size={30}
            style={{ marginTop: 20 }}
            color="#0000ff"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default CommerModel;

const styles = StyleSheet.create({
  mainCont: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    position: "absolute",
    width: "100%",
    margin: "2.5%",
    zIndex: 5,
    height: "100%",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 20,
  },
  txt: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  inp: {
    width: "85%",
    margin: "3%",
    padding: 10,
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
});
