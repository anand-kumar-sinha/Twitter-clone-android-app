import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const CommentCard = ({item}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        margin: "2.5%",
        flexDirection: "row",
        padding: 10,
      }}
    >
      <View>
        <Image source={{uri: item?.user?.avatar}} style={{width: 50, height: 50, borderRadius: 100}}/>
      </View>
      <View style={{marginLeft: 10}}>
        <Text></Text>
        <Text></Text>
      </View>
      <Text style={styles.txt}>{item?.comment}</Text>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  txt: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});
