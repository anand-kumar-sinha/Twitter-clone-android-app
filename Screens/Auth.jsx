import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { UserState } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Auth = ({ navigation }) => {
  const { setUser, loading, setLoading, setUserPosts, setAuth, chn } =
    UserState();

  useEffect(() => {
    fetchUser();
  }, [chn]);

  const fetchUser = async () => {
    try {
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
          "https://backendtwitter.vercel.app/api/v1/users/me",
          config
        );

        if (data) {
          const jsonValue = JSON.stringify(data?.user);
          await AsyncStorage.setItem("user", jsonValue);
          setUser(data?.user);
          setUserPosts(data?.posts);
          setAuth(true);
          navigation.navigate("Home");
        }
      }

      setLoading(false);
    } catch (error) {
      alert(error.response.data.messge);
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
          <Text style={styles.text}>Happening Now.</Text>
          <Text style={styles.text}>Join Today.</Text>
          <View style={{ marginTop: 80 }}>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Create an Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Auth;

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    marginTop: 30,
  },
  btn: {
    backgroundColor: "#1923dc",
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
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
