import {
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { recordSelectedBc, purgePcesAccs } from "../redux/actions";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { useNavigation } from '@react-navigation/native';


// composant récupérant dans le state le dernier composant utilisé

const BcLast = () => {

  const lastEditedBc = useSelector((state) => state.bcReducer.bc);
  const navigation = useNavigation();

  const openBc = () => {
    navigation.navigate('Bc');
  };


  return (
    <View>
      <TouchableOpacity onPress={() => openBc()} >
          <Text>{ '\n\nCliquer pour réouvrir le dernier bon de chargement édité depuis cet appareil : '}{lastEditedBc.bc_num}</Text>
      </TouchableOpacity>
    </View>
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

export default BcLast;