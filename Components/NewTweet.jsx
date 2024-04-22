import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../Context";

const NewTweet = ({ setTweetModel }) => {
  const { user, setLoading, loading, setChn, chn } = UserState();
  const [postImg, setPostImg] = useState();
  const [desc, setDesc] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPostImg(result.assets[0].uri);
    }
  };
  const submitHandler = async () => {
    try {
      setLoading(true);
      if (postImg) {
        const response = await fetch(postImg);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `posts/${user._id}/${Math.round(Math.random() * 100)}`
        );
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
          "https://backendtwitter.vercel.app/api/v1/users/createpost",
          { desc, postImg: imgUrl },
          config
        );

        if (data) {
          setLoading(false);
          setTweetModel(false);
          setChn(!chn);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
      setTweetModel(false);
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainCont}>
      <View style={styles.head}>
        <Text style={styles.txt}>New Tweet</Text>
        <Entypo
          name="cross"
          size={24}
          color="white"
          onPress={() => setTweetModel(false)}
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Tweet..."
          placeholderTextColor="gray"
          value={desc}
          onChangeText={(text) => setDesc(text)}
        />
        <TouchableOpacity onPress={pickImage}>
          <EvilIcons
            name="image"
            size={40}
            color="blue"
            style={{ padding: 10 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 10 }}>
        {postImg && (
          <Image
            source={{ uri: postImg }}
            style={{
              width: "100%",
              height: 300,
              zIndex: 10,
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
        )}
        {desc && (
          <>
            <Text style={styles.txt}>Tweet: </Text>
            <Text style={styles.desc}>{desc}</Text>
          </>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.btnText}>Tweet</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewTweet;

const styles = StyleSheet.create({
  txt: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  mainCont: {
    width: "90%",
    height: "90%",
    zIndex: 10,
    position: "absolute",
    top: "5%",
    left: "5%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 20,
  },
  input: {
    borderColor: "gray",
    color: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  desc: {
    color: "white",
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
});
