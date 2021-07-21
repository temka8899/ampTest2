import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
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

let myValue;

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let firstDate = new Date();

let touch;

const Match = ({item, onPress, user}) => {
  const [Home, setHome] = useState(undefined);
  const [Away, setAway] = useState(undefined);
  const [imgLoad, setImgLoad] = useState(true);
  const [find, setFind] = useState('');
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    getPlayerData();
  }, [getPlayerData]);

  const getPlayerData = React.useCallback(async () => {
    if (item !== null) {
      setImgLoad(false);
    }
    let homeImages1 = item.homeImage.split('[');
    let homeImages2 = homeImages1[1].split(']');
    let homeImages = homeImages2[0].split(', ');
    let awayImages1 = item.awayImage.split('[');
    let awayImages2 = awayImages1[1].split(']');
    let awayImages = awayImages2[0].split(', ');
    setHome(homeImages);
    setAway(awayImages);

    let findHome = await findTeam(user.id, item.homePlayers);
    let findAway = await findTeam(user.id, item.awayPlayers);

    if (findHome) {
      setFind('home');
    } else if (findAway) {
      setFind('away');
    }

    // console.log(
    //   `item.isPlaying find `,
    //   item.isPlaying,
    //   `findHome`,
    //   findHome,
    //   `findAway`,
    //   findAway,
    // );
    if (item.isPlaying) {
      setEnable(true);
    } else {
      if (findHome || findAway) {
        setEnable(false);
      } else {
        setEnable(true);
      }
    }
  }, [item, user.id]);

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
  async function findTeam(id, teamId) {
    let homeId1 = teamId.split('[');
    let homeId2 = homeId1[1].split(']');
    let homeId = homeId2[0].split(', ');
    if (homeId[0] === id) {
      return true;
    } else if (homeId[1] === id) {
      return true;
    } else {
      return false;
    }
  }
  const getVS = () => {
    if (item.playOffIndex === 0 && item.finalsIndex === 0) {
      if (item.awayScore === 0 && item.homeScore === 0) {
        return 'VS';
      } else {
        return 'End';
      }
    } else if (item.playOffIndex !== 0) {
      return 'Game ' + item.playOffIndex.toString();
    } else if (item.finalsIndex !== 0) {
      console.log('final');
      // return 'mai';
      return 'Game ' + item.finalsIndex.toString();
    }
  };

  if (item.awayScore !== 0 || item.homeScore !== 0) {
    return (
      <>
        <View>
          <View
            onPress={onPress}
            style={{
              width: wp(100),
              height: wp(28),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: wp(23),
                  width: wp(39),
                  alignItems: 'center',
                }}>
                {Home && (
                  <View style={{flexDirection: 'row'}}>
                    {Home.map((_item, index) => {
                      return imgLoad ? (
                        <ActivityIndicator
                          key={index}
                          style={styles.avatar}
                          size={'small'}
                          color={COLORS.brand}
                        />
                      ) : (
                        <Image
                          key={index}
                          source={_item}
                          style={styles.avatar}
                        />
                      );
                    })}
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
                  heigh: wp(23),
                  width: wp(20),
                }}>
                <View
                  style={{
                    width: wp(20),
                    height: wp(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={[
                      styles.matchPoint,
                      {fontSize: wp(3), color: COLORS.greyText},
                    ]}>
                    {getVS()}
                  </Text>
                  {item.homeScore > item.awayScore ? (
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
                  height: wp(23),
                  width: wp(39),
                  alignItems: 'center',
                }}>
                {Away && (
                  <View style={{flexDirection: 'row'}}>
                    {Away.map((_item, index) => {
                      return imgLoad ? (
                        <ActivityIndicator
                          key={index}
                          style={styles.avatar}
                          size={'small'}
                          color={COLORS.brand}
                        />
                      ) : (
                        <Image
                          key={index}
                          source={_item}
                          style={styles.avatar}
                        />
                      );
                    })}
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
              height: wp(0.2),
              backgroundColor: COLORS.greyText,
              width: wp(88),
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          />
        </View>
      </>
    );
  } else {
    return (
      <View>
        <TouchableOpacity
          disabled={enable}
          onPress={onPress}
          style={{
            width: wp(100),
            height: wp(28),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                height: wp(23),
                width: wp(39),
                alignItems: 'center',
              }}>
              {Home && (
                <View style={{flexDirection: 'row'}}>
                  {Home.map((_item, index) => {
                    return imgLoad ? (
                      <ActivityIndicator
                        key={index}
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image key={index} source={_item} style={styles.avatar} />
                    );
                  })}
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
                heigh: wp(23),
                width: wp(20),
              }}>
              <View
                style={{
                  width: wp(20),
                  height: wp(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {item.isPlaying ? (
                  <Text
                    style={{
                      color: COLORS.greyText,
                      fontFamily: FONTS.brandFont,
                      fontSize: wp(2.5),
                    }}>
                    In Match
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: FONTS.brandFont,
                      fontSize: wp(3.2),
                    }}>
                    {getVS()}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                height: wp(23),
                width: wp(39),
                alignItems: 'center',
              }}>
              {Away && (
                <View style={{flexDirection: 'row'}}>
                  {Away.map((_item, index) => {
                    return imgLoad ? (
                      <ActivityIndicator
                        key={index}
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image key={index} source={_item} style={styles.avatar} />
                    );
                  })}
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
            height: wp(0.2),
            backgroundColor: COLORS.greyText,
            width: wp(88),
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
        height: wp(13),
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
        height: wp(13),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={[styles.dayText, {color: color}]}>{item}</Text>
    </TouchableOpacity>
  );
};

const ScheduleScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [dayData, setDayData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const LocalDayData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  let localDay = moment(firstDate).format('ddd');
  firstDate = moment(firstDate).format('MM/D/YY');
  const [localId, setlocalId] = useState(localDay);
  const [selectedId, setSelectedId] = useState(firstDate);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);

  useEffect(() => {
    getDay(selectedId);
    onRefresh();
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, [getDay, onRefresh, selectedId, navigation]);

  const getDay = React.useCallback(
    (item, option = null) => {
      setSelectedId(item);
      getSchedule(item, option);
    },
    [getSchedule],
  );

  const onRefresh = React.useCallback(() => {
    getDay(selectedId);
    wait(500).then(() => setRefreshing(false));
  }, [getDay, selectedId]);

  const getSchedule = React.useCallback(async (item, option = null) => {
    let date = new Date(item);
    date = moment(date).format('MM/D/YY');
    try {
      let param = option === null ? myValue : option;
      // console.log(`param`, param);
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            date: {eq: date},
            leagueID: {eq: `${param.id}`},
          },
        }),
      );

      const schedulePerDay = scheduleData.data.listSchedules.items;
      const sorted = schedulePerDay.sort((a, b) => a.index - b.index);
      setScheduleData(sorted);
      // console.log('sorted :>> ', sorted);
      // return schedulePerDay;
    } catch (err) {
      console.log('error fetching schedulePerDay', err);
    }
  }, []);

  const startMatch = item => {
    if (item.gameID === '76b343a7-74aa-4dd9-bcfb-68328b83e558') {
      navigation.navigate('CountScreen', {
        match: item,
      });
    } else {
      navigation.navigate('FormInterface', {
        match: item,
      });
    }
  };
  function renderSchedule({item}) {
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

    //Playoff, finals iin 3 odor nemeh
    count = count + 3;
    return count;
  }

  const getDayData = React.useCallback((number, date) => {
    date = new Date(date);
    date = moment(date).format('MM/D/YY');
    //console.log(`ehniiii date`, date);
    let odor;
    for (let i = 0; i < number; i++) {
      odor = moment(date).format('dddd');
      if (odor === 'Saturday') {
        date = moment(date).add(2, 'day');
      } else if (odor === 'Sunday') {
        date = moment(date).add(1, 'day');
      }
      date = moment(date).format('MM/D/YY');
      setDayData(prev => [...prev, date]);
      date = moment(date).add(1, 'day');
    }
  }, []);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = React.useCallback(
    async option => {
      // let count = true;
      // while (count) {
      setDayData([]);
      myValue = option;
      // console.log(`myValue`, myValue);
      await setChooseData(option);
      //console.log(`firstDate`, firstDate);
      getDay(firstDate, option);
      setLoading(false);
      let teamNumber = await getTeamNumber(option);
      let duration = await getDuration(teamNumber, 4);
      await getDayData(duration, option.startedDate);
      console.log(`dayData 1`, dayData);
      if (dayData.length !== 0) {
        setDayData([]);
        await getDayData(duration, option.startedDate);
      }
      console.log(`dayData 2`, dayData);
    },
    [dayData, getDay, getDayData],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.brand}}>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
        <StatusBar barStyle="light-content" backgroundColor="#F74C11" />
        {isLoading ? (
          <SkeletonPlaceholder
            speed={800}
            backgroundColor={COLORS.count}
            highlightColor={'gray'}>
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
                {chooseData === undefined ? 'Select' : chooseData.game.name}
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
                <View>
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
                      height: hp(69),
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  matchPoint: {
    fontFamily: FONTS.brandFont,
  },
  matchPointContainer: {
    width: wp(21.6),
    height: wp(8),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  avatar: {
    resizeMode: 'contain',
    width: wp(14.4),
    height: wp(14.4),
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
    height: wp(13),
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
    lineHeight: wp(4),
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
  bracketContainer: {
    borderWidth: 1,
    width: wp(96),
    height: wp(117.6),
    flexDirection: 'row',
  },

  sectionContainer: {
    height: wp(117.6),
    width: wp(23),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  teamContainer: {
    width: wp(23),
    height: wp(17.3),
    paddingVertical: wp(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainerFinal: {
    width: wp(23),
    height: wp(17.3),
    paddingVertical: wp(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  space: {
    width: wp(23),
    height: wp(8),
  },
  lineContainer: {
    height: wp(117.6),
    width: wp(18),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  line1agrey: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(4.26),
  },
  line1bgreen: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(17.06),
  },
  line1agreyBottom: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(9.6),
  },
  line1bgreenBottom: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(22.13),
  },
  section2: {
    height: wp(117.6),
    width: wp(23),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  sectionContainerFinal: {
    height: wp(117.6),
    width: wp(32),
    borderWidth: 1,
    flexDirection: 'row',
  },
});

export default ScheduleScreen;
