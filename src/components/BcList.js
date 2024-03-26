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
  Pressable,
} from "react-native";
import apiCall from "../redux/apiCall";
import axios from 'axios';
import { recordSelectedBc, purgePcesAccs, fetchPceSuccess, loadFullPcesTab, loadLoadedPcesTab, loadPropPcesTab, loadOtherPcesTab,
defineMessage, apiEmptyData, purgeBc, defineError, defineErrormsg, defineMsg, cleanAllMessagesErrors, actionInProgress } from "../redux/actions";
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
  const err = useSelector((state) => state.apiReducer.error);
  const [isActionBeingPerformed, setIsActionBeingPerformed] = React.useState(false);

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
    try {
      setIsActionBeingPerformed(true); // pour contrôler l'affiche des "pressable" lorsqu'une action est en cours
      dispatch(actionInProgress(true)); // pour contrôler l'affichage du composant BcListScreen lorsqu'une action est en cours
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
    } catch (error) {
      console.log("erreur dans la fonction defineBc de BcList ", error)
      dispatch(defineErrormsg("erreur dans la fonction defineBc de BcList "+error))
      dispatch(defineMsg(""));
    } finally {
      setIsActionBeingPerformed(false);
      dispatch(actionInProgress(false));
    }
  };

  const reinit = async (selectedBC) => {
    try {
      setIsActionBeingPerformed(true); // pour contrôler l'affichage des "pressable" lorsqu'une action est en cours
      dispatch(actionInProgress(true)); // pour contrôler l'affichage du composant BcListScreen lorsqu'une action est en cours
      let bc_num = selectedBC.bc_num;
      let msg = "BC en vours de réinitialisation : "+bc_num;
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
    } catch (error) {
        console.log("erreur dans la fonction reinit de BcList ", error)
        dispatch(defineErrormsg("erreur dans la fonction reinit de BcList "+error))
        dispatch(defineMsg(""));
    } finally {
      setIsActionBeingPerformed(false);
      dispatch(actionInProgress(false));
    }
  }

  const reinitialiser = async(token, appliname, fingerprint, body) => {
    let fermer=false;
    try {
      fermer = await axios.post(
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
    } catch {
      console.log("erreur dans la fonction reinitialiser de BcList ", error)
      dispatch(defineErrormsg("erreur dans la fonction reinitialiser de BcList "+error))
      dispatch(defineMsg(""));
    }
    finally {
      return fermer;
    }
  }

  const goRefresh = () => {
    dispatch(cleanAllMessagesErrors());
    setRefresh(refresh + 1);
  }
  
  const ouvrir = async (token, username, bc_num ) => {   
    let tab = [];
    tab.push(username);
    tab.push(bc_num); 
    let result="false";
    try {
      /* qd  un bl est sélectionné ds la liste déroulante, envoi cmde ouvrir pour mettre en pause pdt chargement des données */
      if (bc_num != "") {
          dispatch(apiCall("https://back-xxx.monkey-soft.fr:54443/bcweb/ouvrir/", token, tab));
          if (err !=="") {
            result = true;
          }
      }
    } catch (error) {
      dispatch(defineError("Problème commande 'ouvrir'"));
    } finally {
      return result;
    }
  }

  const handleConfirm = (currentBC) => {
    // Handle the confirm action here
    //console.log("CURRENT BC "+currentBC);
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
      console.log('error : '+ error);
      console.log("erreur dans la fonction checkok de BcList ", error)
      dispatch(defineErrormsg("erreur dans la fonction checkok de BcList "+error))
      dispatch(defineMsg(""));
    }
  };
 
  /* version atomique de la fonction qui permet de checker une commande : "> ok" en provenance de wib ? */
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
      console.log("erreur dans la fonction checkOK de BcList ", error)
      dispatch(defineErrormsg("erreur dans la fonction checkOK de BcList "+error))
      dispatch(defineMsg(""));
      return false
    }
  };

  const handleActuConfirm = async () => {
    await actualiser();
  };

  const actualiser = async() => {
    //console.log("Updated");
    setModalActualiserVisible(false);
    setIsActionBeingPerformed(true);
    dispatch(actionInProgress(true));
    let body = {"username":username};
    try {
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
    
    } catch (error) {
      console.log("erreur dans la fonction actualiser de BcList ", error)
      dispatch(defineErrormsg("erreur dans la fonction actualiser de BcList "+error))
      dispatch(defineMsg(""));
    }
    finally {
      setIsActionBeingPerformed(false);
      dispatch(actionInProgress(false));
      setRefresh(refresh + 1);
    }
  }
 
  const handleActuCancel = () => {
    // Handle the cancel action here
    console.log('Cancelled');
    setModalActualiserVisible(false);
  };

  return (
    isActionBeingPerformed ? <ActivityIndicator color="red" size="large" /> : 
    <ScrollView>
      <Text>--------</Text>
      <Text>Sélectionner un BC</Text>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <SafeAreaView>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Text>{isOpen ? "Fermer la liste" : "Ouvrir la liste"}</Text>
          </Pressable>
          {isOpen &&
            data.map((bc, index) => (
              <Pressable onPress={isActionBeingPerformed ? null : () => defineBc(bc)} key={index} disabled={isActionBeingPerformed}>
                <Text>{bc.bc_num} | {bc.bc_statut} | nb pièces : {bc.pieces.length}</Text>
              </Pressable>
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
          <Pressable onPress={() => setIsReinitOpen(!isReinitOpen)}>
            <Text>{isReinitOpen ? "Fermer la liste" : "Ouvrir la liste"}</Text>
          </Pressable>
          { isReinitOpen &&
            data.map((BC, idx) => (
              <SafeAreaView>
                <Pressable onPress={() => {setModalVisible(true); setCurrentBC(BC);}} key={idx}>
                <Text>{BC.bc_num} | {BC.bc_statut} | nb pièces : {BC.pieces.length}</Text>
                </Pressable>
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
                      <Pressable onPress={() => {handleConfirm(currentBC)}}>
                        <Text>Confirm</Text>
                      </Pressable>
                      <Pressable onPress={handleCancel}>
                        <Text>Cancel</Text>
                      </Pressable>
                </View>
              </View>
            </Modal>
          }
            
        </SafeAreaView>
        
      )} 
      <Text>--------</Text>
      <Text>--------</Text>
      <Pressable onPress={() => {setModalActualiserVisible(true);}} >
        <Text>Actualiser</Text>
      </Pressable>
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
                      <Pressable onPress={() => {handleActuConfirm(true)}}>
                        <Text>Confirm</Text>
                      </Pressable>
                      <Pressable onPress={handleActuCancel}>
                        <Text>Cancel</Text>
                      </Pressable>
                </View>
              </View>
            </Modal>
      }
      <Pressable onPress={goRefresh}>
        <Text>Refresh</Text>
      </Pressable>
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