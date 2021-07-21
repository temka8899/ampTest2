import React, {useState, useEffect, useRef} from 'react';
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
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import LoadBtn from '../components/Loading';

import {Picker} from '@react-native-picker/picker';

import Modal from 'react-native-modal';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Amplify, {API, graphqlOperation, Auth} from 'aws-amplify';
import {
  listGames,
  listLeaguePlayers,
  listLeagues,
  listTeamPlayers,
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
import CustomButton from '../components/Loading';
import {min} from 'moment';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const getRandomMessage = () => {
  // const number = Math.trunc(Math.random() * 10000);
  return `League started`;
};
const Message = props => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onHide();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        margin: wp(2),
        marginBottom: wp(1),
        backgroundColor: COLORS.brand,
        padding: wp(2),
        borderRadius: wp(1),
        shadowColor: COLORS.brand,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        height: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: COLORS.white,
          fontFamily: FONTS.brandFont,
          fontSize: wp(3),
        }}>
        {props.message}
      </Text>
    </Animated.View>
  );
};
const matchAmount = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const AdminScreen = ({navigation}) => {
  useEffect(() => {
    fetchLeague();
    fetchGame();
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, [navigation, onRefresh]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [LeagueList, setLeagueList] = React.useState([]);
  const [GameData, setGameData] = useState([]);
  const [btnLoad, setBtnLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchPerDay, setMatchPerDay] = useState();
  const [myLeagueID, setMyLeagueID] = useState();
  const [leagueIndex, setLeagueIndex] = useState();

  const [messages, setMessages] = useState([]);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

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
      let playerLength = [];
      let myData = [];
      let myArr = [];
      leagueData.data.listLeagues.items.map(item => {
        let custom = item;
        custom.loading = false;
        myData.push(custom);
      });

      console.log('league->>>>> :>> ', leagueData.data.listLeagues.items);
      for (let i = 0; i < leagueData.data.listLeagues.items.length; i++) {
        const leaguePlayerData = await API.graphql(
          graphqlOperation(listLeaguePlayers, {
            filter: {
              leagueID: {eq: leagueData.data.listLeagues.items[i].id},
            },
          }),
        );
        const todos = leaguePlayerData.data.listLeaguePlayers.items.length;
        let item = new Object();
        item = leagueData.data.listLeagues.items[i];
        item.playerQuantity = todos;
        myArr.push(item);
      }
      setLeagueList(myArr);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const DeleteLeague = async leagueID => {
    try {
      setBtnLoad(true);
      await API.graphql(
        graphqlOperation(deleteLeague, {
          input: {
            id: leagueID,
          },
        }),
      );
      console.log('League deleted');
      onRefresh();
      setBtnLoad(false);
    } catch (err) {
      console.log('error deleting League:', err);
      setBtnLoad(false);
    }
  };

  const StartLeague = async (leagueID, index, _matchPerDay) => {
    const startLeagueId = leagueID;
    let newState = LeagueList;
    newState[index].loading = true;
    setLeagueList(newState);

    // Get League Players
    setBtnLoad(true);
    const leaguePlayerData = await API.graphql(
      graphqlOperation(listLeaguePlayers, {
        filter: {
          //LeagueID
          leagueID: {eq: leagueID},
        },
      }),
    );

    const todos = leaguePlayerData.data.listLeaguePlayers.items;
    const minPlayer = todos[0].league.minPlayer;
    let tooluur = 1;
    const sorted = todos.sort((a, b) => b.player.level - a.player.level);
    if (sorted.length % 2 == 0 && sorted.length >= minPlayer) {
      let last = sorted.length - 1;
      for (var i = 0; i < sorted.length / 2; i = i + 1) {
        console.log(i);
        // Add Team loop
        try {
          const temp = await API.graphql(
            graphqlOperation(createTeam, {
              input: {
                name: `team${tooluur}`,
                leagueID: leagueID,
                teamLeagueId: leagueID,
                leagueStatus: 'Season',
                win: 0,
                lose: 0,
              },
            }),
          );
          console.log(`Team${i} created `);
          //Add Team Player
          addStartTeamPlayer(
            temp.data.createTeam.id,
            sorted[i].playerID,
            sorted[i].player.avatar,
          );
          addStartTeamPlayer(
            temp.data.createTeam.id,
            sorted[last].playerID,
            sorted[last].player.avatar,
          );
          last--;
        } catch (err) {
          console.log('error creating League2:', err);
        }
        tooluur++;
      }
      setTimeout(() => {
        onRefresh();
      }, 1000);
      setBtnLoad(false);
      setModalVisible(false);
      //Update League
      var date = new Date();
      date = moment(date).format('MM/D/YY');
      console.log(`date start>>>>>>>`, date);
      let n = todos.length / 2 - 1;
      var _leagueData = await API.graphql(
        graphqlOperation(updateLeague, {
          input: {
            id: leagueID,
            isStart: true,
            startedDate: date,
            maxSchedule: `${(n * (n + 1)) / 2}`,
            currentSchedule: 0,
            perDay: _matchPerDay,
          },
        }),
      );
      setBtnLoad(false);
      setModalVisible(false);
    } else {
      console.log('Soccer League Players not even or not enough');
      Alert.alert(
        `Players are not even or not enough. Minimum Players: ${minPlayer}`,
      );
      setBtnLoad(false);
      setModalVisible(false);
    }

    addScheduleLoop(startLeagueId, _leagueData);
    const message = 'League started';
    setMessages([...messages, message]);
  };

  async function addScheduleLoop(startLeagueId, _leagueData) {
    try {
      const teamData = await API.graphql(
        graphqlOperation(listTeams, {
          filter: {leagueID: {eq: startLeagueId}},
        }),
      );
      const teams = teamData.data.listTeams.items;
      const k = teams.length;
      var nemeh = 1;
      var hasah = teams.length;
      var date = new Date();
      var date2 = date.getDay();
      let dateNemeh = 0;
      let tooluur = 1;
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
          const leagueData1 = await API.graphql(
            graphqlOperation(listTeamPlayers, {
              filter: {
                teamID: {eq: `${teams[j].id}`},
              },
            }),
          );
          const _teamPlayers1 = leagueData1.data.listTeamPlayers.items;
          const playerAvatar1 = [];
          const playerID1 = [];
          for (var z = 0; z < _teamPlayers1.length; z++) {
            playerAvatar1.push(_teamPlayers1[z].player.avatar);
            playerID1.push(_teamPlayers1[z].player.id);
          }

          const leagueData2 = await API.graphql(
            graphqlOperation(listTeamPlayers, {
              filter: {
                teamID: {eq: `${teams[j + nemeh].id}`},
              },
            }),
          );
          const _teamPlayers2 = leagueData2.data.listTeamPlayers.items;
          const playerAvatar2 = [];
          const playerID2 = [];
          for (var z2 = 0; z2 < _teamPlayers2.length; z2++) {
            playerAvatar2.push(_teamPlayers2[z2].player.avatar);
            playerID2.push(_teamPlayers2[z2].player.id);
          }

          addSchedule(
            teams[j].id,
            teams[j + nemeh].id,
            date.toLocaleDateString(),
            startLeagueId,
            tooluur,
            playerAvatar1,
            playerAvatar2,
            playerID1,
            playerID2,
            _leagueData,
          );
          dateNemeh++;
          tooluur++;
        }
        hasah--;
        nemeh++;
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  async function addSchedule(
    team1ID,
    team2ID,
    date,
    startLeagueId,
    tooluur,
    playerAvatar1,
    playerAvatar2,
    playerID1,
    playerID2,
    _leagueData,
  ) {
    date = moment(date).format('MM/D/YY');
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
            homeImage: playerAvatar1,
            awayImage: playerAvatar2,
            homePlayers: playerID1,
            awayPlayers: playerID2,
            playOffIndex: 0,
            finalsIndex: 0,
            gameID: _leagueData.data.updateLeague.game.id,
            isPlaying: false,
          },
        }),
      );
      console.log('Schedule Created');
    } catch (err) {
      console.log('error creating Schedule:', err);
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
      setBtnLoad(false);

      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (err) {
      console.log('error deleting League:', err);
      setBtnLoad(false);
    }
  }

  async function addStartTeamPlayer(teamplayerteam, teamplayerplayer, avatar) {
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
      console.log('error creating League1:', err);
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

  const showModal = (item, index) => {
    setModalVisible(true);
    setMyLeagueID(item);
    setLeagueIndex(index);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.LeagueContainer}>
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
            {item.playerQuantity} / {item.minPlayer}
          </Text>
          <View>
            {item.isStart ? (
              <TouchableOpacity disabled={true} style={styles.onGoingBtn}>
                <Text style={styles.btnText}>Started</Text>
              </TouchableOpacity>
            ) : (
              <CustomButton
                text={'Start'}
                disabled={btnLoad}
                loading={item.loading}
                styleAdd={styles.startBtn}
                typStyle={styles.btnText}
                onPress={() => showModal(item.id, index)}
              />
            )}
            <TouchableOpacity
              disabled={btnLoad}
              onPress={() => DeleteLeague(item.id)}
              style={styles.deleteBtn}>
              <Text style={styles.btnText}>Delete</Text>
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
              disabled={btnLoad}
              onPress={() => DeleteGame(item.id)}
              style={styles.deleteBtn}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          position: 'absolute',
          top: 45,
          left: 0,
          right: 0,
          zIndex: 12,
        }}>
        {messages.map(message => (
          <Message
            key={message}
            message={message}
            onHide={() => {
              setMessages(messages =>
                messages.filter(currentMessage => currentMessage !== message),
              );
            }}
          />
        ))}
      </View>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>
      <ScrollView
        bounces={false}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.brand}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
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
        <TouchableOpacity
          onPress={() => {
            const message = getRandomMessage();
            setMessages([...messages, message]);
          }}>
          <Text style={{color: 'white'}}>dsgds</Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}> Game List </Text>
        <View>
          {GameData.length !== 0 ? (
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
          onPress={() => navigation.navigate('CreateGameScreen')}
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
          onPress={() => navigation.navigate('CreateTeamScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Team</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        isVisible={modalVisible}
        style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              paddingVertical: hp(1),
              alignSelf: 'center',
            }}>
            Match per day
          </Text>
          <Picker
            itemStyle={{color: 'white'}}
            dropdownIconColor={'white'}
            mode={'dropdown'}
            selectedValue={matchPerDay}
            onValueChange={(itemValue, itemIndex) => setMatchPerDay(itemValue)}>
            {matchAmount.map((item, ind) => (
              <Picker.Item label={item.toString()} value={item} key={ind} />
            ))}
          </Picker>
          <TouchableOpacity
            disabled={btnLoad}
            onPress={() => StartLeague(myLeagueID, leagueIndex, matchPerDay)}>
            <View
              style={{
                backgroundColor: COLORS.green,
                alignSelf: 'center',
                borderRadius: 10,
                padding: 8,
              }}>
              <>
                {btnLoad ? (
                  <ActivityIndicator size={'small'} color={COLORS.brand} />
                ) : (
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: FONTS.brandFont,
                      paddingVertical: hp(1),
                    }}>
                    Start league
                  </Text>
                )}
              </>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
    width: wp(20),
    height: hp(3),
    borderRadius: 50,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  startBtn: {
    width: wp(20),
    height: hp(3),
    borderRadius: 50,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  onGoingBtn: {
    width: wp(20),
    height: hp(3),
    borderRadius: 50,
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
    height: wp(16),
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
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
  LeagueContainer: {
    marginLeft: wp(4),
    marginTop: hp(3),
    borderRadius: 20,
    flexDirection: 'row',
  },
  lottie: {
    width: wp(80),
    height: wp(80),
    alignSelf: 'center',
  },
  lottieText: {
    color: COLORS.brand,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.7),
    alignSelf: 'center',
    marginTop: hp(5),
  },
  modal: {
    width: wp(80),
    backgroundColor: COLORS.brand,
    borderRadius: 10,
    paddingVertical: hp(2),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AdminScreen;
