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
} from '../graphql/mutations';
import {
  listGames,
  listLeagues,
  listPlayers,
  listTeamPlayers,
  listTeams,
} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import FormInput from '../components/FormInput';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createTeamScreen = ({navigation}) => {
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
            name: 'team4',
            teamLeagueId: 'be297a57-2b43-450d-8c62-733e6dc7829d',
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
            teamPlayerTeamId: '1c9bfdff-087d-4702-8659-cc7f362bc431',
            teamPlayerPlayerId: '27de6d33-0bcd-4a47-97e0-7419259d8c88',
          },
        }),
      );
      console.log('Team Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
    fetchTeamPlayers();
  }

  async function fetchTeam() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listTeams));
      const todos = leagueData.data.listTeams.items;
      console.log('Teams>>>>>>>>>>>>>>', todos);
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content"></StatusBar>
      <View>
        <Button onPress={() => fetchTeam()} title="Fetch Team" />
        <Button onPress={() => fetchTeamPlayers()} title="Fetch TeamPlayer" />
        <Button onPress={() => addTeam()} title="addteam" />
        <Button onPress={() => addTeamPlayer()} title="addteamplayer" />
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
