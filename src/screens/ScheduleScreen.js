import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Modal from 'react-native-modal';
import {AuthContext} from '../../App';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {listSchedules, listTeamPlayers, listTeams} from '../graphql/queries';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useMemo} from 'react';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let firstDate = new Date();

const Match = ({item, onPress, user}) => {
  const [Home, setHome] = useState(undefined);
  const [Away, setAway] = useState(undefined);
  const [imgLoad, setImgLoad] = useState(true);
  const [find, setFind] = useState('');

  useEffect(() => {
    getPlayerData();
  }, [getPlayerData]);

  const getPlayerData = React.useCallback(async () => {
    let homePlayers = await fetchTeamPlayers(item.home.id);
    console.log('homePlayers', homePlayers);
    let awayPlayers = await fetchTeamPlayers(item.away.id);
    console.log(`awayPlayers`, awayPlayers);
    let findHome = await findTeam(user.id, item.home.id);
    let findAway = await findTeam(user.id, item.away.id);
    console.log(`findHome`, findHome);
    console.log(`findAway`, findAway);
    console.log(`item.home.id`, item.home.id);
    console.log(`item.away.id`, item.away.id);
    if (findHome) {
      setFind('home');
    } else if (findAway) {
      setFind('away');
    }
    setHome(homePlayers);
    setAway(awayPlayers);
    setImgLoad(false);
  }, [item.away.id, item.home.id, user.id]);

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
      //
    }
  }
  async function findTeam(id, teamid) {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {playerID: {eq: `${id}`}, teamID: {eq: `${teamid}`}},
        }),
      );
      const todos = leagueData.data.listTeamPlayers.items;
      console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
      if (todos.length === 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }
  if (item.awayScore === 10 || item.homeScore === 10) {
    return (
      <View>
        <View
          onPress={onPress}
          style={{
            width: wp(100),
            height: hp(13.8),
            justifyContent: 'center',
            alignItems: 'center',
            // borderWidth: 1,
            // borderColor: 'red',
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                height: hp(9.35),
                width: wp(39),
                alignItems: 'center',
              }}>
              {Home && (
                <View style={{flexDirection: 'row'}}>
                  {Home.map(_item => (
                    <>
                      {imgLoad ? (
                        <ActivityIndicator
                          style={styles.avatar}
                          size={'small'}
                          color={COLORS.brand}
                        />
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
                style={{
                  color: find === 'home' ? COLORS.brand : COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  marginTop: wp(2.5),
                  textAlign: 'center',
                }}>
                {item.home.name}
              </Text>
            </View>
            <View
              style={{
                heigh: hp(9.35),
                width: wp(20),
              }}>
              <View
                style={{
                  width: wp(20),
                  height: hp(6.65),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.matchPoint,
                    {fontSize: RFPercentage(1.5), color: COLORS.greyText},
                  ]}>
                  End
                </Text>
                {item.homeScore === 10 ? (
                  <View style={styles.matchPointContainer}>
                    <Text style={[styles.matchPoint, {color: COLORS.green}]}>
                      {item.homeScore}
                    </Text>
                    <Text style={[styles.matchPoint, {color: COLORS.red}]}>
                      {item.awayScore}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.matchPointContainer}>
                    <Text style={[styles.matchPoint, {color: COLORS.red}]}>
                      {item.homeScore}
                    </Text>
                    <Text style={[styles.matchPoint, {color: COLORS.green}]}>
                      {item.awayScore}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                height: hp(9.35),
                width: wp(39),
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
                style={{
                  color: find === 'away' ? COLORS.brand : COLORS.greyText,
                  fontFamily: FONTS.brandFont,
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
            height: hp(0.1),
            backgroundColor: COLORS.white,
            width: wp(80),
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        />
      </View>
    );
  } else {
    return (
      <View>
        <TouchableOpacity
          disabled={find === '' ? true : false}
          onPress={onPress}
          style={{
            width: wp(100),
            height: hp(13.8),
            justifyContent: 'center',
            alignItems: 'center',
            // borderWidth: 1,
            // borderColor: 'red',
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                height: hp(9.35),
                width: wp(39),
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
                style={{
                  color: find === 'home' ? COLORS.brand : COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  marginTop: wp(2.5),
                  textAlign: 'center',
                }}>
                {item.home.name}
              </Text>
            </View>
            <View
              style={{
                heigh: hp(9.35),
                width: wp(20),
              }}>
              <View
                style={{
                  width: wp(20),
                  height: hp(6.65),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.brandFont,
                  }}>
                  VS
                </Text>
              </View>
            </View>

            <View
              style={{
                height: hp(9.35),
                width: wp(39),
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
                style={{
                  color: find === 'away' ? COLORS.brand : COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  marginTop: wp(2.5),
                  textAlign: 'center',
                }}>
                {item.away.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: hp(0.1),
            backgroundColor: COLORS.white,
            width: wp(80),
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }
};

const Item = ({item, onPress, selectedId}) => {
  const color = item === selectedId ? COLORS.brand : COLORS.greyText;
  const gang = new Date(item);
  let dayName = moment(gang).format('dddd');
  dayName = dayName.substring(0, 3);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: wp(20),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={[styles.dayText, {color: color}]}>
        {dayName}
        {'\n'}
        {item.split('/')[1]}
      </Text>
    </TouchableOpacity>
  );
};

const LocalDay = ({item, onPress, selectedId}) => {
  const color = item === selectedId ? COLORS.brand : COLORS.greyText;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: wp(20),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={[styles.dayText, {color: color}]}>{item}</Text>
    </TouchableOpacity>
  );
};

const ScheduleScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  // const [month, setMonth] = useState('June');
  // const [year, setYear] = useState('2021');
  const [refreshing, setRefreshing] = React.useState(false);
  const [dayData, setDayData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const LocalDayData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  let localDay = moment(firstDate).format('ddd');
  firstDate = moment(firstDate).format('M/D/YYYY');
  const [localId, setlocalId] = useState(localDay);
  const [selectedId, setSelectedId] = useState(firstDate);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  // let homePlayers = [];
  // let awayPlayers = [];

  useEffect(() => {
    getDay(firstDate);
  }, [getDay]);

  const getDay = React.useCallback(
    (item, option = null) => {
      console.log('item ni i i i i  - -- - ----- -', item);
      setSelectedId(item);
      getSchedule(item, option);
    },
    [getSchedule],
  );

  const onRefresh = React.useCallback(() => {
    getDay(selectedId);
    wait(500).then(() => setRefreshing(false));
  }, [getDay, selectedId]);

  const getSchedule = React.useCallback(
    async (item, option = null) => {
      try {
        console.log('chooseData', chooseData);
        let param = option === null ? chooseData : option;
        const scheduleData = await API.graphql(
          graphqlOperation(listSchedules, {
            filter: {
              date: {eq: item},
              leagueID: {eq: `${param.id}`},
            },
          }),
        );
        const schedulePerDay = scheduleData.data.listSchedules.items;
        const sorted = schedulePerDay.sort((a, b) => b.index - a.index);
        console.log('sorted', sorted);
        setScheduleData(sorted);
        // return schedulePerDay;
      } catch (err) {
        console.log('error fetching schedulePerDay', err);
      }
    },
    [chooseData],
  );

  // const matches = ({item}) => {
  //   renderSchedule(item);
  // };

  const startMatch = item => {
    navigation.navigate('CountScreen', {
      match: item,
    });
  };
  function renderSchedule({item}) {
    console.log('match', item);
    return (
      <Match
        item={item}
        onPress={() => startMatch(item)}
        selectedId={selectedId}
        user={userInfo}
      />
    );
  }
  const renderItem = ({item}) => {
    return (
      <Item item={item} onPress={() => getDay(item)} selectedId={selectedId} />
    );
  };

  const renderLocalDay = ({item}) => {
    return (
      <LocalDay
        item={item}
        onPress={() => setlocalId(item)}
        selectedId={localId}
      />
    );
  };

  async function getTeamNumber(option) {
    const leagueData = await API.graphql(graphqlOperation(listTeams));
    let teamNumber = 0;
    for (let i = 0; i < leagueData.data.listTeams.items.length; i++) {
      if (leagueData.data.listTeams.items[i].league.id === option.id) {
        teamNumber = teamNumber + 1;
      }
    }
    return teamNumber;
  }

  // ene league heden odor urgejlehiin avah function

  async function getDuration(number, perDay) {
    let s = 0,
      count;
    for (var i = 1; i < number; i++) {
      s = s + i;
    }
    count = (s - (s % perDay)) / perDay;
    if (s % perDay !== 0) {
      count++;
    }
    return count;
  }

  const getDayData = React.useCallback(
    (number, date) => {
      let newDate = new Date(date);
      let odor;
      for (let i = 0; i < number; i++) {
        odor = moment(date).format('dddd');
        if (odor === 'Saturday') {
          date = new Date(newDate.setDate(newDate.getDate() + 2));
        } else if (odor === 'Sunday') {
          date = new Date(newDate.setDate(newDate.getDate() + 1));
        }
        date = moment(date).format('M/D/YYYY');
        setDayData(prev => [...prev, date]);
        date = new Date(newDate.setDate(newDate.getDate() + 1));
      }
      console.log('dayData >>>>>', dayData);
    },
    [dayData],
  );

  const changeModalVisible = bool => {
    setModalVisible(bool);
    console.log(`firstDate in getday`, firstDate);
  };

  const setData = React.useCallback(
    async option => {
      setDayData([]);
      console.log(`option`, option);
      await setChooseData(option);
      getDay(firstDate, option);
      setLoading(false);
      let teamNumber = await getTeamNumber(option);
      let duration = await getDuration(teamNumber, 4);
      getDayData(duration, option.startedDate);
    },
    [firstDate, getDay, getDayData],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <SkeletonPlaceholder
          speed={800}
          backgroundColor={'#E1E9EE'}
          highlightColor={'#F2F8FC'}>
          <View>
            <View>
              <View style={{width: wp(100), height: hp(4)}} />
              <View
                style={{width: wp(100), height: hp(3), marginVertical: hp(1)}}
              />
              <View style={{width: wp(100), height: hp(3)}} />
            </View>
            <View style={styles.skeleton1}>
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
            <View style={styles.skeleton2} />
            <View style={styles.skeleton3}>
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
            <View style={styles.skeleton4} />
            <View style={styles.skeleton5}>
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
            <View style={styles.skeleton4} />
            <View style={styles.skeleton7}>
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
            <View style={styles.skeleton4} />
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View>
          <AppBar />
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
            isVisible={modalVisible}
            style={{margin: 0}}
            onRequestClose={() => changeModalVisible(false)}>
            <LeaguePicker
              changeModalVisible={changeModalVisible}
              setData={setData}
            />
          </Modal>
          <View>
            <View>
              {dayData.length === 0 ? (
                <FlatList
                  data={LocalDayData}
                  horizontal
                  renderItem={renderLocalDay}
                  keyExtractor={item => item.id}
                  style={{
                    borderBottomColor: COLORS.brand,
                    borderBottomWidth: 1,
                  }}
                />
              ) : (
                <FlatList
                  data={dayData}
                  horizontal
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  style={{
                    borderBottomColor: COLORS.brand,
                    borderBottomWidth: 1,
                  }}
                />
              )}
            </View>
          </View>
          <View>
            {scheduleData.length === 0 ? (
              <View
                style={{
                  height: hp(65),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={images.logo}
                  style={{
                    width: wp(40),
                    height: hp(30),
                    resizeMode: 'contain',
                    opacity: 0.7,
                  }}
                />
              </View>
            ) : (
              <FlatList
                data={scheduleData}
                renderItem={renderSchedule}
                refreshControl={
                  <RefreshControl
                    tintColor={COLORS.brand}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                keyExtractor={item => item.id}
                style={{
                  height: hp(85),
                }}
              />
            )}
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
    width: wp(21.6),
    height: hp(3.65),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  avatar: {
    width: wp(14.4),
    height: hp(6.65),
  },
  skeleton1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(10),
  },
  skeleton2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(10),
  },
  skeleton3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton4: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeleton5: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton7: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  chooseButton: {
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomColor: COLORS.brand,
    borderWidth: 1,
  },
  dayText: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.7),
    textAlign: 'center',
    lineHeight: hp(2),
  },
  dropButton: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  appBar: {
    borderWidth: 1,
    borderColor: '#F74C11',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: 'PressStart2P-Regular',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default ScheduleScreen;
