import {ScrollView, SafeAreaView, Text, ActivityIndicator, StyleSheet} from 'react-native';
import apiCall from '../redux/apiCall';
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";  
import Message from "./Message";


const BcList = () => {
  const dispatch = useDispatch();
  
  //Alert.alert('message is : ', message);

  //const isEmpty = (variable) => {return variable === null || variable === undefined || variable === ''};


  // au chargement uniquement
  React.useEffect(() => {
    dispatch(apiCall('https://demo-btw.monkey-soft.fr/bcweb/bcx/', token));
  }, []);

  const data = JSON.stringify(useSelector((state) => state.apiReducer.data.results));
  //const error = JSON.stringify(useSelector((state) => state.apiReducer.error));
  const loading = useSelector((state) => state.apiReducer.loading);
  const token = useSelector((state) => state.tokenReducer.token);

/*   return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : isEmpty(data) ? <Login/> :(
        <Text>
          {data}
        </Text>
      ) }
    </ScrollView>
  ); */
  return (
    <ScrollView>
      <Message/>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : <Text>
          {data}
        </Text>
      }
    </ScrollView>
  );
}

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
  });

export default BcList;