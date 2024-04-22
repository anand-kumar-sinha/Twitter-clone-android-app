import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import PostCard from "../Components/PostCard";
import { UserState } from "../Context";
import TweetFloat from "../Components/TweetFloat";


const Home = ({ navigation }) => {
  const [switcher, setSwitcher] = useState("All");
  const { allPosts, loading } = UserState();
  return (
    <View style={{ height: "100%", backgroundColor: '#000' }}>
      <TweetFloat />
      <ScrollView  contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.switcherCont}>
          <TouchableOpacity
            style={styles.postSection}
            onPress={() => setSwitcher("All")}
          >
            <Text
              style={styles.btnText}
            >
              For You
            </Text>
            {switcher === "All" && <View style={styles.blueLine}></View>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postSection}
            onPress={() => setSwitcher("Following")}
          >
            <Text style={styles.btnText}>Followings</Text>
            {switcher === "Following" && <View style={styles.blueLine}></View>}
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size={40} color="#0000ff" />
        ) : (
          allPosts &&
          allPosts?.map((item, index) => (
            <PostCard
              key={index}
              desc={item?.desc}
              postImg={item?.postImg}
              likesCount={item?.likes}
              retweetsCount={item?.retweets}
              comments={item?.comments}
              admin={item?.admin}
              id={item?._id}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  blueLine: {
    backgroundColor: "blue",
    width: "50%",
    height: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  postSection: {
    width: "50%",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    color: "white",
  },
  switcherCont: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
