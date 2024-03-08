import BcHeader from "./BcHeader";
import BcPce from "./BcPce";
//import BcAcc from "./BcAcc";
//import BcFooter from ".BcFooter";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePceDate, changePceLoadedDate, changePcePropDate, changePceOtherDate, loadFullPcesTab, loadLoadedPcesTab, loadPropPcesTab, loadOtherPcesTab, loadLoadedAccs, loadPropAccs } from "../redux/actions";
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import * as Device from "expo-device";
import * as Application from "expo-application";
import axios from "axios";

const appliname = "bcweb";
const fingerprint =
  Application.getAndroidId().toString() +
  Application.nativeBuildVersion +
  Device.deviceYearClass.toString();


const Bc = ({ tabPces }) => {
  const token = useSelector((state) => state.tokenReducer.token);
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = React.useState(false); //booleen pr affichage/masquage entête BC
  const [isLoadListOpen, setIsLoadListOpen] = React.useState(true);
  const [isPropListOpen, setIsPropListOpen] = React.useState(true);
  const [isOtherListOpen, setIsOtherListOpen] = React.useState(true);

  const bonChargement = useSelector((state) => state.bcReducer.bc);

  /* recupération des listes de pièces du state */
  const pces = useSelector((state) => state.pcesAccsReducer.pces);
  const pcesLoaded = useSelector((state) => state.pcesAccsReducer.pcesLoaded);
  const pcesProp = useSelector((state) => state.pcesAccsReducer.pcesProp);
  const pcesOther = useSelector((state) => state.pcesAccsReducer.pcesOther);

  /* récupération des produits du state */
  //console.log("PDTS BON DE CHARGEMENT :"+bonChargement.produits[0]);
  //console.log("PDTS BON DE CHARGEMENT LENGTH:"+bonChargement.produits.length);
  const accs = useSelector((state) => state.pcesAccsReducer.accs);
  const accsLoaded = useSelector((state) => state.pcesAccsReducer.accsLoaded);
  const accsProp = useSelector((state) => state.pcesAccsReducer.accsProp);

  const BASE_URL = "https://back-xxx.monkey-soft.fr:54443";
  const URL_SLICER_NB_CHAR = BASE_URL.length + 11;

  let piecesLoaded = [];
  let piecesProp = [];
  let piecesOther = [];;

  /* tabPces est le tableau de tableaux des différentes catégories de pièces (loaded, prop, other); ce tableau est en RAM;
  il va servir à afficher les pièces immédiatement (donc le BC), avant que les pièces soient stockées dans le state, en ROM donc */
  if (pces.length === 0 && tabPces != undefined && Array.isArray(tabPces) && tabPces.length > 0) { // au 1er chargement du Bc, lorsqu'il n'est pas déjà ds le state
    piecesLoaded = tabPces[0];
    piecesProp = tabPces[1];
    piecesOther = tabPces[2];
  } else if (tabPces != undefined && Array.isArray(tabPces) && tabPces.length > 0) { // le state pces n'est pas vide, on va l'utiliser
    piecesLoaded = pcesLoaded;
    piecesProp = pcesProp;
    piecesOther = pcesOther;
  }

  /*  pour optimiser l'affichage le calcul du poids et du nombre de pièces chargées sera fait une fois les listes affichées, le state étant alors seulement mis à jour à ce moment là;
  ce calcul se base sur le state et non les listes en RAM */
  let nbPcesChargees = pcesLoaded.length;
  let poids = 0;
  if (pcesLoaded.length > 0) {
    pcesLoaded.map((pce) => (poids += parseFloat(pce.pce_poids)));
  }

  // on stocke une référence au tableau de tableaux des pièces pour pouvoir l'appeler via useEffect une fois le composant rendered
  let refTabPces = React.useRef(tabPces);

  /* ce hook se charge avec la référence au tableau de tableaux de pièces pour alimenter le state;
     le hook intervient après le rendu du composant */
  React.useEffect(() => {
    let newPcesLoaded = [];
    let newPcesProp = [];
    let newPcesOther = [];
    newPcesLoaded = refTabPces.current[0];
    newPcesProp = refTabPces.current[1];
    newPcesOther = refTabPces.current[2];
    dispatch(loadLoadedPcesTab(newPcesLoaded));
    dispatch(loadPropPcesTab(newPcesProp));
    dispatch(loadOtherPcesTab(newPcesOther));
    let fullPcesTab = newPcesLoaded.concat(newPcesProp, newPcesOther);
    dispatch(loadFullPcesTab(fullPcesTab));
  }, []);

  

  /* ce hook permet de récupérer les éventuels accessoires*/
  React.useEffect(() => {
    const getAcc = async (acc_id) => {
      console.log(acc_id);
      console.log(token);
      console.log(fingerprint);
      console.log(appliname);
      let produit;
      try {
        produit = await axios.get(
          "https://back-xxx.monkey-soft.fr:54443/bcweb/pdt/"+acc_id,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Authorization": "Bearer " + token,
              "fingerprint": fingerprint,
              "appliname": appliname,
            },
          }
        );
        
      } catch (error) {
        console.error("Error fetching data: ", error);
        // handle error appropriately
      }
      console.log(produit);
      return produit.data;
    }
    const fetchAccessories = async () => {
      
      if (bonChargement.produits !== undefined && bonChargement.produits.length > 0) {
        let pdtsLoaded = [];
        let pdtsProp = [];
        let acc_id;
        //let endPointAcc;
        let accessoire;
        for (let i = 0; i < bonChargement.produits.length; i++) {
          acc_id = bonChargement.produits[i];
          acc_id = acc_id.slice(URL_SLICER_NB_CHAR, acc_id.length);
          console.log("accessoire id : " + acc_id);
          //endPointAcc = "https://back-xxx.monkey-soft.fr:54443/bcweb/pdt/"+acc_id;
          accessoire = await getAcc(acc_id);
          console.log(accessoire);
          if (accessoire.pdt_charge) {
            pdtsLoaded.push(accessoire);
          } else {
            pdtsProp.push(accessoire);
          }
        }
        /* passer les accessoires dans le state */
        dispatch(loadLoadedAccs(pdtsLoaded));
        dispatch(loadPropAccs(pdtsProp));
      }
    };
    fetchAccessories();
  }, []);


  /* fct enregistrement d'un bon de chargement   */
  const recordBc = () => {
    /*
    Pour économiser de la bande passante et de la charge, on ne se base que sur le tableau pces chargées du state pour executer les appels api de mise à jour de la base de données 
    Le traitement se fait toujours par lots, mais il y a moins de données (pièces) à traiter
    */

    /* mise à jour du champ date pour horodater l'enreg ds la bdd (champs pce_date_web) */
    //console.log("TOUTES PIECES "+pces);
    pces.map(pce => dispatch(changePceDate(pce)));
    //console.log("PIECES CHARGEES "+pcesLoaded);
    pcesLoaded.map(pce => dispatch(changePceLoadedDate(pce)));
    pcesProp.map(pce => dispatch(changePcePropDate(pce)));
    pcesOther.map(pce => dispatch(changePceOtherDate(pce)));

    // Tronçonner le tableau des pièces en tableaux de 500 pièces
    let sliced_tabs = []; // tableau de tableaux tronçons de 500 pièces
    for (let i = 0; i < pces.length; i += 500) {
      let chunk = pces.slice(i, i + 500);
      sliced_tabs.push(chunk);
    }

    //màj les pces ds la bdd, tronçon de 500 par tronçon de 500
    for (let j = 0; j < sliced_tabs.length; j++) {
      patch(sliced_tabs[j]);
    }
  };

  /* fct enregistrement d'un ensemble/lot/bloc/tableau/tronçon de pièces   */
  const patch = async (tabDePces) => {
    let endpointPcesToPatch =
      "https://back-xxx.monkey-soft.fr:54443/bcweb/pcestopatch/";
    await axios.patch(
      endpointPcesToPatch,
      tabDePces,
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: token,
          appliname: appliname,
          fingerprint: fingerprint,
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollable_View}>
        <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
          <Text>
            {isOpened
              ? "Masquer détails BC n° " + bonChargement.bc_num
              : "Voir détails BC n° " + bonChargement.bc_num}
          </Text>
          <Text>
            {nbPcesChargees == 0
              ? "aucune pièce chargée"
              : nbPcesChargees === 1
              ? nbPcesChargees + " pièce chargée"
              : nbPcesChargees + " pièces chargées "}
          </Text>
          <Text>{poids + " T"}</Text>
        </TouchableOpacity>
        {isOpened && <BcHeader bc={bonChargement} />}
      </ScrollView>
      <ScrollView styles={styles.scrollableView2}>
        <TouchableOpacity onPress = {()=>{setIsLoadListOpen(!isLoadListOpen)}}>
          <Text style={styles.text1}> {isLoadListOpen?"Masquer Pièces Chargées":"Voir Pièces chargées"} </Text>
        </TouchableOpacity>
        {isLoadListOpen &&
           piecesLoaded.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={true} />
        ))}
        <TouchableOpacity onPress = {()=>{setIsPropListOpen(!isPropListOpen)}}>
          <Text style={styles.text2}> {isPropListOpen?"Masquer Pièces Proposées":"Voir Pièces Proposées"} </Text>
        </TouchableOpacity>
        {isPropListOpen &&
           piecesProp.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={false} />
        ))}
        <TouchableOpacity onPress = {()=>{setIsOtherListOpen(!isOtherListOpen)}}>
        <Text style={styles.text3}> {isOtherListOpen?"Masquer Pièces Autres":"Voir Pièces Autres"} </Text>
        </TouchableOpacity>
        {isOtherListOpen && 
           piecesOther.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={false} />
        ))}
        <Text>{"\n\n"}</Text>
        <Button onPress={() => recordBc()} title="Enregistrer"></Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableView1: {
    flex: 0.7,
  },
  scrollableView2: {
    flex: 0.3,
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
  text1: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text2: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text3: {
    color: "grey",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Bc;