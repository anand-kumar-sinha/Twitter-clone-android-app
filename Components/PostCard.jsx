import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  SimpleLineIcons,
  EvilIcons,
  FontAwesome6,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserState } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CommerModel from "./CommerModel";

const PostCard = ({
  desc,
  postImg,
  likesCount,
  comments,
  retweetsCount,
  admin,
  id,
}) => {
  const [option, setOption] = useState(false);
  const [commentModel, setCommentModel] = useState(false);
  const [retweet, setRetweet] = useState(retweetsCount);
  const [retweetColor, setRetweetColor] = useState(false);
  const [like, setLike] = useState(likesCount);
  const [likeColor, setLikeColor] = useState(false);

  const { setSelectedPosts, setLoading, setSelectedComments, user } =
    UserState();

  useEffect(() => {
    let index = retweetsCount.indexOf(user?._id);
    if (index !== -1) {
      setRetweetColor(true);
    }
    let like = likesCount.indexOf(user?._id);
    if (like !== -1) {
      setLikeColor(true);
    }
  });

  const fetchDataUser = async () => {
    try {
      navigation.navigate("User Profile", {
        admin: admin,
      });
      setLoading(true);
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
        const { data } = await axios.get(
          `https://backendtwitter.vercel.app/api/v1/users/user/${admin?._id}`,
          config
        );

        if (data) {
          setSelectedPosts(data?.user?.posts);
          setLoading(false);
        }
      }
    } catch (error) {
      alert(error);
      navigation.navigate("Home");
      setLoading(false);
    }
  };

  const commentHandler = async () => {
    try {
      setCommentModel(true);
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
        const { data } = await axios.get(
          `https://backendtwitter.vercel.app/api/v1/users/comment/${id}`,
          config
        );

        if (data) {
          setSelectedComments(data?.comments);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const retweetHandler = async () => {
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

        const { data } = await axios.get(
          `https://backendtwitter.vercel.app/api/v1/users/retweet/${id}`,
          config
        );

        if (data) {
          let index = retweet.indexOf(user._id);
          if (index !== -1) {
            retweet.splice(index, 1);
            setRetweetColor(false);
            return;
          }
          retweet.push(user?._id);
          setRetweetColor(true);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const likeHandler = async () => {
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

        const { data } = await axios.get(
          `https://backendtwitter.vercel.app/api/v1/users/like/${id}`,
          config
        );

        if (data) {
          let index = like.indexOf(user._id);
          if (index !== -1) {
            like.splice(index, 1);
            setLikeColor(false);
            return;
          }
          like.push(user?._id);
          setLikeColor(true);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {commentModel && (
        <CommerModel
          setCommentModel={setCommentModel}
          id={id}
          commentHandler={commentHandler}
        />
      )}
      <TouchableOpacity
        style={{ width: "15%", height: 60 }}
        onPress={fetchDataUser}
      >
        <Image
          source={{
            uri: admin?.avatar,
          }}
          style={styles.userImage}
        />
      </TouchableOpacity>
      <View style={{ width: "82%" }}>
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={fetchDataUser}
          >
            <Text style={styles.userName}>{admin?.name}</Text>
            <Text style={styles.userUserName}>@{admin?.username}</Text>
          </TouchableOpacity>

          <SimpleLineIcons
            name="options-vertical"
            size={15}
            color="white"
            onPress={() => setOption(!option)}
          />
          {option && (
            <View style={styles.options}>
              <Text style={styles.optionsText}>Delete</Text>
              <Text style={styles.optionsText}>Share</Text>
            </View>
          )}
        </View>
        <View style={{ height: "100%", width: "100%", alignItems: "center" }}>
          <Text style={styles.userTweet}>{desc}</Text>
          <Image
            source={{
              uri: postImg,
            }}
            resizeMode="cover"
            style={styles.userPost}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={commentHandler}
            >
              <Text style={{ marginRight: 5, color: "white" }}>
                {comments?.length}
              </Text>
              <EvilIcons name="comment" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={retweetHandler}
            >
              <Text
                style={{
                  marginRight: 5,
                  color: retweetColor ? "#00fc00" : "white",
                }}
              >
                {retweet?.length}
              </Text>
              <FontAwesome6
                name="retweet"
                size={20}
                color={retweetColor ? "#00fc00" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={likeHandler}
            >
              <Text
                style={{
                  marginRight: 5,
                  color: likeColor ? "#ff2400" : "white",
                }}
              >
                {like?.length}
              </Text>
              <AntDesign
                name={likeColor ? "heart" : "hearto"}
                size={20}
                color={likeColor ? "#ff2400" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    height: 500,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20,
    position: "relative",
  },
  userImage: {
    height: 55,
    width: 55,
    borderRadius: 100,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  userUserName: {
    fontSize: 15,
    color: "gray",
    marginLeft: 10,
  },
  userTweet: {
    marginTop: 15,
    fontSize: 16,
    color: "white",
  },
  userPost: {
    width: "100%",
    height: "75%",
    borderRadius: 10,
    marginTop: 20,
    zIndex: 1,
    backgroundColor: "#000",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  options: {
    position: "absolute",
    top: 30,
    right: 0,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 5,
    width: 150,
  },
  optionsText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
