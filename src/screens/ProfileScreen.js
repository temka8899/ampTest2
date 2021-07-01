import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  FlatList,
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
import {updatePlayer} from '../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import {listPlayers, listSchedules, listTeamPlayers} from '../graphql/queries';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const UselessTextInput = ({value}) => {
  const [text, onChangeText] = React.useState(value);
  return (
    <TextInput
      style={styles1.input}
      onChangeText={onChangeText}
      value={text}
      onPressOut={console.log('onPressOut')}
      editable={false}
    />
  );
};

const styles1 = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    color: 'white',
  },
});

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
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
  const [refreshing, setRefreshing] = React.useState(false);

  const Match = ({item, onPress, user}) => {
    console.log(`item`, item);
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
                        color: item.homeScore == 10 ? 'green' : COLORS.red,
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

  useEffect(() => {
    getXp();
    fetchTeamPlayers();
    _teamNames(userInfo.id);
  }, []);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  // const onRefresh = React.useCallback(() => {
  //   // mat.ref.get
  //   wait(500).then(() => setRefreshing(false));
  // }, []);

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
      const todos = leagueData.data.listTeamPlayers.items;
      setTeamNames(todos);
      console.log('>>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  const getXp = React.useCallback(async () => {
    // let income = true;
    // while (income) {
    //   if (userInfo !== undefined) {
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

  async function fetchTeamPlayers() {
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
  }

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
    // setUserInfo('');
    await AsyncStorage.removeItem('@userID');
    navigation.navigate('Auth');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
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
                    style={[{fontSize: RFPercentage(2.5)}, styles.profileText]}>
                    {userInfo === undefined ? `Player` : `${userInfo.name}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfileScreen')}>
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
          <View style={{borderColor: 'red', borderWidth: 1}}>
            {teamNames.map((_team, ind) => (
              <UselessTextInput key={ind} value={_team.team.name} />
            ))}
            <View style={styles.formContainer}></View>
          </View>
          <View
            style={{
              marginTop: hp(8),
              marginBottom: hp(2),
            }}>
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
              height: hp(85),
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  matchPoint: {
    fontFamily: FONTS.brandFont,
  },
  matchPointContainer: {
    width: wp(29.3),
    height: hp(10.2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  avatar: {
    width: wp(9.6),
    height: wp(9.6),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
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
});

export default Profile;
