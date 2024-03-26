import BcList from '../BcList';
//import { CommonActions } from '@react-navigation/native';
import LogoutButton from '../LogoutButton';
import BcLast from '../BcLast';
import { BackHandler, Button, View } from 'react-native';
import Message from "../Message";
import Footer from "../Footer";
import { useSelector, } from "react-redux";

const BcListScreen = () => {

    const isActionBeingExecuted = useSelector((state) => state.tokenReducer.isActionBeingPerformed);

    return (
        <>
            <Message />
            <View>
                {/* {isActionBeingExecuted? null : <LogoutButton/> } */}
                <BcList key={Math.floor(Math.random() * ((Math.random()) * 10000))} />
                {isActionBeingExecuted? null : <BcLast></BcLast>}
            </View>
            {/* {isActionBeingExecuted? null :<Button title="Quitter BCWeb" onPress={() => BackHandler.exitApp()} />} */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 55, backgroundColor: '#0000b3'}}>
            {isActionBeingExecuted? null : <Footer/>}
            </View>
        </>
        
    );
};

export default BcListScreen;