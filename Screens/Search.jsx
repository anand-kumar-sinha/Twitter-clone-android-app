import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserCard from "../Components/UserCard";
import { UserState } from "../Context";
import TweetFloat from "../Components/TweetFloat";

const Search = () => {
  const [search, setSearch] = useState("");

  const { searchedUser, setSearchedUser } = UserState();

  const submitHandler = async () => {
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
          `https://backendtwitter.vercel.app/api/v1/users/search/${search}`,
          config
        );

        if (data) {
          setSearchedUser(data?.student);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 50,
        height: "100%",
        backgroundColor: "#000",
      }}
    >
      <TweetFloat />
      <View style={styles.inpCont}>
        <TextInput
          style={styles.textInp}
          placeholder="Search..."
          placeholderTextColor="white"
          onChangeText={(text) => setSearch(text)}
          value={search}
        />
        <TouchableOpacity onPress={submitHandler}>
          <Text>
            <AntDesign name="search1" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {searchedUser &&
          searchedUser?.map((item, index) => (
            <UserCard
              key={index}
              admin={item}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  textInp: {
    margin: 10,
    fontSize: 20,
    width: "80%",
    color: "white",
  },
  inpCont: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
});
