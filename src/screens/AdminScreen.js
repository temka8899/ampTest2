import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  ScrollView,
} from 'react-native';

import {COLORS, FONTS, icons} from '../constants';

import {hp, wp} from '../constants/theme';

import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RFPercentage} from 'react-native-responsive-fontsize';

import Amplify, {API, graphqlOperation, Auth} from 'aws-amplify';
import {
  listGames,
  listLeaguePlayers,
  listLeagues,
  listTeams,
} from '../graphql/queries';
import {
  createSchedule,
  createTeam,
  createTeamPlayer,
  deleteGame,
  deleteLeague,
  updateLeague,
} from '../graphql/mutations';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AdminScreen = ({navigation}) => {
  useEffect(() => {
    fetchLeague();
    fetchGame();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const [LeagueList, setLeagueList] = React.useState([]);
  const [GameData, setGameData] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  const onRefresh = React.useCallback(() => {
    // checkInLeague();
    setRefreshing(true);
    fetchLeague();
    fetchGame();
    wait(500).then(() => setRefreshing(false));
  }, []);

  const fetchLeague = async () => {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      //
      console.log('leageuData :>> ', leagueData);
      setLeagueList(leagueData.data.listLeagues.items);
    } catch (err) {}
  };

  const DeleteLeague = async leagueID => {
    try {
      await API.graphql(
        graphqlOperation(deleteLeague, {
          input: {
            id: leagueID,
          },
        }),
      );
      console.log('League deleted');
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (err) {
      console.log('error deleting League:', err);
    }
  };

  const StartLeague = async leagueID => {
    //Set Is Start League True
    var date = new Date();
    date.setDate(date.getDate());
    let n = todos.length / 2 - 1;
    const temp = await API.graphql(
      graphqlOperation(updateLeague, {
        input: {
          id: leagueID,
          isStart: true,
          startedDate: `${date.toLocaleDateString()}`,
          maxSchedule: `${(n * (n + 1)) / 2}`,
          currentSchedule: 1,
        },
      }),
    );
    const startLeagueId = temp.data.updateLeague.id;

    // Get Soccer League Players
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            //LeagueID
            leagueID: {eq: leagueID},
          },
        }),
      );
      let teamIndex = 1;
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('Start League LeaguePlayer>>>>>>>>>>>>>>', todos);
      if (todos.length % 2 == 0 && todos.length >= 8) {
        for (var i = 0; i < todos.length; i = i + 2) {
          console.log(i);
          // Add Team loop
          try {
            const temp_ = await API.graphql(
              graphqlOperation(createTeam, {
                input: {
                  name: `team${teamIndex}`,

                  //LeagueID
                  teamLeagueId: leagueID,
                  win: 0,
                  lose: 0,
                },
              }),
            );
            console.log(`Team${teamIndex} created `);
            //Add Team Player
            await addStartTeamPlayer(
              temp_.data.createTeam.id,
              todos[i].playerID,
            );
            await addStartTeamPlayer(
              temp_.data.createTeam.id,
              todos[i + 1].playerID,
            );
            setTimeout(() => {
              onRefresh();
            }, 1000);
          } catch (err) {
            console.log('error creating League:', err);
          }
          teamIndex++;
        }
      } else {
        console.log('Soccer League Players not even or not enough');
      }
    } catch (err) {
      console.log('error fetching League Players', err);
    }
    addScheduleLoop(startLeagueId);
  };

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

  async function DeleteGame(gameID) {
    try {
      await API.graphql(
        graphqlOperation(deleteGame, {
          input: {
            id: gameID,
          },
        }),
      );
      console.log('Game deleted');
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (err) {
      console.log('error deleting League:', err);
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
      console.log('TeamPlayer Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  async function fetchGame() {
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));

      console.log('Games>>>>>>>>>>>>>>', gameData.data.listGames.items);
      setGameData(gameData.data.listGames.items);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginLeft: wp(4),
          marginTop: hp(3),
          borderRadius: 20,
          flexDirection: 'row',
        }}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${item.game.image}`,
          }}
          style={{
            width: wp(33.3),
            height: hp(20),
          }}
          imageStyle={{borderRadius: 40}}>
          <LinearGradient
            style={{flex: 1, borderRadius: 40}}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00000000', '#000']}></LinearGradient>
        </ImageBackground>
        <View style={styles.leagueStatus}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              paddingVertical: hp(1),
            }}>
            {item.game.name}
          </Text>
          <Text
            style={{
              marginLeft: wp(2),
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.5),
            }}>
            {item.startedDate}
          </Text>
          <View>
            {item.isStart ? (
              <TouchableOpacity
                disabled={true}
                onPress={() => StartLeague(item.id)}
                style={styles.onGoingBtn}>
                <Text style={styles.btnText}>Started</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => StartLeague(item.id)}
                style={styles.startBtn}>
                <Text style={styles.btnText}>Start League</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => DeleteLeague(item.id)}
              style={styles.deleteBtn}>
              <Text style={styles.btnText}>Delete league</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderItemGame = ({item}) => {
    return (
      <View
        style={{
          marginLeft: wp(4),
          marginTop: hp(3),
          borderRadius: 20,
          flexDirection: 'row',
        }}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${item.image}`,
          }}
          style={{
            width: wp(33.3),
            height: hp(20),
          }}
          imageStyle={{borderRadius: 40}}>
          <LinearGradient
            style={{flex: 1, borderRadius: 40}}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00000000', '#000']}></LinearGradient>
        </ImageBackground>
        <View style={styles.leagueStatus}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              paddingVertical: hp(1),
            }}>
            {item.name}
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => DeleteGame(item.id)}
              style={styles.deleteBtn}>
              <Text style={styles.btnText}>Delete game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>
      <ScrollView
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.textStyle}> League List </Text>
          <TouchableOpacity
            onPress={() => {
              onRefresh();
            }}>
            <Text style={styles.textStyle}> refresh </Text>
          </TouchableOpacity>
        </View>
        <View>
          {LeagueList.length !== 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={LeagueList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          ) : (
            <View>
              <View style={styles.lottie}>
                <LottieView
                  autoPlay
                  source={require('../assets/Lottie/game-loading.json')}
                />
                <Text style={styles.lottieText}>LEAGUE CREATING...</Text>
              </View>
            </View>
          )}
        </View>
        <Text style={styles.textStyle}> Game List </Text>
        <View>
          {LeagueList.length !== 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={GameData}
              renderItem={renderItemGame}
              keyExtractor={item => item.id}
            />
          ) : (
            <View>
              <View style={styles.lottie}>
                <LottieView
                  autoPlay
                  source={require('../assets/Lottie/game-loading.json')}
                />
                <Text style={styles.lottieText}>GAME CREATING...</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('createGameScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLeagueScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create League</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('createTeamScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Team</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  createBtn: {
    width: wp(45),
    height: hp(5),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: wp(35),
    height: hp(3),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  startBtn: {
    width: wp(35),
    height: hp(3),
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  onGoingBtn: {
    width: wp(35),
    height: hp(3),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  createBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.6),
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.3),
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  backButton: {
    width: wp(100),
    height: hp(7),
    paddingHorizontal: wp(3),
    flexDirection: 'column',
  },
  ButtonContainer: {
    flex: 1,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  textStyle: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
});
export default AdminScreen;
