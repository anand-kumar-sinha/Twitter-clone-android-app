import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Navigation from "./Navigation/Navigation";
import { UserProvider } from "./Context";

const App = () => {
  return (
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
