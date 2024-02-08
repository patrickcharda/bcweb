import * as React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import BcListScreen from "./screens/BcListScreen";
import BcScreen from "./screens/BcScreen";
//import Message from "./Message";
import { signout, purgePcesAccs } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* const endpointBc = "https://demo-btw.monkey-soft.fr/bcweb/bcx/";
const endpointRefreshToken = "https://demo-btw.monkey-soft.fr/refresh-token/"; */

const Stack = createNativeStackNavigator();

const Main = () => {
  const logged = useSelector((state) => state.tokenReducer.isLogged);
  const dispatch = useDispatch();
  //const hasPcesOrAccs = useSelector((state) => ! state.pcesAccsReducer.empty);

  useEffect(() => {
    dispatch(signout());
    dispatch(purgePcesAccs());
  }, [dispatch]);

  return (
    <Stack.Navigator>
      {logged ? 
        [<Stack.Screen
          name="BcList"
          component={BcListScreen}
          options={{ title: "Liste des Bons de chargement" }}
          key="1"
        />,<Stack.Screen
          name="Bc"
          component={BcScreen}
          options={{ title: "Bon de chargement" }}
          key="2"
        />]
         : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  toolbar: {
    backgroundColor: "#3498db",
    color: "#fff",
    textAlign: "center",
    padding: 25,
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  preview: {
    backgroundColor: "#bdc3c7",
    flex: 1,
    height: 500,
  },
  input: {
    backgroundColor: "#ecf0f1",
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
});

export default Main;
