import BcHeader from "./BcHeader";
import BcPce from "./BcPce";
//import BcAcc from "./BcAcc";
//import BcFooter from ".BcFooter";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";



const Bc = () => {

  const [isOpened, setIsOpened] = React.useState(false);

  const bonChargement = useSelector((state) => state.bcReducer.bc);
  const pces = useSelector((state) => state.pcesAccsReducer.pces);
  const pcesLoaded = useSelector((state) => state.pcesAccsReducer.pcesLoaded);

  let nbPcesChargees = pcesLoaded.length;
  let poids = 0;
  pcesLoaded.map((pce) => 
  poids += parseFloat(pce.pce_poids)
  )

  return (
    <ScrollView>
        <SafeAreaView>
          <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
            <Text>{isOpened ? "Masquer détails BC n° "+bonChargement.bc_num  : "Voir détails BC n° "+bonChargement.bc_num}</Text>
            <Text>{ nbPcesChargees ==  0 ? "aucune pièce chargée" : nbPcesChargees === 1 ? nbPcesChargees + " pièce chargée" : nbPcesChargees +" pièces chargées "}</Text>
            <Text>{poids + " T"}</Text>
          </TouchableOpacity>
          {isOpened &&
            <BcHeader bc={bonChargement}/>
          }
          <Text></Text>
          {pces.map((piece) => (
                <BcPce key={piece.id} piece={piece}/>
            ))
          }
        </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerBc: {
    flex: 1,
    backgroundColor: "#3498db",
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

export default Bc;
