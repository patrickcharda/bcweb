import { Button, StyleSheet, BackHandler } from 'react-native';

const ExitButton = () => {
  return <Button color="#0000b3" title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
};

/* const styles = StyleSheet.create({
    button: {
      height: 20,
      backgroundColor: "#0000b3",
      padding: 10,
      borderRadius: 3,
      marginBottom: 30,
    },
  }); */

export default ExitButton;