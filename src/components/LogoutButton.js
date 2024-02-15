import { Button, StyleSheet } from 'react-native';
import { signout, purgePcesAccs, purgeBc } from "../redux/actions";
import * as React from "react";
import { useDispatch } from "react-redux";  



const LogoutButton = () => {
    const dispatch = useDispatch();
    return <Button onPress={() => {dispatch(signout()); dispatch(purgePcesAccs()); dispatch(purgeBc())}} title="Se déconnecter" style={styles.button}/>
};

const styles = StyleSheet.create({
    button: {
      height: 20,
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 3,
      marginBottom: 30,
    },
  });

export default LogoutButton;