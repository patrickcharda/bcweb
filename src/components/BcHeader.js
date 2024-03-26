import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { recordSelectedBc } from "../redux/actions";

const BcHeader = ({ currentBc }) => {

  let bc = currentBc;
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [text, setText] = React.useState(bc.bc_observ);

  const handleConfirm = (bc) => {
    // Handle the confirm action here
    console.log('OBSERVATIONS BC ', text);
    const updatedBc = { ...bc, bc_observ: text };
    dispatch(recordSelectedBc(updatedBc));
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Handle the cancel action here
    console.log('Cancelled');
    setModalVisible(false);
  };

  const hasNullValue = (field) => {
    if (field === null) {
      console.log("THE VALUE IS NULL");
      return true;
    }
    return false;
  }

  const strToDate= (strDate) => {
    /* let newDate = new Date(strDate);
    let newStrFormatedDate = newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear();
    return newStrFormatedDate; */
    var newDate = new Date(strDate);
    var dd = String(newDate.getDate()).padStart(2, '0');
    var mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = newDate.getFullYear();

    var hh = String(newDate.getHours()).padStart(2, '0');
    var min = String(newDate.getMinutes()).padStart(2, '0');
    var ss = String(newDate.getSeconds()).padStart(2, '0');

    newDate = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ':' + ss;
    return newDate;
  }

  return (

        <SafeAreaView>
            <Text>{'\n'}</Text>
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>{"BC n° "+bc.bc_num}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_num_affaire)?"N° Aff: " : "N° Aff: "+bc.bc_num_affaire}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_client)?"Client: " : "Client: "+bc.bc_client}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_chantier)?"Chantier: " : "Chantier: "+bc.bc_chantier}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_ville_livraison)?"Livraison: " : "Livraison: "+bc.bc_ville_livraison}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_date_chargement_prev)?"Date Chargt prev: " : "Date Chargt prev: "+strToDate(bc.bc_date_chargement_prev).substring(0, 10)}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_date_livraison_prev)?"Date Livr prev: " : "Date Livr prev: "+strToDate(bc.bc_date_livraison_prev).substring(0, 10)}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_transporteur)?"Transporteur: " : "Transporteur: "+bc.bc_transporteur}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_statut)?"Statut: " : "Statut: "+bc.bc_statut}</Text>
            <Text style={{fontsize: 25, fontWeight: 'bold'}}>{hasNullValue(bc.bc_observ)? "Observations: " : "Observations: "+bc.bc_observ}</Text>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ScrollView>
                      <TextInput
                        style={{ height: 120, borderColor: 'gray', borderWidth: 1, textAlignVertical: 'top', textAlign: 'left' }}
                        onChangeText={setText}
                        value={text}
                        placeholder='Saisissez le texte ici'
                        multiline
                      />
                      <Button title="Confirm" onPress={() => {handleConfirm(bc)}} />
                      <Button title="Cancel" onPress={() => handleCancel()} />
                    </ScrollView>
                  </View>
                </View>
              </Modal>
              <Button
                title="Show Modal - Edition"
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            <Text></Text>
        </SafeAreaView>
    
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

export default BcHeader;
