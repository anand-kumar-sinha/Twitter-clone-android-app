import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { UserState } from "../Context";
import PostCard from "../Components/PostCard";
import TweetFloat from "../Components/TweetFloat";
import StatusModel from "../Components/StatusModel";
import { Entypo } from "@expo/vector-icons";
import AddSatusModel from "../Components/AddSatusModel";

const Profile = ({ navigation }) => {
  const [switcher, setSwitcher] = useState("Posts");
  const { user, userPosts } = UserState();
  const [statusModel, setStatusModel] = useState(false);
  const [addStatusModel, setAddStatusModel] = useState(false);
  const [option, setOption] = useState(false);

  const optionHandler = (para) => {
    if (para === "close") {
      setOption(false);
      return;
    }
    if (para === "watch") {
      setOption(false);
      setAddStatusModel(false);
      setStatusModel(true);
      return;
    }
    if (para === "add") {
      setOption(false);
      setStatusModel(false);
      setAddStatusModel(true);
    }
  };

  return (
    <>
      <TweetFloat />
      {statusModel && (
        <StatusModel url={user?.status} setStatusModel={setStatusModel} />
      )}
      {option && (
        <View style={styles.cont}>
          <View style={styles.header}>
            <Text style={styles.btnText}>Status</Text>
            <Entypo
              name="cross"
              size={24}
              color="white"
              onPress={() => optionHandler("close")}
            />
          </View>
          <TouchableOpacity onPress={() => optionHandler("add")}>
            <Text style={[styles.btnText, styles.btnMod]}>Add New Status</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => optionHandler("watch")}>
            <Text style={[styles.btnText, styles.btnMod]}>Watch Status</Text>
          </TouchableOpacity>
        </View>
      )}
      {addStatusModel && (
        <AddSatusModel setAddStatusModel={setAddStatusModel} />
      )}

      <ScrollView style={{ backgroundColor: "#000" }}>
        <View>
          <Image
            style={styles.nativeimage}
            source={require("../assets/native.png")}
          />
          <View style={styles.userProCont}>
            <TouchableOpacity onPress={() => setOption(true)}>
              <Image style={styles.userImage} source={{ uri: user?.avatar }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate("Settings")}
            >
              <Text style={styles.btnText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: -50 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userUserName}>@ {user?.username}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={styles.bio}>{user?.bio}</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 20,
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.follow}>{user?.followers?.length}</Text>
              <Text style={styles.staticFollow}>Followers</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <Text style={styles.follow}>{user?.followings?.length}</Text>
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

          {userPosts &&
            userPosts?.map((item, index) => (
              <PostCard
                key={index}
                desc={item?.desc}
                postImg={item?.postImg}
                likesCount={item?.likes}
                retweetsCount={item?.comments}
                comments={item?.comments}
                admin={user}
              />
            ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  nativeimage: {
    backgroundColor: "#000",
    width: "100%",
    height: 180,
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
  staticFollow: {
    color: "white",
  },
  bio: {
    color: "white",
    fontSize: 15,
    marginTop: 10,
  },
  btnMod: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 20,
  },
  cont: {
    backgroundColor: "#000",
    position: "absolute",
    zIndex: 10,
    top: "40%",
    left: "10%",
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
});
