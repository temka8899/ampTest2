import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthScreen from './src/screens/authScreen';
import Home from './src/screens/uploadScreen';
import Tabs from './src/components/bottomTab';
import ParticipatesScreen from './src/screens/ParticipatesScreen';
import CreateLeagueScreen from './src/screens/CreateLeagueScreen';
import LeagueListScreen from './src/screens/LeagueListScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="CreateLeagueScreen"
          component={CreateLeagueScreen}
        />
        <Stack.Screen name="LeagueListScreen" component={LeagueListScreen} />
        <Stack.Screen
          name="ParticipatesScreen"
          component={ParticipatesScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
