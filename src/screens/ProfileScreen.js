import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  FlatList,
  Animated,
  TextInput,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {AuthContext} from '../../App';
import {hp, wp} from '../constants/theme';
import CircleXp from '../components/CircleXp';
import {COLORS, FONTS, icons} from '../constants';
import {LogoutModal} from '../components/LogoutModal';
import LeaguePicker from '../components/LeaguePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RFPercentage} from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {updatePlayer, updateTeam} from '../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import {
  listLeagues,
  listPlayers,
  listSchedules,
  listTeamPlayers,
} from '../graphql/queries';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let newTeamName;
const getRandomMessage = () => {
  const number = Math.trunc(Math.random() * 10000);
  return 'Random message ' + number;
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
        margin: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 4,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
      }}>
      <Text>{props.message}</Text>
    </Animated.View>
  );
};

const Profile = ({navigation}) => {
  const [isLoading, setLoading] = React.useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [LogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState();
  const [xpPercent, setXpPercent] = useState('');
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  // const [xpCount, setXpCount] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const [leagueNames, setLeagueNames] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [messages, setMessages] = useState([]);

  const Match = ({item, onPress, user}) => {
    //console.log(`item`, item);
    const [Home, setHome] = useState(undefined);
    const [Away, setAway] = useState(undefined);
    const [imgLoad, setImgLoad] = useState(true);
    const [find, setFind] = useState('');
    const [win, setWin] = useState(false);

    useEffect(() => {
      getPlayerData();
    }, [getPlayerData]);

    const getPlayerData = React.useCallback(async () => {
      let homePlayers = await fetchTeamPlayers(item.home.id);
      let awayPlayers = await fetchTeamPlayers(item.away.id);
      let finded = await findTeam(user.id);
      // setMyTeam(finded);
      if (item.home.id === finded[0].teamID) {
        setFind('home');
      } else if (item.away.id === finded[0].teamID) {
        setFind('away');
      }
      if (item.awayScore === 10) {
        if (find === 'away') {
          setWin(true);
        } else {
          setWin(false);
        }
      } else {
        if (find === 'home') {
          setWin(true);
        } else {
          setWin(false);
        }
      }
      setHome(homePlayers);
      setAway(awayPlayers);
      setImgLoad(false);
    }, [find, item.away.id, item.awayScore, item.home.id, user.id]);

    async function fetchTeamPlayers(id) {
      try {
        const leagueData = await API.graphql(
          graphqlOperation(listTeamPlayers, {
            filter: {teamID: {eq: id}},
          }),
        );
        const todos = leagueData.data.listTeamPlayers.items;
        return todos;
      } catch (err) {
        console.log('error fetching todos', err);
      }
    }
    async function findTeam(id) {
      try {
        const leagueData = await API.graphql(
          graphqlOperation(listTeamPlayers, {
            filter: {playerID: {eq: `${id}`}},
          }),
        );
        const todos = leagueData.data.listTeamPlayers.items;
        return todos;
      } catch (err) {
        console.log('error fetching todos', err);
      }
    }
    if ((item.awayScore === 10 || item.homeScore === 10) && find !== '') {
      return (
        <View>
          <View
            style={{
              width: wp(100),
              height: wp(28),
              justifyContent: 'center',
              alignItems: 'center',
              // borderWidth: 1,
              // borderColor: 'red',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: wp(22),
                  width: wp(28.13),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Home && (
                  <View style={{flexDirection: 'row'}}>
                    {Home.map(_item => (
                      <>
                        {imgLoad ? (
                          <ActivityIndicator size={'small'} color={'red'} />
                        ) : (
                          <Image
                            source={_item.player.avatar}
                            style={styles.avatar}
                          />
                        )}
                      </>
                    ))}
                  </View>
                )}
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    color: find === 'home' ? COLORS.brand : COLORS.greyText,
                    fontFamily: FONTS.brandFont,
                    width: wp(28.13),
                    marginTop: wp(2.5),
                    textAlign: 'center',
                  }}>
                  {item.home.name}
                </Text>
              </View>
              <View style={styles.matchPointContainer}>
                <View
                  style={{
                    width: wp(8),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.matchPoint,
                      {
                        color: item.homeScore == 10 ? COLORS.green : COLORS.red,
                      },
                    ]}>
                    {item.homeScore}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.matchPoint,
                    {
                      color: COLORS.white,
                      fontSize: RFPercentage(1.6),
                    },
                  ]}>
                  -
                </Text>

                <View
                  style={{
                    width: wp(8),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.matchPoint,
                      {color: item.awayScore == 10 ? COLORS.green : COLORS.red},
                    ]}>
                    {item.awayScore}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: wp(22),
                  width: wp(28.13),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Away && (
                  <View style={{flexDirection: 'row'}}>
                    {Away.map(_item => (
                      <>
                        {imgLoad ? (
                          <ActivityIndicator size={'small'} color={'red'} />
                        ) : (
                          <Image
                            source={_item.player.avatar}
                            style={styles.avatar}
                          />
                        )}
                      </>
                    ))}
                  </View>
                )}
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    color: find === 'away' ? COLORS.brand : COLORS.greyText,
                    fontFamily: FONTS.brandFont,
                    width: wp(28.13),
                    marginTop: wp(2.5),
                    textAlign: 'center',
                  }}>
                  {item.away.name}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: wp(0.2),
              backgroundColor: COLORS.greyText,
              width: wp(83),
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          />
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  const Names = ({item, onPress, user}) => {
    const [LName1, setLName] = useState('');
    const [readyChange, setReadyChange] = useState(false);

    useEffect(() => {
      getLName(item.team.leagueID);
    }, [getLName, item]);

    const getLName = React.useCallback(
      async id => {
        const LName = await _fetchleague(item.team.leagueID);
        await setLName(LName);
      },
      [item.team.leagueID],
    );

    async function _fetchleague(id) {
      try {
        const leagueData = await API.graphql(
          graphqlOperation(listLeagues, {
            filter: {id: {eq: id}},
          }),
        );
        const todos = leagueData.data.listLeagues.items;

        return todos[0].game.name.toString();
      } catch (err) {
        console.log('error fetching todos', err);
      }
    }
    const changeTeamName = React.useCallback(async () => {
      console.log(`newTeamName`, newTeamName);
      try {
        await API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              //Team id
              id: item.teamID,
              name: newTeamName,
            },
          }),
        );
        console.log('Team ner soligdloo');
        setReadyChange(false);
        onRefresh();
      } catch (err) {
        console.log('error updating Teams', err);
      }
    }, []);
    return (
      <TouchableOpacity
        onPress={() => setReadyChange(true)}
        style={{
          width: wp(35),
          alignItems: 'center',
          marginLeft: wp(3),
        }}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: COLORS.brand,
            fontFamily: FONTS.brandFont,
            fontSize: wp(3.5),
            marginTop: wp(2),
          }}>
          {LName1}
        </Text>
        {readyChange ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              // editable={true}
              style={styles.input}
              autoCapitalize={false}
              autoCompleteType={false}
              placeholder={item.team.name}
              maxLength={20}
              onChangeText={text => (newTeamName = text)}
              placeholderTextColor={COLORS.purpleText}
            />
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: wp(8),
              width: wp(35),
            }}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                marginVertical: wp(2),
                fontSize: wp(3),
              }}>
              {item.team.name}
            </Text>
          </View>
        )}

        {readyChange ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                width: wp(20),
                height: wp(8),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: wp(1),
                backgroundColor: COLORS.brand,
                marginRight: wp(1),
              }}
              onPress={() => changeTeamName()}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  fontSize: wp(2.8),
                }}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReadyChange(false)}
              style={{
                width: wp(8),
                height: wp(8),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: wp(1),
                borderWidth: 2,
                borderColor: COLORS.brand,
              }}>
              <Image
                source={icons.Xbutton}
                style={{width: wp(4), height: wp(4)}}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    getXp();
    fetchTeamPlayers();
    _teamNames(userInfo.id);
  }, []);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };
  const onRefresh = React.useCallback(() => {
    getXp();
    fetchTeamPlayers();
    _teamNames(userInfo.id);
    wait(500).then(() => setRefreshing(false));
  }, [fetchTeamPlayers, getXp, userInfo.id]);

  const setData = React.useCallback(async option => {
    setChooseData(option);
    let Data = await getSchedule(option);
    console.log('hsitrory data :>> ', Data);
    setScheduleData(Data);
  }, []);

  async function getSchedule(item) {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            leagueID: {eq: item.id},
          },
        }),
      );
      const matches = scheduleData.data.listSchedules.items;

      return matches;
      // return schedulePerDay;
    } catch (err) {
      console.log('error fetching schedulePerDay', err);
    }
  }

  async function _teamNames(id) {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {playerID: {eq: id}},
        }),
      );
      const names = leagueData.data.listTeamPlayers.items;
      setTeamNames(names);

      console.log('>>>>>>>>>>>>>>>', names);
    } catch (err) {
      console.log('error fetching names', err);
    }
  }

  const getXp = React.useCallback(async () => {
    let count = true;
    let value = userInfo.xp;
    let diff = 0;
    let level = userInfo.level;
    while (count) {
      if (value < 50 * level) {
        count = false;
        diff = value;
      } else {
        value -= level * 50;
        level++;
      }
    }
    let max = level * 50;
    let xp = diff;
    updateLevel(xp, level);

    setLoading(false);

    setXpPercent((xp * 100) / max);
  }, []);

  const updateLevel = React.useCallback(
    async (xp, level) => {
      // const level = await fetchPlayer(userInfo.id);
      const user = await Auth.currentUserInfo();
      try {
        const temp = await API.graphql(
          graphqlOperation(updatePlayer, {
            input: {
              id: userInfo.id,
              level,
              xp,
            },
          }),
        );
      } catch (err) {
        console.log('error updating Player: ', err);
      }
      findUser(user);
    },
    [findUser, userInfo.id],
  );

  const fetchTeamPlayers = React.useCallback(async () => {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {
            playerID: {eq: `${userInfo.id}`},
          },
        }),
      );
      const todos = leagueData.data.listTeamPlayers.items;
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }, [userInfo.id]);

  function renderSchedule({item}) {
    return <Match item={item} user={userInfo} />;
  }
  const findUser = React.useCallback(
    async user => {
      const playerData = await API.graphql(graphqlOperation(listPlayers));
      let finded = playerData.data.listPlayers.items.find((item, index) => {
        if (user.username === item.c_id) {
          return item;
        }
      });
      setUserInfo(finded);
    },
    [setUserInfo],
  );

  const modalHide = () => {
    setLogoutModalVisible(false);
  };
  const logout = async () => {
    setLogoutModalVisible(false);
    await AsyncStorage.removeItem('@userID');
    wait(1000).then(() => navigation.navigate('Auth'));
  };

  const getMai = () => {
    // console.log(`leagueNames`, leagueNames);
    console.log(`teamNames`, teamNames);
    // Lnames = leagueNames;
  };

  function renderName({item}) {
    return (
      <Names
        item={item}
        // onPress={() => setlocalId(item)}
        // selectedId={localId}
      />
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={COLORS.brand}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <StatusBar barStyle="light-content" />
        {isLoading ? (
          <SkeletonPlaceholder
            speed={800}
            backgroundColor={COLORS.count}
            highlightColor={'gray'}>
            <View>
              <View style={{paddingHorizontal: hp(2)}}>
                <View style={styles.skeleton1} />
              </View>
              <View style={styles.skeleton2}>
                <View style={styles.skeleton2_1} />
                <View style={styles.skeleton2_2}>
                  <View style={styles.skeleton2_2_1} />
                  <View style={styles.skeleton2_2_2} />
                </View>
              </View>
              <View style={styles.skeleton3} />
              <View style={styles.skeleton4}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
              </View>
              <View style={styles.skeleton5} />
              <View style={styles.skeleton6}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
              </View>
              <View style={styles.skeleton7} />
              <View style={styles.skeleton8}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                  />
                  <View style={{width: wp(15), height: wp(15)}} />
                </View>
              </View>
              <View style={styles.skeleton9} />
            </View>
          </SkeletonPlaceholder>
        ) : (
          <View>
            {getMai()}
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
                      messages.filter(
                        currentMessage => currentMessage !== message,
                      ),
                    );
                  }}
                />
              ))}
            </View>
            <View style={styles.header}>
              <View>
                <>
                  {userInfo.admin && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AdminScreen')}>
                      <Image source={icons.plus} style={styles.plusBtn} />
                    </TouchableOpacity>
                  )}
                </>
              </View>
              <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
                <Image source={icons.logOut} style={styles.plusBtn} />
              </TouchableOpacity>
            </View>
            <View style={styles.subContainer}>
              <View style={styles.subSubContainer}>
                <CircleXp fill={xpPercent} />
                <View style={styles.statusMain}>
                  <View style={styles.statusSub}>
                    <Text
                      style={[
                        {fontSize: RFPercentage(2.5)},
                        styles.profileText,
                      ]}>
                      {userInfo === undefined ? `Player` : `${userInfo.name}`}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditScreen')}>
                      <Image source={icons.editBtn} style={styles.editButton} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.levelContainer}>
                    <Text
                      style={[{fontSize: RFPercentage(2)}, styles.profileText]}>
                      Level
                    </Text>
                    <Text style={styles.level}>
                      {userInfo === undefined ? '1' : `${userInfo.level}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.7),
                marginLeft: wp(3),
                marginBottom: wp(3),
                marginTop: wp(5),
              }}>
              YOUR TEAMS
            </Text>

            <FlatList
              data={teamNames}
              horizontal
              renderItem={renderName}
              keyExtractor={item => item}
            />
            <View
              style={{
                marginTop: wp(5),
                marginBottom: wp(3),
              }}>
              <TouchableOpacity
                onPress={() => {
                  const message = getRandomMessage();
                  setMessages([...messages, message]);
                }}>
                <Text>dsgds</Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.7),
                  marginLeft: wp(3),
                }}>
                RECENT MATCHES
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => changeModalVisible(true)}
              style={styles.chooseButton}>
              <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
                {chooseData === '' ? 'Select' : chooseData.game.name}
              </Text>
              <Image source={icons.drop} style={styles.dropButton} />
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              nRequestClose={() => changeModalVisible(false)}>
              <LeaguePicker
                changeModalVisible={changeModalVisible}
                setData={setData}
              />
            </Modal>
            <FlatList
              data={scheduleData}
              renderItem={renderSchedule}
              keyExtractor={item => item.id}
              style={{
                height: wp(75),
              }}
            />
            <View>
              <LogoutModal
                visible={LogoutModalVisible}
                modalHide={modalHide}
                logout={logout}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  matchPoint: {
    fontFamily: FONTS.brandFont,
  },
  matchPointContainer: {
    width: wp(29.3),
    height: wp(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  avatar: {
    width: wp(9.6),
    height: wp(9.6),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    width: wp(100),
    height: wp(14),
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    width: wp(100),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  subSubContainer: {
    width: wp(100),
    height: wp(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusMain: {
    flexDirection: 'column',
    marginLeft: wp(3),
  },
  statusSub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelContainer: {
    marginTop: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: wp(7),
    height: wp(7),
    resizeMode: 'contain',
    marginLeft: wp(2),
  },
  dropButton: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  skeleton1: {
    alignSelf: 'flex-end',
    width: wp(10),
    height: hp(8),
  },
  skeleton2: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  skeleton2_1: {
    width: wp(30),
    height: wp(30),
    borderRadius: 60,
    marginRight: wp(4),
  },
  skeleton2_2: {
    justifyContent: 'center',
  },
  skeleton2_2_1: {
    width: wp(40),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton2_2_2: {
    marginTop: hp(1),
    width: wp(30),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton3: {
    alignSelf: 'center',
    marginTop: hp(20),
    width: wp(90),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton4: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton5: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeleton6: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton7: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeleton8: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton9: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  chooseButton: {
    height: wp(13),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomColor: COLORS.brand,
    borderTopColor: COLORS.brand,
    borderWidth: 1,
  },
  level: {
    fontFamily: FONTS.brandFont,
    color: COLORS.brand,
    fontSize: RFPercentage(2),
    marginLeft: wp(2),
  },
  profileText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.white,
  },
  input: {
    height: 40,
    margin: 12,
  },
  plusBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: wp(7.4),
    borderColor: 'white',
  },
  input: {
    height: wp(8),
    width: wp(35),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: wp(3),
    padding: 0,
    textAlign: 'center',
  },
});

export default Profile;
