import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { Entypo } from "@expo/vector-icons";

const StatusModel = ({ url, setStatusModel }) => {
  return (
    <View style={styles.cont}>
      <View style={styles.header}>
        <Text style={styles.txt}>Status</Text>
        <Entypo
          name="cross"
          size={24}
          color="white"
          onPress={() => setStatusModel(false)}
        />
      </View>
      {url ? (
        <WebView
          source={{
            uri: url,
          }}
          startInLoadingState="true"
          style={styles.video}
        />
      ) : (
        <Text style={styles.txt}>No Status Found.</Text>
      )}
    </View>
  );
};

export default StatusModel;

const styles = StyleSheet.create({
  cont: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "absolute",
    width: "95%",
    margin: "2.5%",
    marginTop: "25%",
    zIndex: 5,
    height: "80%",
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
});
