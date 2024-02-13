import { Button } from 'react-native';
import { signout, purgePcesAccs, purgeBc } from "../redux/actions";
import * as React from "react";
import { useDispatch } from "react-redux";  



const LogoutButton = () => {
    const dispatch = useDispatch();
    return <Button onPress={() => {dispatch(signout()); dispatch(purgePcesAccs()); dispatch(purgeBc())}} title="Se déconnecter" />
};

export default LogoutButton;