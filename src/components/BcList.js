import {
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import apiCall from "../redux/apiCall";
import { recordSelectedBc, purgePcesAccs } from "../redux/actions";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { useNavigation } from '@react-navigation/native';


const BcList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = React.useState(false);

  // au chargement uniquement
  React.useEffect(() => {
    dispatch(apiCall("https://demo-btw.monkey-soft.fr/bcweb/bcx/", token));
  }, []);

  const data = useSelector((state) => state.apiReducer.data.results);

  //const error = JSON.stringify(useSelector((state) => state.apiReducer.error));
  const loading = useSelector((state) => state.apiReducer.loading);
  const token = useSelector((state) => state.tokenReducer.token);
  let bc = undefined;

  const defineBc = (selectedBc) => {
    bc = selectedBc;
    console.log(
      "THIS IS THE BC " +
        bc.url +
        " pces : " +
        bc.pieces[0] +
        " pdts : " +
        bc.produits[0]
    );
    dispatch(recordSelectedBc(bc));
    dispatch(purgePcesAccs());
    getPieces(bc.pieces);
  };

  const getPieces = (tabPces) => {
    pcesList = tabPces;
    pcesList.forEach((pce) => {
      console.log(pce.slice(42,pce.length)); //=> récupération du numéro de pce
      //appel API pr récupérer toutes les infos de la pièce
      dispatch(apiCall("https://demo-btw.monkey-soft.fr/bcweb/pce/"+pce.slice(42,pce.length), token));
    });
    //appeler écran BCScreen
    
    navigation.navigate('Bc');
  };

  return (
    <ScrollView>
      <Message />
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <SafeAreaView>
          <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
            <Text>{isOpen ? "Close Dropdown" : "Open Dropdown"}</Text>
          </TouchableOpacity>
          {isOpen &&
            data.map((bc, index) => (
              <TouchableOpacity onPress={() => defineBc(bc)} key={index}>
                <Text>{bc.url}</Text>
              </TouchableOpacity>
            ))}
        </SafeAreaView>
      )}
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

export default BcList;