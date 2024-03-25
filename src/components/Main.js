import * as React from "react";
import {
  View,
  StyleSheet,
  Button,
  Pressable,
  Text,
  Image,
} from 'react-native';
import LoginScreen from "./screens/LoginScreen";
import BcListScreen from "./screens/BcListScreen";
import BcScreen from "./screens/BcScreen";
import ShootSessionScreen from "./screens/ShootSessionScreen";
//import Message from "./Message";
//import { signout, purgePcesAccs } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";  
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { useEffect } from 'react';

/* const endpointBc = "https://demo-btw.monkey-soft.fr/bcweb/bcx/";
const endpointRefreshToken = "https://demo-btw.monkey-soft.fr/refresh-token/"; */

const Stack = createNativeStackNavigator();

const Main = () => {
  const logged = useSelector((state) => state.tokenReducer.isLogged);
  //const token = useSelector((state) => state.tokenReducer.token);
  const dispatch = useDispatch();
  
  /* useEffect(() => {
    dispatch(signout());
    dispatch(purgePcesAccs());
  }, [dispatch]); */


  return (

    <Stack.Navigator>
    {logged ? 
      [<Stack.Screen
        name="BcList"
        component={BcListScreen}
        options={{
          title: "Bons de chargement",
          headerStyle: {
            backgroundColor: '#0000b3',
          },
          headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                {/* <View style={{ flexGrow:0.5, justifyContent: 'flex-start'}}>
                  <Image
                  style={{ width: 50, height: 50, }}
                  source={require('../../assets/LPB.png')}
                  />
                </View> */}
                <View style={{ flexGrow:1, justifyContent: 'center' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20, textAlign: 'center' }}>Bons de chargement</Text></View>
                {/* <View style={{ flex:1, justifyContent: 'flex-end' }}>
                  <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../assets/LPB.png')}
                  />
                </View> */}
              </View>
          ),
        }}
        key="1"
      />,
      <Stack.Screen 
      name="Bc" 
      component={BcScreen} 
      options={({ navigation }) => ({
      headerLeft: () => (
      <Pressable onPress={() => navigation.replace('BcList')}>
        <Text style={{color: 'white'}}> retour </Text>
      </Pressable>
      ),
      headerStyle: {
        backgroundColor: '#0000b3',
      },
      headerTintColor:'#fff',
      headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ flexGrow:0.5, justifyContent: 'flex-start'}}>
              {/* <Image
              style={{ width: 50, height: 50, }}
              source={require('../../assets/LPB.png')}
              /> */}
            </View>
            <View style={{ flexGrow:1, justifyContent: 'center' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>BC en cours...</Text></View>
            <View style={{ flex:1, justifyContent: 'flex-end' }}>
              {/* <Image
              style={{ width: 50, height: 50 }}
              source={require('../../assets/LPB.png')}
              /> */}
            </View>
          </View>

      ),
      })
    }
      key="2"
    />,
      <Stack.Screen
        name="Bc_old"
        component={BcScreen}
        options={{ title: "Bon de chargement" }}
        key="5"
      /> 
      ]
       : [
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
          headerStyle: {
            backgroundColor: '#0000b3',
          },
          headerTitle: () => (
            <View style={{flex:1}}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                  {/* <Image
                  style={{ width: 75, height: 75, }}
                  source={require('../../assets/LPB.png')}
                  /> */}
                {/* </View> */}
                {/* <View style={{ flexGrow:1.25, justifyContent: 'center' }}><Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>LOGIN</Text></View> */}
                {/* <View style={{ flex:0.75, justifyContent: 'flex-end' }}> */}
                  {/* <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../assets/BTSYSTEM.png')}
                  /> */}

              </View>
            </View>
          ),
        }}
        key="3"
      />,<Stack.Screen
        name="ShootSession"
        component={ShootSessionScreen}
        options={{ title: "Session" }}
        key="4"
      />
      ]}
    </Stack.Navigator>
  );
};

/* const styles = StyleSheet.create({
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
}); */

export default Main;