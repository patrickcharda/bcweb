import {
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Button,
  Alert,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { changeAccQte, changeAccObservBc, changeLoadAcc } from "../redux/actions";
import * as React from "react";



const BcAcc = ( {accessoire, loaded} ) => {

  let acc = accessoire;
  let accJson = JSON.stringify(acc);
  const dispatch = useDispatch();
  let observ = acc.pdt_observ_bc;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [text, setText] = React.useState(observ);
  const [qte, setQte] = React.useState(acc.pdt_qte);

  const handleConfirm = (id) => {
    // Handle the confirm action here
    console.log('Confirmed:', text);
    let obj = {'id': id, 'observ': text}
    dispatch(changeAccObservBc(obj));
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Handle the cancel action here
    console.log('Cancelled');
    setModalVisible(false);
  };

  const increment = (id, charge) => {
    let newQte = qte + 1;
    setQte(newQte);
    let obj = {'id':id,'charge':charge,'qte':newQte};
    dispatch(changeAccQte(obj));
  }

  const decrement = (id, charge) => {
    if (qte >= 1) {
    let newQte = qte - 1;
    setQte(newQte);
    let obj = {'id':id,'charge':charge,'qte':newQte};
    dispatch(changeAccQte(obj));
    }
  }

  return (
    <ScrollView style={styles.container}>
        <View></View>
        <SafeAreaView>
          <Text>{acc.id}</Text>
          <Text>{accJson}</Text>
          <SafeAreaView>
            <Text>{acc.pdt_libel}</Text>
            <View style={styles.centeredView}>
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
                      <Button title="Confirm" onPress={() => handleConfirm(acc.id)} />
                      <Button title="Cancel" onPress={handleCancel} />
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
            </View>
            <View>
              <Button title="+" onPress={() => increment(acc.id, acc.pdt_charge)} /><Text>{qte}</Text><Button title="-" onPress={() => decrement(acc.id, acc.pdt_charge)} />
            </View>
          </SafeAreaView>
          <Button
          title={loaded ? "Unload" : "Load"} onPress={() => dispatch(changeLoadAcc(acc.id))}
          ></Button>
          <Text></Text>
        </SafeAreaView>
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

export default BcAcc;
