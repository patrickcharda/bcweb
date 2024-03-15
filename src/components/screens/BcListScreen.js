import BcList from '../BcList';
//import { CommonActions } from '@react-navigation/native';
import LogoutButton from '../LogoutButton';
import BcLast from '../BcLast';
import { BackHandler, Button, View } from 'react-native';
import Message from "../Message";


const BcListScreen = () => {
    return (
        <>
            <Message />
            <View>
                <LogoutButton/>
                <BcList key={Math.floor(Math.random() * ((Math.random()) * 10000))} />
                <BcLast></BcLast>
            </View>
            <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
        </>
        
    );
};

export default BcListScreen;