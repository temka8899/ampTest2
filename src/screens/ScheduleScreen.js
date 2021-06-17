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
} from 'react-native';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {listTeams} from '../graphql/queries';
import API, {graphqlOperation} from '@aws-amplify/api';

const ScheduleScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseDay, setChooseDay] = useState('1');
  const [month, setMonth] = useState('June');
  const [year, setYear] = useState('2021');
  const [duration, setDuration] = useState();
  const dayData = [];
  useEffect(() => {}, []);

  async function getTeamNumber() {
    const leagueData = await API.graphql(graphqlOperation(listTeams));
    console.log(`leagueData >>>>>`, leagueData);
    let teamNumber = 0;
    for (let i = 0; i < leagueData.data.listTeams.items.length; i++) {
      if (leagueData.data.listTeams.items[i].league.id === chooseData.id) {
        teamNumber = teamNumber + 1;
      }
    }
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
    console.log(`newDate`, newDate);
    for (let i = 0; i < number; i++) {
      dayData.push(
        new Date(newDate.setDate(newDate.getDate() + 1)).toString('MMMM yyyy'),
      );
      // date = new Date(date).getDay() + 1;
      // date = moment(date).add(1, 'days');
    }
    console.log(`dayData >>>>>`, dayData);
  }

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const onSelectedDay = d => {
    console.log(d);
  };

  const setData = async option => {
    setChooseData(option);
    setLoading(false);
    console.log('League bainuu', option);
    // console.log(`hezee ehlesen`, option.startedDate);
    // const gang = option.startedDate;
    // var tomorrow = moment(gang).add(1, 'days');
    // console.log(`hezee duusah`, tomorrow);
    // var day = moment(`${option.startedDate}`);
    // var date = moment(`${option.startedDate}`).format('dddd');
    // var garag = moment().format('[Today is] dddd');
    // console.log(`date`, date);
    // console.log(`day`, day);
    // console.log(`garag`, garag);
    let teamNumber = await getTeamNumber();
    // setDuration(getDuration(teamNumber, option.perDay));
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
            <View
              style={{
                flexDirection: 'row',
                borderColor: 'red',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
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
            </View>
            <View></View>
          </View>
          {/* <View style={styles.daysContainer}>
            <TouchableOpacity onPress={() => setChooseDay(1)}>
              <Text
                style={[
                  {color: chooseDay === 1 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Mon
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(2)}>
              <Text
                style={[
                  {color: chooseDay === 2 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Tue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(3)}>
              <Text
                style={[
                  {color: chooseDay === 3 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Wed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(4)}>
              <Text
                style={[
                  {color: chooseDay === 4 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Thu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(5)}>
              <Text
                style={[
                  {color: chooseDay === 5 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Fri
              </Text>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            style={{margin: wp(10)}}
            onPress={() => navigation.navigate('CountScreen')}>
            <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
              START
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  dropButton: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  daysContainer: {
    width: wp(100),
    height: hp(6),
    borderWidth: 1,
    borderBottomColor: COLORS.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dayBtn: {
    fontFamily: FONTS.brandFont,
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
