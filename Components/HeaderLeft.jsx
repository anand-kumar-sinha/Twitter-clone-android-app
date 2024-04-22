import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserState } from "../Context";

const HeaderLeft = () => {
  const { user } = UserState();
  return (
    <View style={styles.maincont}>
      <Image
        source={{ uri: user?.avatar }}
        style={{ width: 50, height: 50, borderRadius: 100 }}
      />
    </View>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({
  maincont: {
    backgroundColor: "green",
    width: '100%',
    height: 500,
  },
});
