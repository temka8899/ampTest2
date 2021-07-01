import * as React from 'react';

// import codePush from 'react-native-code-push';
import codePush from 'react-native-code-push';

import Tabs from './src/components/BottomTab';
import authScreen from './src/screens/authScreen';
import AdminScreen from './src/screens/AdminScreen';
import CountScreen from './src/screens/CountScreen';
import createTeamScreen from './src/screens/CreateTeam';
import createGameScreen from './src/screens/CreateGame';
import createLeagueScreen from './src/screens/CreateLeague';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ParticipatesScreen from './src/screens/ParticipatesScreen';
import FormInterface from './src/screens/FormInterface';
import BracketScreen from './src/screens/BracketScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = ({navigation}) => {
  const [cogID, setCogId] = React.useState();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userID');
      if (value !== null) {
        setCogId(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <NavigationContainer>
      <ContextProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Auth" component={authScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="BracketScreen"
            component={BracketScreen}
            options={{gestureEnabled: false}}
          />
        </Stack.Navigator>
      </ContextProvider>
    </NavigationContainer>
  );
};

export const AuthContext = React.createContext([]);

const ContextProvider = ({children}) => {
  const [userInfo, setUserInfo] = React.useState('my user info');
  return (
    <AuthContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </AuthContext.Provider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

export default codePush(codePushOptions)(App);
