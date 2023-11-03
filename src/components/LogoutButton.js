import { Button } from 'react-native';
import { signout } from "../redux/actions";
import * as React from "react";
import { useDispatch } from "react-redux";  



const LogoutButton = () => {
    const dispatch = useDispatch();
    return <Button onPress={() => dispatch(signout())} title="Se déconnecter" />
};

export default LogoutButton;