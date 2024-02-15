import BcList from '../BcList';
//import { CommonActions } from '@react-navigation/native';
import LogoutButton from '../LogoutButton';
import BcLast from '../BcLast';
import { SafeAreaView, BackHandler, Button, View } from 'react-native';

const BcListScreen = ({ navigation }) => {
    return (
        <>
            <View>
                <LogoutButton/>
                <BcList/>
                <BcLast></BcLast>
            </View>
            <Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />
        </>
        
    );
};

export default BcListScreen;