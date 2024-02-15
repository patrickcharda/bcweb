import Login from '../Login';
import { BackHandler, Button } from 'react-native';


const LoginScreen = ({ navigation }) => {
    return (
        <>
            <Login/>
            <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
        </>
    );
};

export default LoginScreen;

