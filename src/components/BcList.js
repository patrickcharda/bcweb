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
import axios from 'axios';
import { recordSelectedBc, purgePcesAccs } from "../redux/actions";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

const appliname = "bcweb";
const fingerprint = Application.getAndroidId().toString()+Application.nativeBuildVersion+Device.deviceYearClass.toString();


const BcList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = React.useState(false);

  const loading = useSelector((state) => state.apiReducer.loading);
  const token = useSelector((state) => state.tokenReducer.token);
  const username = useSelector((state) => state.tokenReducer.username);


  const NB_ITER = 4;
  const DELAY_N_SECONDS = 5000;

  const endpointCheckok = "https://back-xxx.monkey-soft.fr:54443/bcweb/checkok/";
  
  // au chargement uniquement
  /* React.useEffect(() => {
    dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/bcx/", token));
  }, []);
  React.useEffect(() => {
    let tab = [];
    tab.push(username);
    console.log("the username is "+tab[0]);
    dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/reprise/", token, tab));
  }, []); */

  React.useEffect(() => {
    dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/bcx/", token))
      .then(() => {
        let tab = [];
        tab.push(username);
        //console.log("the username is "+tab[0]);
        return dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/reprise/", token, tab));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const data = useSelector((state) => state.apiReducer.data.results);

  const error = JSON.stringify(useSelector((state) => state.apiReducer.error));
  
  let bc = undefined;

  const defineBc = async (selectedBc) => {
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
    await ouvrir(token, username, bc.bc_num);
    await checkok(token, username);
    getPieces(bc.pieces);
  };
  
  const ouvrir = async (token, username, bc_num ) => {
    
    let tab = [];
    tab.push(username);
    tab.push(bc_num);
    
    try {
      //si un bl est sélectionné ds la liste déroulante, mettre en pause pour pouvoir charger les données
      if (bc_num != "") {
          //let openBL = await Model.ouvrir(BASE_URL + "/bcweb/ouvrir/", token, username, this.args[0]);
          dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/ouvrir/", token, tab));

      }
    } catch (error) {
    //
    }
  }

  /* const checkok = async (token, username) => {
    let tabl = [];
    tabl.push(username);
    
    try {
      //si un bl est sélectionné ds la liste déroulante, mettre en pause pour pouvoir charger les données

      let i = 0;
      let signalToGo = false;
      let result_checkok ="";
      while ((i < NB_ITER) && (signalToGo==false)) {
        await new Promise(resolve => setTimeout(resolve,DELAY_N_SECONDS));
        dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/checkok/", token, tabl));
        //const dataResponse = useSelector((state) => state.apiReducer.data);
        console.log("command checkok ... ...");
        console.log('data : '+JSON.stringify(data));
        console.log('error : '+error);
        /* if (data.count > 0) {
          signalToGo = true;
          console.log('it is true');
        } 
        i++;
      }
    } catch (error) {
      console.log('error : '+error);
    }
    console.log('data : '+JSON.stringify(data));
    console.log('error : '+error);
    return ("");
  } */

  const checkok = async (token, username) => {
    let tabl = [];
    tabl.push(username);
    
    try {
      //si un bl est sélectionné ds la liste déroulante, mettre en pause pour pouvoir charger les données

      let i = 0;
      let signalToGo = false;
      let response ="";
      while ((i < NB_ITER) && (signalToGo==false)) {
        await new Promise(resolve => setTimeout(resolve,DELAY_N_SECONDS));
          response = await axios.post(
          endpointCheckok,
          JSON.stringify({
            username: username,
            }),
            {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Authorization": token,
              "appliname": appliname,
              "fingerprint": fingerprint,
              },
            }
          );
        
        console.log("REPONSE DATA CHECKOK "+ response.data.message);
        if (response.data.message === "> ok") {
          signalToGo = true;
          console.log("SIGNALTOGO "+signalToGo);
        }
        i++;
      }
      if (signalToGo === true) {
        /* let pcesDuBc = await axios.get(
          "https://back-xxx.monkey-soft.fr:54443/bcweb/pcesdubc/" 
        )*/

      }


    } catch (error) {
      console.log('error : '+error);
    }
    console.log('data : '+JSON.stringify(data));
    console.log('error : '+error);
    return ("");
  }

  const getPieces = (tabPces) => {
    pcesList = tabPces;
    pcesList.forEach((pce) => {
      console.log(pce.slice(48,pce.length)); //=> récupération du numéro de pce
      //appel API pr récupérer toutes les infos de la pièce
      dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/pce/"+pce.slice(48,pce.length), token));
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
                <Text>{bc.bc_num}</Text>
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