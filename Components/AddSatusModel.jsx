import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../Context";

const AddSatusModel = ({ setAddStatusModel }) => {
  const [status, setStatus] = useState();
  const { setLoading, user, loading } = UserState();

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setStatus(result.assets[0].uri);
      statusHandler(result.assets[0].uri);
    }
  };

  const statusHandler = async (link) => {
    try {
      setLoading(true);
      if (link) {
        const response = await fetch(link);
        const blob = await response.blob();
        const storageRef = ref(storage, `status/${user._id}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            toast(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              statusProcess(downloadURL);
            });
          }
        );
      } else {
        alert("Please Select a video");
        return;
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const statusProcess = async (url) => {
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

        const { data } = await axios.post(
          "https://backendtwitter.vercel.app/api/v1/users/add/status",
          { url },
          config
        );
        setLoading(false);
        setAddStatusModel(false)
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <View style={styles.cont}>
      <View style={styles.header}>
        <Text style={styles.txt}>Add Status</Text>
        <Entypo
          name="cross"
          size={24}
          color="white"
          onPress={() => setAddStatusModel(false)}
        />
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={pickVideo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[styles.btnText]}>Add New Status</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddSatusModel;

const styles = StyleSheet.create({
  cont: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "#000",
    position: "absolute",
    width: "95%",
    margin: "2.5%",
    marginTop: "90%",
    zIndex: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 20,
  },
  txt: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#1923dc",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
  },
  btnText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});
