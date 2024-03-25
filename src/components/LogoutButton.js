import { Button, StyleSheet } from 'react-native';
import { signout, purgePcesAccs, purgeBc, apiEmptyData } from "../redux/actions";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";  
import apiCall from "../redux/apiCall";



const LogoutButton = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.tokenReducer.username);
  let tab = [];
  tab.push(username);
  let url = "https://back-xxx.monkey-soft.fr:54443/apps/userapplogout/";
  let token = "";

  return <Button onPress={() => {dispatch(apiCall(url, token, tab));dispatch(signout()); dispatch(purgePcesAccs()); dispatch(purgeBc()); dispatch(apiEmptyData());}} title="Se déconnecter" color="#0000b3"/>
};

/* const styles = StyleSheet.create({
    logoutbutton: {
      height: 20,
      backgroundColor: "green",
      padding: 10,
      borderRadius: 3,
      marginBottom: 30,
    },
  }); */

export default LogoutButton;