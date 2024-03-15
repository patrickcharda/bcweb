import Login from '../Login';
import { BackHandler, Button } from 'react-native';
import Message from "../Message";


const LoginScreen = ({ navigation }) => {
    return (
        <>
            <Message />
            <Login/>
            <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
        </>
    );
};

export default LoginScreen;

