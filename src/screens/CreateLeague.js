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
  const [GameList, setGameList] = useState([]);
  const [LeagueList, setLeagueList] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchLeague();
  }, []);

  async function fetchGames() {
    // const user = await Auth.currentUserInfo();
    // console.log('Attributes =======', user);
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));
      const gameList = gameData.data.listGames.items;
      setGameList(gameList);
      console.log('Games>>>>', gameList);
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
      const leagueList = leagueData.data.listLeagues.items;
      setLeagueList(leagueList);
      console.log('League>>>>>>>>>>>>>>', leagueList);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function addLeague() {
    try {
      await API.graphql(
        graphqlOperation(createLeague, {
          input: {
            startDate: '2021-07-01',
            leagueGameId: 'bbd83f8f-0dad-4ece-a0bf-63d76a148a2d',
            description: 'aeriabeubkaejbrkhaetbkaejtbkj',
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
        {GameList.map((todo, index) => {
          return (
            <View>
              <Text key={index}>{[index, '. ', todo.name]}</Text>
            </View>
          );
        })}
        <Button title="Add League" onPress={() => addLeague()} />
      </SafeAreaView>
    </View>
  );
};
export default createLeagueScreen;
