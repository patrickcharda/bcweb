import * as React from "react";
import {
  View,
  StyleSheet,
} from 'react-native';
import LoginScreen from "./screens/LoginScreen";
import BcListScreen from "./screens/BcListScreen";
//import Message from "./Message";
import { useSelector } from "react-redux";  
import { createNativeStackNavigator } from '@react-navigation/native-stack';


/* const endpointBc = "https://demo-btw.monkey-soft.fr/bcweb/bcx/";
const endpointRefreshToken = "https://demo-btw.monkey-soft.fr/refresh-token/"; */

const Stack = createNativeStackNavigator();

const Main = () => {
  const logged = useSelector((state) => state.tokenReducer.isLogged);
  //const token = useSelector((state) => state.tokenReducer.token);
  //const dispatch = useDispatch();
  

  /* let retrievedStoreStr = await AsyncStorage.getItem('persist:root'); // this is a string
  console.log(retrievedStoreStr); */
  //let retrievedStore = JSON.parse(retrievedStoreStr); // this will be a JSON object
  //let reducer1 = retrievedStore.reducer1; // should now have your reducer
  

/*   return (
    <Stack.Navigator>
      <View style={styles.container}>
        <Message/>
        { logged ? <Stack.Screen name="BcList" component={BcListScreen} options={{ title: 'Login' }}/> : <Stack.Screen name="Login" component={LoginScreen} />}
      </View>
    </Stack.Navigator>
  ); */

  return (

      <Stack.Navigator>

          { logged ? <Stack.Screen name="BcList" component={BcListScreen} options={{ title: 'Liste des Bons de chargement' }}/> : <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }}/>}

      </Stack.Navigator>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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

export default Main;
