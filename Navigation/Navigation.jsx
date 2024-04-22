import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../Screens/Search";
import Profile from "../Screens/Profile";
import Auth from "../Screens/Auth";
import Login from "../Screens/Login";
import { UserState } from "../Context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserProfile from "../Screens/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Setting from "../Screens/Setting";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

function StackNavigation({ navigation }) {
  const { auth, setAuth } = UserState();

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
  return (
    <Stack.Navigator initialRouteName="Auth">
      {auth ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerRight: () => (
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="white"
                onPress={logoutHandler}
              />
            ),
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#000",
            },
          }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
      )}

      {!auth && (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name="User Profile"
        component={UserProfile}
        options={{
          headerBackTitle: "Back",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerBackTitle: "Back",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Setting}
        options={{
          headerBackTitle: "Back",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const { auth } = UserState();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          position: "fixed",
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={StackNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? "blue" : "white"}
            />
          ),
        }}
      />
      {auth && (
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name="search1"
                size={24}
                color={focused ? "blue" : "white"}
              />
            ),
          }}
        />
      )}
      {auth && (
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="face-grin"
                size={24}
                color={focused ? "blue" : "white"}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
export default Navigation;
