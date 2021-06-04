import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {createGame, createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {userData} from '../data/Players';
import {CognitoIdToken, CognitoUser} from 'amazon-cognito-identity-js';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createLeagueScreen = ({navigation}) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchLeague();
  }, []);
  async function fetchGames() {
    const user = await Auth.currentUserInfo();
    console.log('Attributes =======', user);
    // userInfo = await Auth.userAttributes(us).then(console.log(userInfo));
    try {
      const todoData = await API.graphql(graphqlOperation(listGames));
      const todos = todoData.data.listGames.items;
      console.log('Games>>>>', todos);
      setTodos(todos);
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // const user2 = await Auth.currentAuthenticatedUser();
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', user2);
      // const result = await Auth.updateUserAttributes(user2, {
      //   'custom:IntLevel': `5`,
      //   'custom:Xp': `390`,
      //   'custom:Name': `Mkoogii`,
      //   'custom:Admin': `1`,
      // });
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchLeague() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      const todos = leagueData.data.listLeagues.items;
      console.log('leagueData', leagueData);
      console.log('League>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function addLeague() {
    try {
      await API.graphql(
        graphqlOperation(createLeague, {
          input: {
            startDate: '2021-08-01',
            leagueGameId: 'b95b3ca0-9338-442e-9eb8-a323c6114c4c',
          },
        }),
      );
      console.log('League Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }
  return (
    <View>
      <SafeAreaView>
        <Text>addLeague screen</Text>
      </SafeAreaView>
    </View>
  );
};
export default createLeagueScreen;
