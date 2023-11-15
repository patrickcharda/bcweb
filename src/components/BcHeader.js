import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
} from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";

const BcHeader = ({ bc }) => {

  //const bcJSON = JSON.stringify(useSelector((state) => state.bcReducer.bc));
  return (
    <ScrollView style={styles.container}>
        <SafeAreaView>
            <Text>{bc.bc_num}</Text>
            <Text>{"N° Aff: "+bc.bc_num_affaire}</Text>
            <Text>{"Client: "+bc.bc_client}</Text>
            <Text>{"Chantier: "+bc.bc_chantier}</Text>
            <Text>{"Livraison: "+bc.bc_ville_livraison}</Text>
            <Text>{"Date Chargt prev: "+bc.bc_date_chargement_prev}</Text>
            <Text>{"Date Livr prev: "+bc.bc_date_livraison_prev}</Text>
            <Text>{"Transporteur: "+bc.bc_transporteur}</Text>
            <Text>{"Observations: "+bc.bc_observ}</Text>
            <Text></Text>
        </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e88",
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

export default BcHeader;
