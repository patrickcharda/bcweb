import Session from '../Session';
import { BackHandler } from 'react-native';


const ShootSessionScreen = ({ route, navigation }) => {

    const { username, password, appLogin, renewToken, hasCommandLine, appLogout, endpointRefreshToken, endpointLogin, endpointLogout, endpointCommandLine, appliname, fingerprint } = route.params;

    return (
        <>
            <Session
            username={username}
            password={password} 
            appLogin={appLogin}
            renewToken={renewToken} 
            hasCommandLine={hasCommandLine}
            appLogout={appLogout} 
            endpointRefreshToken={endpointRefreshToken} 
            endpointLogin={endpointLogin} 
            endpointLogout={endpointLogout} 
            endpointCommandLine={endpointCommandLine} 
            appliname={appliname} 
            fingerprint={fingerprint}/>
        </>
    );
};

export default ShootSessionScreen;

