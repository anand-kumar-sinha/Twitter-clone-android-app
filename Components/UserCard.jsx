import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserState } from "../Context";

const UserCard = ({ admin }) => {
  const navigation = useNavigation();

  const {setLoading, setSelectedPosts} = UserState()

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
  return (
    <TouchableOpacity style={styles.mainCont} onPress={fetchDataUser}>
      <Image source={{ uri: admin?.avatar}} style={styles.image} alt="user" />
      <View>
        <Text style={{ fontWeight: "700", color: "white" }}>{admin?.name}</Text>
        <Text style={{ color: "gray" }}>@{admin?.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  mainCont: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    marginVertical: 8,
  },
  image: { width: 50, height: 50, borderRadius: 100, marginRight: 20 },
});
