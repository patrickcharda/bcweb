import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  Alert,
} from "react-native";

import { useDispatch } from "react-redux";
import { changePceLoadedStatus } from "../redux/actions";
import * as React from "react";


const BcPce = ( {piece, loaded} ) => {

  const pieceJson = JSON.stringify(piece)
  const pce = piece;
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
        <SafeAreaView>
          <Text>{piece.id}</Text>
          <Text>{pieceJson}</Text>
          <Button
          title={loaded ? "Unload" : "Load"}
          onPress={() => dispatch(changePceLoadedStatus(pce))}></Button>
          <Text></Text>
        </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aaa",
    color: "#bdc3c7",
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

export default BcPce;
