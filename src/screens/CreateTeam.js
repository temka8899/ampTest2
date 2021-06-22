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
  updateSchedule,
  updateTeamPlayer,
  updateTeam,
  deleteLeague,
} from '../graphql/mutations';
import {
  listGames,
  listLeagues,
  listPlayers,
  listTeamPlayers,
  listTeams,
  listLeaguePlayers,
  getTeam,
  listSchedules,
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
  const initialState = {name: ''};
  const [formState, setFormState] = useState(initialState);
  let unfinishedMatch = 0;
  const winners = [];

  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }

  async function addTeam() {
    try {
      await API.graphql(
        graphqlOperation(createTeam, {
          input: {
            name: 'team3',
            teamLeagueId: '34b7465d-76ab-42e9-85ce-71ee4a4368ed',
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
      console.log('TeamPlayer Created');
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
        graphqlOperation(listTeams, {
          filter: {leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'}},
        }),
      );
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

  async function fetchGame() {
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));
      console.log('Games>>>>>>>>>>>>>>', gameData.data.listGames.items);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchTeamPlayers() {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {teamID: {eq: '652535fb-b6d2-4531-bbb0-5edde60fb9e4'}},
        }),
      );
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
    const startLeagueId = 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa';

    // Get Soccer League Players
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            //LeagueID
            leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('Start League LeaguePlayer>>>>>>>>>>>>>>', todos);
      if (todos.length % 2 == 0 && todos.length >= 8) {
        for (var i = 0; i < todos.length; i = i + 2) {
          console.log(i);
          // Add Team loop
          try {
            const temp = await API.graphql(
              graphqlOperation(createTeam, {
                input: {
                  name: `team${i}`,

                  //LeagueID
                  leagueID: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa',
                  teamLeagueId: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa',
                  win: 0,
                  lose: 0,
                },
              }),
            );
            console.log(`Team${i} created `);
            //Add Team Player
            addStartTeamPlayer(temp.data.createTeam.id, todos[i].playerID);
            await addStartTeamPlayer(
              temp.data.createTeam.id,
              todos[i + 1].playerID,
            );
          } catch (err) {
            console.log('error creating League:', err);
          }
        }

        //Set Is Start League True
        var date = new Date();
        date.setDate(date.getDate());
        let n = todos.length / 2 - 1;
        await API.graphql(
          graphqlOperation(updateLeague, {
            input: {
              id: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa',
              isStart: true,
              startedDate: `${date.toLocaleDateString()}`,
              maxSchedule: `${n(n + 1) / 2}`,
              currentSchedule: 1,
            },
          }),
        );
      } else {
        console.log('Soccer League Players not even or not enough');
      }
    } catch (err) {
      console.log('error fetching League Players', err);
    }
    addScheduleLoop(startLeagueId);
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
      console.log('TeamPlayer Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  async function updateTeamName() {
    try {
      await API.graphql(
        graphqlOperation(updateTeam, {
          input: {
            //Team id
            id: '236e6a2f-6014-44de-889e-f1962730366a',
            name: 'ner soligdson bat',
          },
        }),
      );
      console.log('Team name Updated');
    } catch (err) {
      console.log('error updating Teams', err);
    }
  }

  async function addScheduleLoop(startLeagueId) {
    const teamData = await API.graphql(graphqlOperation(listTeams));
    const teams = teamData.data.listTeams.items;
    const k = teams.length;
    var nemeh = 1;
    var hasah = teams.length;
    var date = new Date();
    var date2 = date.getDay();
    var numberOfDaysToAdd = 0;
    let dateNemeh = 0;
    let tooluur = 1;

    // date.setDate(date.getDate() + numberOfDaysToAdd);
    date.setDate(date.getDate() - 1);
    for (var i = 1; i < teams.length; i++) {
      for (var j = 0; j < hasah - 1; j++) {
        if (dateNemeh % 4 == 0) {
          date.setDate(date.getDate() + 1);
          var date2 = date.getDay();
          if (date2 == 6) {
            date.setDate(date.getDate() + 2);
          }
        }

        console.log(
          `${teams[j].name} vs ${
            teams[j + nemeh].name
          }___at ${date.toLocaleDateString()}____`,
        );
        addSchedule(
          teams[j].id,
          teams[j + nemeh].id,
          date.toLocaleDateString(),
          startLeagueId,
          tooluur,
        );
        dateNemeh++;
        tooluur++;
      }
      hasah--;
      nemeh++;
    }
  }

  async function addSchedule(team1ID, team2ID, date, startLeagueId, tooluur) {
    try {
      await API.graphql(
        graphqlOperation(createSchedule, {
          input: {
            scheduleHomeId: team1ID,
            scheduleAwayId: team2ID,
            homeScore: 0,
            awayScore: 0,
            date: `${date}`,
            leagueID: startLeagueId,
            index: tooluur,
          },
        }),
      );
      // console.log('Schedule Created');
    } catch (err) {
      console.log('error creating Schedule:', err);
    }
  }

  async function getSchedule() {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = scheduleData.data.listSchedules.items;
      console.log('Schedule>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function isScheduleEnded() {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = scheduleData.data.listSchedules.items;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].awayScore == 0 || todos[i].homeScore == 0) {
          unfinishedMatch++;
        } else {
          if (todos[i].awayScore == 10) {
            winners.push(todos[i].away);
          } else if (todos[i].homeScore == 10) {
            winners.push(todos[i].home);
          }
        }
      }
      todos.length == unfinishedMatch
        ? console.log('all matches played>>>>>>>>>>>>>>')
        : console.log('unfinished Match>>>>>>>>>>>>>>', unfinishedMatch);
      console.log('unfinished Match>>>>>>>>>>>>>>', todos);
      console.log('Winners', winners);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function UpdateSchedule() {
    // Updating Schedule data
    // Bagiin avsan onoog update hiine
    try {
      await API.graphql(
        graphqlOperation(updateSchedule, {
          input: {
            //Schedule id
            id: '4f773918-5aa7-490f-8bff-afb3853a529e',
            homeScore: 10,
            awayScore: 8,
          },
        }),
      );
      console.log('Schedule Updated');
    } catch (err) {
      console.log('error fetching todos', err);
    }

    //getting Team win-lose data to update
    const teamData = await API.graphql(
      graphqlOperation(listTeams, {
        filter: {
          //Team id
          id: {eq: 'f3423713-e56d-4896-9c58-581b67dfe47a'},
        },
      }),
    );
    const win = teamData.data.listTeams.items[0].win;
    const lose = teamData.data.listTeams.items[0].lose;

    // Updating Team win-lose datas
    try {
      await API.graphql(
        graphqlOperation(updateTeam, {
          input: {
            //Team id
            id: 'f3423713-e56d-4896-9c58-581b67dfe47a',
            win: `${win + 1}`,
            lose: `${lose}`,
          },
        }),
      );
      console.log('Team Updated');
    } catch (err) {
      console.log('error updating Teams', err);
    }

    //Getting teamPlayer PlayerScore to update
    const teamPlayerData = await API.graphql(
      graphqlOperation(listTeamPlayers, {
        filter: {
          //TeamPlayer id
          id: {eq: '14e74619-25e1-429e-a486-f250e2995775'},
        },
      }),
    );
    const playerScore =
      teamPlayerData.data.listTeamPlayers.items[0].playerScore;

    // Updating TeamPlayer playerScore
    // Toglogchiin onoog update hiine
    try {
      await API.graphql(
        graphqlOperation(updateTeamPlayer, {
          input: {
            //TeamPlayer id
            id: '14e74619-25e1-429e-a486-f250e2995775',
            playerScore: `${playerScore + 5}`,
          },
        }),
      );
      console.log('TeamPlayer PlayerScore Updated');
    } catch (err) {
      console.log('error updating Teams', err);
    }
  }

  async function getDate() {
    var date = new Date();
    var numberOfDaysToAdd = 0;
    let dateNemeh = 0;
    date.setDate(date.getDate() + numberOfDaysToAdd);
  }

  async function DeleteLeaguePlayer() {
    try {
      await API.graphql(
        graphqlOperation(deleteLeaguePlayer, {
          input: {
            id: '1d9f967d-b536-48ff-ab75-d5f3841e3b2d',
          },
        }),
      );
      console.log('League Player deleted');
    } catch (err) {
      console.log('error deleting League Player:', err);
    }
  }

  async function DeleteLeague() {
    try {
      await API.graphql(
        graphqlOperation(deleteLeague, {
          input: {
            id: 'e7b2ac34-afc0-4d9d-a61b-f221b653276d',
          },
        }),
      );
      console.log('League deleted');
    } catch (err) {
      console.log('error deleting League:', err);
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
        <Button onPress={() => fetchPlayer()} title="Fetch Players" />
        <Button onPress={() => fetchLeague()} title="Fetch League" />

        <Button
          onPress={() => checkLeaguePlayers()}
          title="check LeaguePlayer"
        />
        <Button onPress={() => startLeague()} title="Start League" />
        <Button onPress={() => leagueIsStart()} title="update League" />
        <Button onPress={() => addScheduleLoop()} title="add Schedule" />
        <Button onPress={() => getDate()} title="get Date" />
        <Button onPress={() => getSchedule()} title="get Schedule" />
        <Button onPress={() => UpdateSchedule()} title="update Schedule" />
        <Button
          onPress={() => DeleteLeaguePlayer()}
          title="Delete LeaguePlayer"
        />
        <Button onPress={() => DeleteLeague()} title="Delete League" />
        <Button onPress={() => fetchGame()} title="fetch game" />
        <Button onPress={() => updateTeamName()} title="update team name" />
        <Button onPress={() => isScheduleEnded()} title="isSchedule Ended?" />
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
