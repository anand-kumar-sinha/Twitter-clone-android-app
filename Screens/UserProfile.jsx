import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { UserState } from "../Context";
import TweetFloat from "../Components/TweetFloat";
import PostCard from "../Components/PostCard";
import StatusModel from "../Components/StatusModel";

const UserProfile = ({ route, navigation }) => {
  const [switcher, setSwitcher] = useState("Posts");
  const [statusModel, setStatusModel] = useState(false);
  const { admin } = route.params;
  const { user, selectedPosts, loading } = UserState();

  useEffect(() => {
    if (user._id === admin._id) {
      navigation.navigate("Profile");
    }
  }, []);

  return (
    <>
      <TweetFloat />
      {statusModel && (
        <StatusModel setStatusModel={setStatusModel} url={admin?.status} />
      )}
      <ScrollView style={{ backgroundColor: "#000" }}>
        <View>
          <Image
            style={styles.nativeimage}
            source={require("../assets/native.png")}
          />
          <View style={styles.userProCont}>
            <TouchableOpacity onPress={() => setStatusModel(true)}>
              <Image style={styles.userImage} source={{ uri: admin?.avatar }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: -50 }}>
            <Text style={styles.userName}>{admin.name}</Text>
            <Text style={styles.userUserName}>@ {admin.username}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={styles.bio}>{admin.bio}</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 20,
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.follow}>{admin.followers?.length}</Text>
              <Text style={styles.staticFollow}>Followers</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <Text style={styles.follow}>{admin.followings?.length}</Text>
              <Text style={styles.staticFollow}>Followings</Text>
            </View>
          </View>

          <View style={styles.switcherCont}>
            <TouchableOpacity
              style={styles.postSection}
              onPress={() => setSwitcher("Posts")}
            >
              <Text style={styles.btnText}>Posts</Text>
              {switcher === "Posts" && <View style={styles.blueLine}></View>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postSection}
              onPress={() => setSwitcher("Likes")}
            >
              <Text style={styles.btnText}>Likes</Text>
              {switcher === "Likes" && <View style={styles.blueLine}></View>}
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size={40} color="#0000ff" />
          ) : (
            selectedPosts &&
            selectedPosts?.map((item, index) => (
              <PostCard
                key={index}
                desc={item?.desc}
                postImg={item?.postImg}
                likesCount={item?.likes}
                retweetsCount={item?.comments}
                comments={item?.comments}
                admin={admin}
              />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  nativeimage: {
    backgroundColor: "#000",
    width: "100%",
    height: 180,
    paddingTop: 50,
  },
  userImage: {
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#000",
  },
  userProCont: {
    top: -30,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    padding: 7,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    marginTop: 20,
    width: 120,
  },
  btnText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 25,
    fontWeight: "900",
    color: "white",
  },
  userUserName: {
    color: "#5e5e5e",
  },
  follow: {
    fontWeight: "800",
    marginRight: 5,
    fontSize: 17,
    color: "white",
  },
  staticFollow: {
    color: "white",
  },
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
  switcherCont: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bio: {
    color: "white",
  },
});
