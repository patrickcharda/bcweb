//import { CommonActions } from '@react-navigation/native';
import Bc from '../Bc';
import LogoutButton from "../LogoutButton";
import { SafeAreaView } from "react-native";

const BcScreen = ({}) => {
  return (
    <SafeAreaView>
      <LogoutButton />
      <Bc/>
    </SafeAreaView>
  );
};

export default BcScreen;
