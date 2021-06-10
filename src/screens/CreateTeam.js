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
  createSchedule,
  deleteLeaguePlayer,
  updateLeague,
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
  const [teamPlayerID, setTeamPlayerID] = useState('');
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
      const temp = await API.graphql(
        graphqlOperation(createLeaguePlayer, {
          input: {
            leaguePlayerLeagueId: '0a0fa76f-af84-4f75-bc16-142f4176be58',
            leagueID: '0a0fa76f-af84-4f75-bc16-142f4176be58',
            leaguePlayerPlayerId: '52a263dc-6098-48fc-a268-60cf8b585c39',
          },
        }),
      );
      console.log('League Player Created', temp);
    } catch (err) {
      console.log('error creating League Player:', err);
    }
  }

  async function DeleteLeaguePlayer() {
    try {
      await API.graphql(
        graphqlOperation(deleteLeaguePlayer, {
          input: {
            id: '120c0db5-2912-42ad-a653-a07eb8c5b9cf',
          },
        }),
      );
      console.log('League Player deleted');
    } catch (err) {
      console.log('error deleting League Player:', err);
    }
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
      const leagueData = await API.graphql(graphqlOperation(listTeams));
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Teams>>>>>>>>>>>>>>', leagueData.data.listTeams.items);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchPlayer() {
    try {
      const playerData = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {c_id: {eq: '37e2f195-76f1-4d68-8ee1-bd453b8185c4'}},
        }),
      );
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log(
        'Player>>>>>>>>>>>>>>',
        playerData.data.listPlayers.items[0].id,
      );
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchLeague() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Leagues>>>>>>>>>>>>>>', leagueData.data.listLeagues.items);
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
        graphqlOperation(listLeaguePlayers, {
          filter: {
            leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('League Player>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function checkLeaguePlayers() {
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            playerID: {eq: 'e3a0bb17-c3ca-4fd1-bbfe-44de4b267159'},
          },
        }),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('League Player>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function startLeague() {
    //Set Is Start League True
    leagueIsStart();

    // Get Soccer League Players
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('Start League LeaguePlayer>>>>>>>>>>>>>>', todos);
      if (todos.length % 2 == 0 && todos.length >= 8) {
        for (i = 0; i < todos.length; i = i + 2) {
          console.log(i);

          // Add Team loop
          try {
            const temp = await API.graphql(
              graphqlOperation(createTeam, {
                input: {
                  name: `team${i}_generated`,
                  teamLeagueId: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa',
                  win: 0,
                  lose: 0,
                },
              }),
            );

            //Add Team Player
            addStartTeamPlayer(temp.data.createTeam.id, todos[i].playerID);
            addStartTeamPlayer(temp.data.createTeam.id, todos[i + 1].playerID);
          } catch (err) {
            console.log('error creating League:', err);
          }
        }
      } else {
        console.log('Soccer League Players not even or not enough');
      }
    } catch (err) {
      console.log('error fetching League Players', err);
    }

    addSchedule();
  }

  async function leagueIsStart() {
    try {
      const temp = await API.graphql(
        graphqlOperation(updateLeague, {
          input: {
            id: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa',
            isStart: true,
          },
        }),
      );
      console.log('League updated', temp);
    } catch (err) {
      console.log('error updating League: ', err);
    }
  }

  async function addStartTeamPlayer(teamplayerteam, teamplayerplayer) {
    try {
      await API.graphql(
        graphqlOperation(createTeamPlayer, {
          input: {
            teamPlayerTeamId: `${teamplayerteam}`,
            teamID: `${teamplayerteam}`,
            teamPlayerPlayerId: `${teamplayerplayer}`,
            playerID: `${teamplayerplayer}`,
            playerScore: 0,
          },
        }),
      );
      console.log('Team Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  async function addSchedule(teamplayerteam) {
    const teamData = await API.graphql(graphqlOperation(listTeams));
    const teams = teamData.data.listTeams.items;
    console.log('Teams>>>>>>>>>>>>>>', teamData.data.listTeams.items);
    const k = teams.length;
    var i;
    var j;
    for (i = 0; i < k; i++) {
      for (j = i + 1; j < k; j++) {
        console.log(`Team${i}: ${teams[i].name} vs Team${j}: ${teams[j].name}`);
      }
    }
    // try {
    //   await API.graphql(
    //     graphqlOperation(createSchedule, {
    //       input: {
    //         scheduleHomeId: 'a59b4e48-ea33-496e-8103-db1d1ef7b8b2',
    //         scheduleAwayId: '9cd492d9-e35a-470a-a4a8-e280c0f7df5e',
    //         homeScore: 0,
    //         awayScore: 0,
    //         date: '',
    //       },
    //     }),
    //   );
    //   console.log('Team Created');
    // } catch (err) {
    //   console.log('error creating League:', err);
    // }
    // fetchTeamPlayers();
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
        <Button onPress={() => fetchPlayer()} title="Fetch Players" />
        <Button onPress={() => fetchLeague()} title="Fetch League" />
        <Button
          onPress={() => DeleteLeaguePlayer()}
          title="Delete LeaguePlayer"
        />
        <Button
          onPress={() => checkLeaguePlayers()}
          title="check LeaguePlayer"
        />
        <Button onPress={() => startLeague()} title="Start League" />
        <Button onPress={() => leagueIsStart()} title="update League" />
        <Button onPress={() => addSchedule()} title="add Schedule" />
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
