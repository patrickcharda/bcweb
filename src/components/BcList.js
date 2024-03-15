import {
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Button,
} from "react-native";
import apiCall from "../redux/apiCall";
import axios from 'axios';
import { recordSelectedBc, purgePcesAccs, fetchPceSuccess, loadFullPcesTab, loadLoadedPcesTab, loadPropPcesTab, loadOtherPcesTab,
defineMessage, apiEmptyData, purgeBc, defineError, defineErrormsg, defineMsg, cleanAllMessagesErrors, CLEAN_ALL_MESSAGES_ERRORS } from "../redux/actions";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';


const appliname = "bcweb";
const fingerprint = Application.getAndroidId().toString()+Application.nativeBuildVersion+Device.deviceYearClass.toString();
const DELAY_N_SECONDS = 2000;
const NB_ITER = 5;

const BcList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isReinitOpen, setIsReinitOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalActualiserVisible, setModalActualiserVisible] = React.useState(false);
  const [currentBC, setCurrentBC] = React.useState(null);

  const loading = useSelector((state) => state.apiReducer.loading);
  const token = useSelector((state) => state.tokenReducer.token);
  const username = useSelector((state) => state.tokenReducer.username);
  const lastEditedBc = useSelector((state) => state.bcReducer.bc);

  const NB_ITER = 5;
  const DELAY_N_SECONDS = 2000;

  const endpointCheckok = "https://back-xxx.monkey-soft.fr:54443/bcweb/checkok/";
  
  React.useEffect(() => {
    dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/bcx/", token))
      .then(() => {
        let tab = [];
        tab.push(username);
        return dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/reprise/", token, tab));
      })
      .catch((error) => {
        console.error(error);
      });
    dispatch(cleanAllMessagesErrors())
  }, [refresh, lastEditedBc]);

  let data = useSelector((state) => state.apiReducer.data.results);

  const error = JSON.stringify(useSelector((state) => state.apiReducer.error));
  
  let bc;



  const defineBc = async (selectedBc) => {
    bc = selectedBc;
    dispatch(recordSelectedBc(bc));
    dispatch(purgePcesAccs());
    dispatch(cleanAllMessagesErrors());
    dispatch(defineMsg("Chargement du BC en cours"));
    await ouvrir(token, username, bc.bc_num);

    let tabPces = await checkok(token, username, bc.bc_num); // récupère le tableau de tableaux des pièces chargées, proposées et autres

    if (tabPces != "" && tabPces != undefined && tabPces != null) {
      navigation.navigate('Bc', { tabPces });
    } 
  };

  const reinit = async (selectedBC) => {
    let bc_num = selectedBC.bc_num;
    let msg = "bc_num to reinit "+bc_num;
    dispatch(cleanAllMessagesErrors());
    dispatch(defineMsg(msg));
    let body = {"username":username, "bc_num": bc_num};
    let fermer = await reinitialiser(token, appliname, fingerprint, body);
    let signalToGo = false;
    if (fermer.data.message === "fermer") {
      signalToGo = await checkOK();
    }
    if (signalToGo) {
      msg = "La réinitialisation s'est bien déroulée";
      dispatch(defineMsg(msg));
      setRefresh(refresh + 1);
    } else {
      msg = "La réinitialisation ne s'est pas bien déroulée, merci de réessayer ultérieurement";
      dispatch(defineMsg(msg));
    }
  }

  const reinitialiser = async(token, appliname, fingerprint, body) => {
    let fermer = await axios.post(
      "https://back-xxx.monkey-soft.fr:54443/bcweb/fermer/",
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": "Bearer "+token,
          "appliname": appliname,
          "fingerprint": fingerprint,
        },
      }
    );
    //console.log("fermer :" + JSON.stringify(fermer));
    return fermer
  }

  const goRefresh = () => {
    dispatch(cleanAllMessagesErrors());
    setRefresh(refresh + 1);
  }
  
  const ouvrir = async (token, username, bc_num ) => {   
    let tab = [];
    tab.push(username);
    tab.push(bc_num);   
    try {
      /* qd  un bl est sélectionné ds la liste déroulante, envoi cmde ouvrir pour mettre en pause pdt chargement des données */
      if (bc_num != "") {
          dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/ouvrir/", token, tab));
      }
    } catch (error) {
      dispatch(defineError("Problème commande 'ouvrir'"));
    }
  }

  const handleConfirm = (currentBC) => {
    // Handle the confirm action here
    console.log("CURRENT BC "+currentBC);
    reinit(currentBC);
    // si le bc reinitialisé est celui sur lequel on travaillait on réinitialise le state
    if (lastEditedBc !== undefined && lastEditedBc.bc_num == currentBC.bc_num) {
      dispatch(purgeBc());
      dispatch(purgePcesAccs());
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Handle the cancel action here
    setModalVisible(false);
  };
  /* cette version de checkok n'attend pas que le ok de l'automate wib, elle récupère aussi ttes les pièces du Bc et les retourne ds un tableau*/
  const checkok = async (token, username, bc_number) => {
    let tabl = [];
    tabl.push(username);
    let pceLignes = []; // tableau de tableaux qui va contenir les tableaux suivants, càd les listes de pièces chargées, proposées et autres
    let pcesLoaded =[];
    let pcesProp = [];
    let pcesOther = [];
    try {
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
              "Authorization": 'Bearer '+token,
              "appliname": appliname,
              "fingerprint": fingerprint,
              },
            }
          );
        
        if (response.data.message === "> ok") {
          signalToGo = true;
        }
        i++;
      }
      let pcesDuBc;
      if (signalToGo === true) {
        pcesDuBc = await axios.get(
          "https://back-xxx.monkey-soft.fr:54443/bcweb/pcesdubc/"+bc_number,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Authorization": token,
              "appliname": appliname,
              "fingerprint": fingerprint,
            },
          }
        );

        pcesDuBc.data.results.forEach((element, index, array) => {
          if (element.pce_charge === true) {
            pcesLoaded.push(element);
          } else if (element.pce_prop_charge === true) {
            pcesProp.push(element);
          } else {
            pcesOther.push(element);
          }
        });

        while (pcesDuBc.data.next !== null) {
          pcesDuBc = await axios.get(
            pcesDuBc.data.next,
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": token,
                "appliname": appliname,
                "fingerprint": fingerprint,
                },
              }
          );
          pcesDuBc.data.results.forEach((element, index, array) => {
            if (element.pce_charge === true) {
              pcesLoaded.push(element);
            } else if (element.pce_prop_charge === true) {
              pcesProp.push(element);
            } else {
              pcesOther.push(element);
            }
          });
        }
      /* on pousse chaque tableau dans le tableau collecteur pceLignes */
      pceLignes.push(pcesLoaded);
      pceLignes.push(pcesProp);
      pceLignes.push(pcesOther);
      return pceLignes;
      }


    } catch (error) {
      console.log('error : '+error);
    }
    //console.log('data : '+JSON.stringify(data));
    console.log('error : '+error);
    return ("");
  };
 
  /* version atomique de la fonction qui permet de checker une commande > ok en provenance de wib*/
  const checkOK = async () => {
    try {
      let i = 0;
      let signalToGo = false;
      let response ="";
      while ((i < NB_ITER) && (signalToGo==false)) {
        await new Promise(resolve => setTimeout(resolve,DELAY_N_SECONDS));
          response = await axios.post(
          endpointCheckok,
          JSON.stringify({
            "username": username,
            }),
            {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Authorization": 'Bearer '+token,
              "appliname": appliname,
              "fingerprint": fingerprint,
              },
            }
          );
        
        if (response.data.message === "> ok") {
          signalToGo = true;
        }
        i++;
      }
      if (signalToGo === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('error : '+error);
      return false
    }
  };

  const handleActuConfirm = async () => {
    console.log("Updated");

    let body = {"username":username};
    let result = await axios.post(
      "https://back-xxx.monkey-soft.fr:54443/bcweb/actualiser/",
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": "Bearer "+token,
          "appliname": appliname,
          "fingerprint": fingerprint,
        },
      }
    );
    let acquittement;
    if (result.data.message === "ok") {
      acquittement = await checkOK();
    }
    let msg;
    if (acquittement) {
      msg = "L'actualisation des BC s'est bien déroulée"
    } else {
      msg = "L'actualisation des BC ne s'est pas déroulée normalement. Veuillez réessayer ultérieurement"
    }
    dispatch(defineMessage(msg));
    setModalActualiserVisible(false);
    setRefresh(refresh + 1);
  };
 
  const handleActuCancel = () => {
    // Handle the cancel action here
    console.log('Cancelled');
    setModalActualiserVisible(false);
  };

  return (
    <ScrollView>
      <Text>--------</Text>
      <Text>Sélectionner un BC</Text>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <SafeAreaView>
          <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
            <Text>{isOpen ? "Fermer la liste" : "Ouvrir la liste"}</Text>
          </TouchableOpacity>
          {isOpen &&
            data.map((bc, index) => (
              <TouchableOpacity onPress={() => defineBc(bc)} key={index}>
                <Text>{bc.bc_num} | {bc.bc_statut}</Text>
              </TouchableOpacity>
            ))}
        </SafeAreaView>
      )}

      <Text>--------</Text>
      <Text>--------</Text>

      <Text>Réinitialiser un BC</Text>  
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <SafeAreaView> 
          <TouchableOpacity onPress={() => setIsReinitOpen(!isReinitOpen)}>
            <Text>{isReinitOpen ? "Fermer la liste" : "Ouvrir la liste"}</Text>
          </TouchableOpacity>
          { isReinitOpen &&
            data.map((BC, idx) => (
              <SafeAreaView>
                <TouchableOpacity onPress={() => {setModalVisible(true); setCurrentBC(BC);}} key={idx}>
                <Text>{BC.bc_num} | {BC.bc_statut}</Text>
                </TouchableOpacity>
              </SafeAreaView>
            ))
          }
          { modalVisible &&
              <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleCancel}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                      <Text>{currentBC.bc_num}</Text>
                      <Text>ATTENTION, en réinitialisant le BC, vous perdrez toutes les données non validées.
                        Réinitialiser un BC revient à le récupérer tel qu'il se trouve actuellement dans l'application BTSystem - BTLivraison.
                      </Text>
                      <Button title="Confirm" onPress={() => {handleConfirm(currentBC)}} />
                      <Button title="Cancel" onPress={handleCancel}/>
                </View>
              </View>
            </Modal>
          }
            
        </SafeAreaView>
        
      )} 
      <Button title="Actualiser" onPress={() => {setModalActualiserVisible(true);}} />
      { modalActualiserVisible &&
              <Modal
              animationType="slide"
              transparent={true}
              visible={modalActualiserVisible}
              onRequestClose={handleActuCancel}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                      <Text>ACTUALISER</Text>
                      <Text>Voulez-vous actualiser la liste de tous les bons de chargement dont le statut n'est pas "en cours" ? 
                         NB : pour retirer le statut "en cours" d'un bon de chargement vous devez le réinitialiser ou le valider.
                      </Text>
                      <Button title="Confirm" onPress={handleActuConfirm} />
                      <Button title="Cancel" onPress={handleActuCancel}/>
                </View>
              </View>
            </Modal>
      }
      <Button title="refresh" onPress={goRefresh} />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default BcList;