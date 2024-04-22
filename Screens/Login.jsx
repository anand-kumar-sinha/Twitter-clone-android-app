import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../Context";
import { FontAwesome6 } from "@expo/vector-icons";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {
    setUser,
    setAuth,
    auth,
    chn,
    setChn,
    setLoading,
    loading,
    setUserPosts,
  } = UserState();

  useEffect(() => {
    if (auth) {
      navigation.navigate("Home");
    }
  });

  const submitHandler = async () => {
    try {
      if (!username || !password) {
        alert("Please enter a username and password");
        return;
      }

      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        sameSite: "None",
      };
      const { data } = await axios.post(
        "https://backendtwitter.vercel.app/api/v1/users/login",
        { username, password },
        config
      );

      if (data) {
        await AsyncStorage.setItem("token", data?.token);
        const jsonValue = JSON.stringify(data?.user);
        await AsyncStorage.setItem("user", jsonValue);
        setUser(data?.user);
        setUserPosts(data?.user?.posts);
        setAuth(true);
        setChn(!chn);
        navigation.navigate("Home");
        setLoading(false);
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <View style={[styles.container]}>
          <ActivityIndicator
            size={80}
            color="#0000ff"
            style={{ backgroundColor: "#000", width: "100%", height: "100%" }}
          />
        </View>
      ) : (
        <View style={styles.cont}>
          <FontAwesome6 name="x-twitter" size={45} color="white" />
          <Text style={styles.text}>Login</Text>
          <View style={{ marginTop: 150 }}>
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="white"
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="white"
              secureTextEntry={true}
              value={password}
              onChangeText={(value) => setPassword(value)}
            />
            <TouchableOpacity style={styles.btn} onPress={submitHandler}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  text: {
    fontSize: 35,
    fontWeight: "900",
    color: "white",
    marginVertical: 30,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    color: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#1923dc",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cont: {
    paddingTop: 50,
    padding: 20,
    backgroundColor: "#000",
    height: "100%",
  },
});
