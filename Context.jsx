import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [allPosts, setAllPosts] = useState();
  const [userPosts, setUserPosts] = useState();
  const [searchedUser, setSearchedUser] = useState();
  const [chn, setChn] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState();
  const [selectComments, setSelectedComments] = useState();

  useEffect(() => {
    fetchAllPosts();
  }, [chn]);

  const fetchAllPosts = async () => {
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
          "https://backendtwitter.vercel.app/api/v1/users/allposts",
          config
        );

        if (data) {
          setAllPosts(data?.posts);
        }
      }

      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        userPosts,
        setUserPosts,
        allPosts,
        setAllPosts,
        auth,
        setAuth,
        searchedUser,
        setSearchedUser,
        chn,
        setChn,
        selectedPosts,
        setSelectedPosts,
        selectComments,
        setSelectedComments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  return useContext(UserContext);
};
