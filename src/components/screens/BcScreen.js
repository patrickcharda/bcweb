//import { CommonActions } from '@react-navigation/native';
import Bc from '../Bc';
import LogoutButton from "../LogoutButton";
import { SafeAreaView, StyleSheet, BackHandler, Button } from "react-native";

const BcScreen = ({ navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LogoutButton />
      <Bc/>
      <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text2: {
    color: 'blue',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text3: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BcScreen;
