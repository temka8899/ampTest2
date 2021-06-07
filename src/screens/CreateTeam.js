import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
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
  StatusBar,
  ColorPropType,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import {
  createGame,
  createLeague,
  createTeam,
  createTeamPlayer,
  createLeaguePlayer,
} from '../graphql/mutations';
import {
  listGames,
  listLeagues,
  listPlayers,
  listTeamPlayers,
  listTeams,
  listLeaguePlayers,
  getTeam,
} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import FormInput from '../components/FormInput';
import {AuthContext} from '../../App';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createTeamScreen = ({navigation}) => {
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const initialState = {name: ''};
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [uploadImage, setUploadImage] = useState('');
  const [fileName123, setFileName] = useState('');
  const [file123, setFile123] = useState('');

  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }
  useEffect(() => {}, []);

  async function addTeam() {
    try {
      await API.graphql(
        graphqlOperation(createTeam, {
          input: {
            name: 'team3',
            teamLeagueId: 'fbe1219f-7eec-4f34-b3b2-5a520fb05991',
            win: 0,
            lose: 0,
          },
        }),
      );
      console.log('Team Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  async function addTeamPlayer() {
    try {
      await API.graphql(
        graphqlOperation(createTeamPlayer, {
          input: {
            teamPlayerTeamId: 'a59b4e48-ea33-496e-8103-db1d1ef7b8b2',
            teamPlayerPlayerId: '9cd492d9-e35a-470a-a4a8-e280c0f7df5e',
          },
        }),
      );
      console.log('Team Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
    fetchTeamPlayers();
  }

  async function addLeaguePlayer() {
    try {
      await API.graphql(
        graphqlOperation(createLeaguePlayer, {
          input: {
            leaguePlayerLeagueId: 'fbe1219f-7eec-4f34-b3b2-5a520fb05991',
            leaguePlayerPlayerId: userInfo.c_id,
          },
        }),
      );
      console.log('League Player Created');
    } catch (err) {
      console.log('error creating League Player:', err);
    }
    fetchTeamPlayers();
  }

  async function fetchTeam() {
    try {
      // let filter = {
      //   or: [
      //     {
      //       name: {eq: 'team2'},
      //     },
      //     {
      //       name: {eq: 'team2'},
      //     },
      //   ],
      // };
      const leagueData = await API.graphql(
        graphqlOperation(listTeams, {filter: {name: {eq: 'team3'}}}),
      );
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Teams>>>>>>>>>>>>>>', leagueData.data.listTeams.items[0]);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchTeamPlayers() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listTeamPlayers));
      const todos = leagueData.data.listTeamPlayers.items;
      console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchLeaguePlayers() {
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('League Player>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content"></StatusBar>
      <View>
        <Button onPress={() => addTeam()} title="add Team" />
        <Button onPress={() => addTeamPlayer()} title="add Team Player" />
        <Button onPress={() => addLeaguePlayer()} title="add League Player" />
        <Button onPress={() => fetchTeam()} title="Fetch Team" />
        <Button onPress={() => fetchTeamPlayers()} title="Fetch TeamPlayer" />
        <Button
          onPress={() => fetchLeaguePlayers()}
          title="Fetch League Player"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp(4),
    width: wp(70),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.5),
    padding: 0,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: wp(100),
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // borderColor: 'red',
    // borderWidth: 1,
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    width: wp(45),
    height: hp(5),
    // borderColor: 'red',
    // borderWidth: 1,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.4),
  },
});
export default createTeamScreen;
