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
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { changePceLoadedStatus, changePceObservBc } from "../redux/actions";
import * as React from "react";


const BcPce = ( {piece, loaded} ) => {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [text, setText] = React.useState(piece.pce_observ_bc);
  const [isOpened, setIsOpened] = React.useState(false);

  const isActionBeingExecuted = useSelector((state) => state.tokenReducer.isActionBeingPerformed);

  const handleConfirm = () => {
    // Handle the confirm action here
    console.log('Confirmed:', text);
    let data = {
      "piece": piece,
      "texte": text,
    }
    dispatch(changePceObservBc(data));
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Handle the cancel action here
    console.log('Cancelled');
    setModalVisible(false);
  };

  const pieceJson = JSON.stringify(piece)
  let pce = piece;
  const dispatch = useDispatch();

  //const archive = "<TextInput placeholder={pce.pce_observ_bc}></TextInput>";

  return (
    isActionBeingExecuted ? <ActivityIndicator color="red" size="large" /> : 
    <ScrollView style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            <Pressable onPress={() => setIsOpened(!isOpened)} >
              <Text>{isOpened? piece.pce_num : piece.pce_num}</Text>
            </Pressable>
            {isOpened && <Text>{pieceJson}</Text>}
          </ScrollView>
          <SafeAreaView>
            {/* <Text>{pce.pce_observ_bc}</Text> */}
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
                      <Button title="Confirm" onPress={handleConfirm} />
                      <Button title="Cancel" onPress={handleCancel} />
                    </ScrollView>
                  </View>
                </View>
              </Modal>
              <Button
                title="Editer observation pièce"
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
          </SafeAreaView>
          <Button
          title={loaded ? "Unload" : "Load"}
          onPress={() => dispatch(changePceLoadedStatus(pce))}></Button>
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

export default BcPce;
