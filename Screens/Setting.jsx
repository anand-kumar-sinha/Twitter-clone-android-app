import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { UserState } from "../Context";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting = ({ navigation }) => {
  const { user, setUser, setChn, chn, setLoading, loading, setAuth } =
    UserState();

  const [avatar, setAvatar] = useState(user?.avatar);
  const [name, setName] = useState(user?.name);
  const [userName, setUserName] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [bio, setBio] = useState(user?.bio);

  const logoutHandler = async () => {
    try {
      setAuth(false);
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
      alert("User logged out");
    } catch (error) {
      alert(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      if (avatar) {
        const response = await fetch(avatar);
        const blob = await response.blob();
        const storageRef = ref(storage, `files/${user._id}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              dataSender(downloadURL);
            });
          }
        );
      } else {
        dataSender();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const dataSender = async (imgUrl) => {
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

        const { data } = await axios.put(
          "https://backendtwitter.vercel.app/api/v1/users/editprofile",
          { name, bio, avatar: imgUrl },
          config
        );

        if (data) {
          setUser(data?.user);
          setChn(!chn);
          navigation.navigate("Profile");
        }
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.Cont}>
      <Image source={require("../assets/native.png")} style={styles.native} />
      <View style={{ paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: avatar }} style={styles.userImg} />
        </TouchableOpacity>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          placeholder="name"
          placeholderTextColor="gray"
        />
        <TextInput
          value={userName}
          onChangeText={(text) => setUserName(text)}
          style={[styles.input, styles.inputFalse]}
          placeholder="username"
          placeholderTextColor="gray"
          editable={false}
        />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={[styles.input, styles.inputFalse]}
          placeholder="email"
          placeholderTextColor="gray"
          editable={false}
        />
        <TextInput
          value={bio}
          onChangeText={(text) => setBio(text)}
          style={styles.input}
          placeholder="Bio"
          placeholderTextColor="gray"
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.btnText}>save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnRed]}
          onPress={logoutHandler}
        >
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  Cont: {
    backgroundColor: "#000",
    height: "100%",
  },
  native: {
    backgroundColor: "#000",
    width: "100%",
    height: 180,
    paddingTop: 50,
  },
  userImg: {
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#000",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    color: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  inputFalse: {
    color: "gray",
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
  btnRed: {
    backgroundColor: "red",
  },
});
