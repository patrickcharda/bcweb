import Login from '../Login';
import { BackHandler, Button, View, Text, Image } from 'react-native';
import Message from "../Message";
import FooterLogin from "../FooterLogin";


const LoginScreen = ({ navigation }) => {
    return (
        <>
            <Message />
            <Login/>
            {/* <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} /> */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 55, backgroundColor: '#0000b3'}}>
                <FooterLogin/>
            </View>
        </>
    );
};

export default LoginScreen;

