import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {listSchedules, listTeamPlayers, listTeams} from '../graphql/queries';
import API, {graphqlOperation} from '@aws-amplify/api';

const Match = ({item, onPress}) => {
  const [Home, setHome] = useState(undefined);
  const [Away, setAway] = useState(undefined);
  const [imgLoad, setImgLoad] = useState(true);

  useEffect(() => {
    getPlayerData();
  }, [getPlayerData]);

  const getPlayerData = React.useCallback(async () => {
    let homePlayers = await fetchTeamPlayers(item.home.id);
    console.log('homePlayers', homePlayers);
    let awayPlayers = await fetchTeamPlayers(item.away.id);
    console.log(`awayPlayers`, awayPlayers);
    setHome(homePlayers);
    setAway(awayPlayers);
    setImgLoad(false);
  }, [item.away.id, item.home.id]);

  async function fetchTeamPlayers(id) {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {teamID: {eq: `${id}`}},
        }),
      );
      const todos = leagueData.data.listTeamPlayers.items;
      console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
      return todos;
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  return (
    <View>
      <TouchableOpacity
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
          <View style={{height: hp(9.35)}}>
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
                color: COLORS.greyText,
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
              width: wp(21.6),
            }}>
            <View
              style={{
                width: wp(21.6),
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

          <View style={{height: hp(9.35)}}>
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
                color: COLORS.greyText,
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
  const [modalVisible, setModalVisible] = useState(false);
  // const [month, setMonth] = useState('June');
  // const [year, setYear] = useState('2021');
  const [dayData, setDayData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const LocalDayData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  let firstDate = new Date();
  let localDay = moment(firstDate).format('ddd');
  firstDate = moment(firstDate).format('MMMM D dddd YY');
  const [localId, setlocalId] = useState(localDay);
  const [selectedId, setSelectedId] = useState(firstDate);

  // let homePlayers = [];
  // let awayPlayers = [];

  useEffect(() => {}, []);

  const getDay = item => {
    setSelectedId(item);
    getSchedule(item);
  };

  async function getSchedule(item) {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            date: {eq: `${item}`},
            leagueID: {eq: `${chooseData.id}`},
          },
        }),
      );
      const schedulePerDay = scheduleData.data.listSchedules.items;
      const sorted = schedulePerDay.sort((a, b) => b.index - a.index);
      console.log(`sorted`, sorted);
      setScheduleData(sorted);
      console.log('Schedule>>>>>>>>>>>>>>', schedulePerDay);
      // return schedulePerDay;
    } catch (err) {
      console.log('error fetching schedulePerDay', err);
    }
  }

  // const matches = ({item}) => {
  //   renderSchedule(item);
  // };

  const startMatch = item => {
    navigation.navigate('CountScreen', {
      match: item,
    });
  };
  function renderSchedule({item}) {
    console.log(`match`, item);
    return (
      <Match
        item={item}
        onPress={() => startMatch(item)}
        selectedId={selectedId}
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
    console.log(`leagueData >>>>>`, leagueData);
    let teamNumber = 0;
    console.log(leagueData.data.listTeams.items.length);
    for (let i = 0; i < leagueData.data.listTeams.items.length; i++) {
      if (leagueData.data.listTeams.items[i].league.id === option.id) {
        teamNumber = teamNumber + 1;
      }
    }
    console.log(`team`, teamNumber);
    return teamNumber;
  }

  // ene league heden odor urgejlehiin avah function

  async function getDuration(number, perDay) {
    console.log(`number get`, number);
    console.log(`perDay get`, perDay);
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

  function getDayData(number, date) {
    console.log(`number`, number);
    console.log(`date`, date);
    let newDate = new Date(date);
    let odor;
    console.log(`newDate`, newDate);
    for (let i = 0; i < number; i++) {
      odor = moment(date).format('dddd');
      if (odor === 'Saturday') {
        date = new Date(newDate.setDate(newDate.getDate() + 2));
      } else if (odor === 'Sunday') {
        date = new Date(newDate.setDate(newDate.getDate() + 1));
      }
      date = moment(date).format('M/D/YYYY');
      console.log(`odor`, odor);
      setDayData(prev => [...prev, date]);
      date = new Date(newDate.setDate(newDate.getDate() + 1));
    }
    console.log(`dayData >>>>>`, dayData);
  }

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = async option => {
    setDayData([]);
    setChooseData(option);
    setLoading(false);
    console.log('League bainuu', option);
    let teamNumber = await getTeamNumber(option);
    let duration = await getDuration(teamNumber, 4);
    getDayData(duration, option.startedDate);
  };

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
            visible={modalVisible}
            nRequestClose={() => changeModalVisible(false)}>
            <LeaguePicker
              changeModalVisible={changeModalVisible}
              setData={setData}
            />
          </Modal>
          <View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: hp(0.5),
              }}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.8),
                  marginRight: wp(1),
                }}>
                {month}
              </Text>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.8),
                  marginLeft: wp(1),
                }}>
                {year}
              </Text>
            </View> */}
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
              <View>
                <Text style={{color: COLORS.white}}>Hooosooon</Text>
              </View>
            ) : (
              <FlatList
                data={scheduleData}
                renderItem={renderSchedule}
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
{
  /* <TouchableOpacity
            style={{margin: wp(10)}}
            onPress={() => navigation.navigate('CountScreen')}>
            <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
              START
            </Text>
          </TouchableOpacity> */
}
const styles = StyleSheet.create({
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
