import * as React from 'react';

// import codePush from 'react-native-code-push';
import codePush from 'react-native-code-push';

import Home from './src/screens/uploadScreen';
import Tabs from './src/components/BottomTab';
import authScreen from './src/screens/authScreen';
import AdminScreen from './src/screens/AdminScreen';
import CountScreen from './src/screens/CountScreen';
import createTeamScreen from './src/screens/CreateTeam';
import createGameScreen from './src/screens/CreateGame';
import ScheduleScreen from './src/screens/ScheduleScreen';
import createLeagueScreen from './src/screens/CreateLeague';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ParticipatesScreen from './src/screens/ParticipatesScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <ContextProvider>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Auth" component={authScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="CreateLeagueScreen"
            component={createLeagueScreen}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name="ParticipatesScreen"
            component={ParticipatesScreen}
          />
          <Stack.Screen name="createTeamScreen" component={createTeamScreen} />
          <Stack.Screen name="createGameScreen" component={createGameScreen} />
          <Stack.Screen name="AdminScreen" component={AdminScreen} />
          <Stack.Screen
            name="CountScreen"
            component={CountScreen}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
        </Stack.Navigator>
      </ContextProvider>
    </NavigationContainer>
  );
}

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
