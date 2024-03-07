import BcHeader from "./BcHeader";
import BcPce from "./BcPce";
//import BcAcc from "./BcAcc";
//import BcFooter from ".BcFooter";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePceDate, changePceLoadedDate, changePcePropDate, changePceOtherDate, loadFullPcesTab, loadLoadedPcesTab, loadPropPcesTab, loadOtherPcesTab } from "../redux/actions";
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

/* const Bc = () => {
  const token = useSelector((state) => state.tokenReducer.token);
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = React.useState(false);

  const bonChargement = useSelector((state) => state.bcReducer.bc);
  const pces = useSelector((state) => state.pcesAccsReducer.pces);
  const pcesLoaded = useSelector((state) => state.pcesAccsReducer.pcesLoaded);
  const pcesProp = useSelector((state) => state.pcesAccsReducer.pcesProp);
  const pcesOther = useSelector((state) => state.pcesAccsReducer.pcesOther);

  let nbPcesChargees = pcesLoaded.length;
  let poids = 0;
  if (pcesLoaded.length > 0) {
    pcesLoaded.map((pce) => (poids += parseFloat(pce.pce_poids)));
  }
  const recordBc = () => {
    /*
    Pour économiser de la bande passante et de la charge, on ne se base que sur le tableau pces chargées du state pour executer les appels api de mise à jour de la base de données 
    Le traitement se fait toujours par lots, mais il y a moins de données (pièces) à traiter
    */

    /* //mise à jour du champ date pour horodater l'enreg ds la bdd (champs pce_date_web) 
    //console.log("TOUTES PIECES "+pces);
    pces.map(pce => dispatch(changePceDate(pce)));
    //console.log("PIECES CHARGEES "+pcesLoaded);
    pcesLoaded.map(pce => dispatch(changePceLoadedDate(pce)));
    pcesProp.map(pce => dispatch(changePcePropDate(pce)));
    pcesOther.map(pce => dispatch(changePceOtherDate(pce)));

    // Tronçonner le tableau des pièces
    let sliced_tab = []; // tableau de tableaux tronçons
    for (let i = 0; i < pces.length; i += 50) {
      let chunk = pces.slice(i, i + 50);
      sliced_tab.push(chunk);
    }

    //màj les pces ds la bdd
    for (let j = 0; j < sliced_tab.length; j++) {
      //console.log(JSON.stringify(sliced_tab[j]));
      //console.log("SLICED TAB "+sliced_tab[j]);
      patch(sliced_tab[j]);
    }
  };

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
        <Text style={styles.text1}>Pièces Chargées</Text>
        {pcesLoaded.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={true} />
        ))}
        <Text style={styles.text2}>Pièces Proposées</Text>
        {pcesProp.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={false} />
        ))}
        <Text style={styles.text3}>Pièces Autres</Text>
        {pcesOther.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={false} />
        ))}
        <Text>{"\n\n"}</Text>
        <Button onPress={() => recordBc()} title="Enregistrer"></Button>
      </ScrollView>
    </View>
  );
}; */

const Bc = ({ tabPces }) => {
  let newTabPces = tabPces;
  const token = useSelector((state) => state.tokenReducer.token);
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = React.useState(false);

  const bonChargement = useSelector((state) => state.bcReducer.bc);
  // recupération des listes de pièces du state
  const pces = useSelector((state) => state.pcesAccsReducer.pces);
  const pcesLoaded = useSelector((state) => state.pcesAccsReducer.pcesLoaded);
  const pcesProp = useSelector((state) => state.pcesAccsReducer.pcesProp);
  const pcesOther = useSelector((state) => state.pcesAccsReducer.pcesOther);


  let piecesLoaded = [];
  let piecesProp = [];
  let piecesOther = [];;

  /* tabPces est le tableau de tableaux des différentes catégories de pièces (loaded, prop, other); ce tableau est en RAM;
     il va servir à afficher les pièces immédiatement (donc le BC), avant que les pièces soient stockées dans le state, en ROM donc */
  if (tabPces != undefined && Array.isArray(tabPces) && tabPces.length > 0) {
    piecesLoaded = tabPces[0];
    piecesProp = tabPces[1];
    piecesOther = tabPces[2];
  }

  let nbPcesChargees = pcesLoaded.length;
  let poids = 0;
  if (pcesLoaded.length > 0) {
    pcesLoaded.map((pce) => (poids += parseFloat(pce.pce_poids)));
  }

  // on stocke une référence au tableau de tableaux des pièces pour pouvoir l'appeler via useEffect une fois le composant rendered
  let refTabPces = React.useRef(newTabPces);

  /* ce hook se charge à partir de la référence au tableau de tableaux de pièces d'alimenter le state;
     il intervient après le rendu du composant */
  React.useEffect(() => {
    let newPcesLoaded = [];
    let newPcesProp = [];
    let newPcesOther = [];
    newPcesLoaded = refTabPces.current[0];
    newPcesProp = refTabPces.current[1];
    newPcesOther = refTabPces.current[2];
    dispatch(loadLoadedPcesTab(newPcesLoaded));
    dispatch(loadPropPcesTab(newPcesProp));
    dispatch(loadOtherPcesTab(pcesOther));
    let fullPcesTab = newPcesLoaded.concat(newPcesProp, newPcesOther);
    dispatch(loadFullPcesTab(fullPcesTab));
  }, []);

  /* enregistrement d'un bon de chargement   */
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

  /* enregistrement d'un ensemble/lot/bloc/tableau/tronçon de pièces   */
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
        <Text style={styles.text1}>Pièces Chargées</Text>
        {pcesLoaded.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={true} />
        ))}
        <Text style={styles.text2}>Pièces Proposées</Text>
        {pcesProp.map((piece) => (
          <BcPce key={piece.id} piece={piece} loaded={false} />
        ))}
        <Text style={styles.text3}>Pièces Autres</Text>
        {pcesOther.map((piece) => (
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