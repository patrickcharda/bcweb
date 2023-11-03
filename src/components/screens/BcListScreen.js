import BcList from '../BcList';
//import { CommonActions } from '@react-navigation/native';
import LogoutButton from '../LogoutButton';
import { SafeAreaView } from 'react-native';

const BcListScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <LogoutButton/>
            <BcList/>
        </SafeAreaView>
    );
};

export default BcListScreen;