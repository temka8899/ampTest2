import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  ScrollView,
} from 'react-native';

import {AuthContext} from '../../App';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import {listSchedules, listTeams} from '../graphql/queries';
import {graphqlOperation} from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let confA;
let confB;

// let confBhomeImage;
// let confBawayImage;

// let confBhomeName;
// let confBawayName;

let champImage;
let champName;

const StandingsScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [find, setFind] = useState('');
  const [PlayerInfo, setPlayerInfo] = useState([]);
  const [logoLoad, setLogoLoad] = useState();
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [imgLoad, setImgLoad] = useState(true);

  const [finalAImage, setFinalAImage] = useState('');
  const [finalAName, setFinalAName] = useState('');
  const [finalBImage, setFinalBImage] = useState('');
  const [finalBName, setFinalBName] = useState('');

  const [confAhomeImage, setConfAhomeImage] = useState('');
  const [confAhomeName, setConfAhomeName] = useState('');
  const [confAawayImage, setConfAawayImage] = useState('');
  const [confAawayName, setConfAawayName] = useState('');

  const [confBhomeImage, setConfBhomeImage] = useState('');
  const [confBhomeName, setConfBhomeName] = useState('');
  const [confBawayImage, setConfBawayImage] = useState('');
  const [confBawayName, setConfBawayName] = useState('');

  const [champImage, setChampImage] = useState('');
  const [champName, setChampName] = useState('');

  // const [confA, setConfA] = useState();
  // const [confB, setConfB] = useState();

  const [win1, setWin1] = useState(0);
  const [win2, setWin2] = useState(0);
  const [win3, setWin3] = useState(0);
  const [win4, setWin4] = useState(0);
  const [final1, setFinal1] = useState(0);
  const [final2, setFinal2] = useState(0);
  const [tempOption, setTempOption] = useState();

  const rotateValue = useState(new Animated.Value(0))[0];
  const RotateData = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  Animated.loop(
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]),
    {
      iterations: true,
    },
  ).start();

  const Standings = ({item, index, user}) => {
    let homeImages1 = item.image.split('[');
    let homeImages2 = homeImages1[1].split(']');
    let homeImages = homeImages2[0].split(', ');

    let standingPlayers1 = item.standingPlayers.split('[');
    let standingPlayers2 = standingPlayers1[1].split(']');
    let standingPlayers = standingPlayers2[0].split(', ');

    return (
      <View>
        <View style={styles.standingStyle}>
          <Text
            style={{
              fontFamily: FONTS.brandFont,
              color: COLORS.white,
            }}>
            {index + 1}
          </Text>
          <View style={{flexDirection: 'row', marginLeft: wp(4)}}>
            <Image source={homeImages[0]} style={styles.avatar} />
            <Image source={homeImages[1]} style={styles.avatar} />
          </View>
          {standingPlayers[0] == userInfo.id ||
          standingPlayers[1] == userInfo.id ? (
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                color: COLORS.brand,
                marginLeft: wp(5),
              }}>
              {item.name}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                color: COLORS.white,
                marginLeft: wp(5),
              }}>
              {item.name}
            </Text>
          )}
          <View
            style={{
              position: 'absolute',
              right: 0,
            }}>
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                color: COLORS.green,
              }}>
              {item.win}
              <Text
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.white,
                }}>
                {'-'}
              </Text>
              <Text style={{color: COLORS.red}}>{item.lose}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return <Standings item={item} index={index} user={userInfo} />;
  };

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const onRefresh = React.useCallback(() => {
    setData(tempOption);
    wait(500).then(() => setRefreshing(false));
  }, [setData, tempOption]);

  const setData = React.useCallback(
    async option => {
      await setChooseData(option);
      await fetchTeam(option.id);
      setTempOption(option);
      if (option.isPlayoff === true) {
        await fetchPlayoffTeam(option.id);
        let names = await fetchPlayoffSchedule(option.id);

        // setImgLoad(true);
        let homeImages1 = confA[0].homeImage.split('[');
        let homeImages2 = homeImages1[1].split(']');
        let homeImages = homeImages2[0].split(', ');
        let awayImages1 = confA[0].awayImage.split('[');
        let awayImages2 = awayImages1[1].split(']');
        let awayImages = awayImages2[0].split(', ');
        let AhomeImages1 = confB[0].homeImage.split('[');
        let AhomeImages2 = AhomeImages1[1].split(']');
        let AhomeImages = AhomeImages2[0].split(', ');
        let AawayImages1 = confB[0].awayImage.split('[');
        let AawayImages2 = AawayImages1[1].split(']');
        let AawayImages = AawayImages2[0].split(', ');

        setConfAhomeImage(homeImages);
        setConfAawayImage(awayImages);
        setConfBhomeImage(AhomeImages);
        setConfBawayImage(AawayImages);
        let image = [homeImages, awayImages, AhomeImages, AawayImages];
        await initWin();
        // let win1 = 0;
        // let win2 = 0;
        // let win3 = 0;
        // let win4 = 0;
        // setImgLoad(false);

        // console.log(`confAhomeImage`, confAhomeImage);
        // console.log(`confAawayImage`, confAawayImage);
        // console.log(`confBhomeImage`, confBhomeImage);
        // console.log(`confBawayImage`, confBawayImage);

        let param = await getWinner();
        console.log(`param`, param);
        let isfinal = initFinal(param, image, names);
        if (isfinal) {
          let finalMatches = await fetchFinalSchedule(option.id);
          let finalPoint = await getFinalWinner(finalMatches);
          if (finalPoint[0] == 2 || finalPoint[1] == 2) {
            getChamp(finalPoint);
          }
        }

        // initChamp();
      }
      // console.log(`confA`, confA);
      // console.log(`confB`, confB);
    },
    [fetchPlayoffSchedule, fetchPlayoffTeam, fetchTeam, getWinner, initFinal],
  );
  async function initWin() {
    await setWin1(0);
    await setWin2(0);
    await setWin3(0);
    await setWin4(0);
    await setFinal1(0);
    await setFinal2(0);
  }
  // const initChamp = React.useCallback(() => {}, []);
  const getChamp = React.useCallback(finalPoint => {
    if (finalPoint[0] == 2) {
      setChampImage(finalAImage);
      setChampName(finalAName);
    } else {
      setChampImage(finalBImage);
      setChampName(finalBName);
    }
  }, []);

  const initFinal = React.useCallback((param, image, names) => {
    // console.log(`win1>>`, win1);
    // console.log(`win2>>`, win2);
    // console.log(`win3>>`, win3);
    // console.log(`win4>>`, win4);
    console.log('init final ehellee');
    // finalAImage = null;
    // finalAName = null;
    // finalBImage = null;
    // finalBName = null;

    if (param[0] === 2 || param[1] === 2) {
      if (param[0] === 2) {
        console.log('final a d set hiilee');
        setFinalAImage(image[0]);
        setFinalAName(names[0]);
        // finalAImage = confAhomeImage;
        // finalAName = confAhomeName;
      } else {
        console.log('final a d set hiilee');
        setFinalAImage(image[1]);
        setFinalAName(names[1]);
        // finalAImage = confAawayImage;
        // finalAName = confAawayName;
      }
      if (param[2] === 2) {
        setFinalBImage(image[2]);
        setFinalBName(names[2]);
        // finalBImage = confBhomeImage;
        // finalBName = confBhomeName;
      } else {
        setFinalBImage(image[3]);
        setFinalBName(names[3]);
        // finalBImage = confBawayImage;
        // finalBName = confBawayName;
      }
      return true;
    } else {
      return false;
    }
    console.log(`finalAImage`, finalAImage);
    console.log(`finalAName`, finalAName);
    console.log(`finalBImage`, finalBImage);
    console.log(`finalBName`, finalBName);
  }, []);

  const getFinalWinner = React.useCallback(async matches => {
    let win1 = 0;
    let win2 = 0;
    console.log('final ajiiljiin');
    for (let i = 0; i < matches.length; i++) {
      if (!(matches[i].homeScore === 0 && matches[i].awayScore === 0)) {
        if (matches[i].homeScore > matches[i].awayScore) {
          // const temp = win1 + 1;
          // setWin1(temp);
          win1++;
        } else {
          // const temp = win2 + 1;
          // setWin2(temp);
          win2++;
        }
      }
    }
    console.log(`final win1`, win1);
    console.log(`final win2`, win2);
    setFinal1(win1);
    setFinal2(win2);
    return [win1, win2];

    // console.log(`win3`, win3);
    // console.log(`win4`, win4);
  }, []);

  const getWinner = React.useCallback(async () => {
    let win1 = 0;
    let win2 = 0;
    let win3 = 0;
    let win4 = 0;
    // console.log(`win1>>`, win1);
    // console.log(`win2>>`, win2);
    // console.log(`win3>>`, win3);
    // console.log(`win4>>`, win4);
    console.log('ajiiljiin');
    for (let i = 0; i < confA.length; i++) {
      if (!(confA[i].homeScore === 0 && confA[i].awayScore === 0)) {
        if (confA[i].homeScore > confA[i].awayScore) {
          // const temp = win1 + 1;
          // setWin1(temp);
          win1++;
        } else {
          // const temp = win2 + 1;
          // setWin2(temp);
          win2++;
        }
      }
      console.log('get winner duuslaa');
    }
    for (let i = 0; i < confB.length; i++) {
      if (!(confB[i].homeScore === 0 && confB[i].awayScore === 0)) {
        if (confB[i].homeScore > confB[i].awayScore) {
          // const temp = win3 + 1;
          // setWin3(temp);
          // setWin3(prev => prev + 1);
          win3++;
        } else {
          // const temp = win4 + 1;
          // setWin4(temp);
          // setWin4(prev => prev + 1);
          win4++;
        }
      }
    }
    setWin1(win1);
    setWin2(win2);
    setWin3(win3);
    setWin4(win4);
    return [win1, win2, win3, win4];
    // console.log(`win1`, win1);
    // console.log(`win2`, win2);
    // console.log(`win3`, win3);
    // console.log(`win4`, win4);
  }, []);

  async function initShedule() {
    confA = null;
    confB = null;

    // confAhomeImage = null;
    // confAawayImage = null;
    // confBhomeImage = null;
    // confBawayImage = null;

    // confAhomeName = null;
    // confAawayName = null;
    // confBhomeName = null;
    // confBawayName = null;
  }
  const fetchFinalSchedule = React.useCallback(async lgID => {
    try {
      // await initShedule();
      const leagueData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {leagueID: {eq: lgID}, finalsIndex: {ne: 0}},
        }),
      );

      const finalSchedules = leagueData.data.listSchedules.items;

      // console.log(`schedules`, schedules);
      // const temp = finalSchedules.filter(
      //   element =>
      //     element.away.leagueStatus === 'Playoff4' ||
      //     element.away.leagueStatus === 'Playoff1',
      // );
      // confA = temp;
      console.log(`finalSchedules`, finalSchedules);
      return finalSchedules;
    } catch (err) {
      console.log('error fetching playoffSchedule', err);
    }
  }, []);

  const fetchPlayoffSchedule = React.useCallback(async lgID => {
    try {
      await initShedule();
      const leagueData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {leagueID: {eq: lgID}, playOffIndex: {ne: 0}},
        }),
      );

      const schedules = leagueData.data.listSchedules.items;

      // console.log(`schedules`, schedules);
      const temp = schedules.filter(
        element =>
          element.away.leagueStatus === 'Playoff4' ||
          element.away.leagueStatus === 'Playoff1',
      );
      // console.log(`temp`, temp);
      confA = temp;
      setConfAhomeName(temp[0].home.name);
      setConfAawayName(temp[0].away.name);
      // confAhomeName = temp[0].home.name;
      // confAawayName = temp[0].away.name;
      const temp1 = schedules.filter(
        element =>
          element.away.leagueStatus === 'Playoff2' ||
          element.away.leagueStatus === 'Playoff3',
      );
      confB = temp1;
      setConfBhomeName(temp1[0].home.name);
      setConfBawayName(temp1[0].away.name);
      // confBhomeName = temp1[0].home.name;
      // confBawayName = temp1[0].away.name;
      // console.log(`playoffSchedule`, schedules);
      return [
        temp[0].home.name,
        temp[0].away.name,
        temp1[0].home.name,
        temp1[0].away.name,
      ];
    } catch (err) {
      console.log('error fetching playoffSchedule', err);
    }
  }, []);

  const fetchPlayoffTeam = React.useCallback(async lgID => {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeams, {
          filter: {leagueID: {eq: lgID}, leagueStatus: {ne: 'Season'}},
        }),
      );
      const teams = leagueData.data.listTeams.items;
      console.log(`teams`, teams);
      console.log(`playoffTeams`, teams);
      return teams;
    } catch (err) {
      console.log('error fetching playoff', err);
    }
  }, []);

  const fetchTeam = React.useCallback(async lgID => {
    try {
      const leagueData2 = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {leagueID: {eq: lgID}},
        }),
      );
      //console.log('Teams>>>>>>>>>>>>>>', leagueData2.data.listSchedules.items);
      let leagueData = [];
      for (let i = 0; i < leagueData2.data.listSchedules.items.length; i++) {
        const found = leagueData.find(
          e => e.id == leagueData2.data.listSchedules.items[i].home.id,
        );
        if (found == undefined) {
          let item = new Object();
          item = leagueData2.data.listSchedules.items[i].home;
          item.standingPlayers =
            leagueData2.data.listSchedules.items[i].homePlayers;
          item.image = leagueData2.data.listSchedules.items[i].homeImage;
          leagueData.push(item);
        }
        const found2 = leagueData.find(
          e => e.id == leagueData2.data.listSchedules.items[i].away.id,
        );
        if (found2 == undefined) {
          let item = new Object();
          item = leagueData2.data.listSchedules.items[i].away;
          item.standingPlayers =
            leagueData2.data.listSchedules.items[i].awayPlayers;
          item.image = leagueData2.data.listSchedules.items[i].awayImage;
          leagueData.push(item);
        }
      }
      const sorted = leagueData
        .sort((a, b) => a.win / (a.lose + a.win) - b.win / (b.lose + b.win))
        .reverse();
      console.log('sorted Unique league data:>> sort hiisen ni ', sorted);
      setTeamData(sorted);
      setLoading(false);
      setLogoLoad(false);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }, []);

  const getColor = (a, b) => {
    // console.log(`win1>>>>>>>>>>`, win1);
    // console.log(`win2>>>>>>>>>>`, win2);
    // console.log(`win3>>>>>>>>>>`, win3);
    // console.log(`win4>>>>>>>>>>`, win4);
    if (a === 2 || b === 2) {
      if (a > b) {
        return COLORS.green;
      } else if (a < b) {
        return COLORS.red;
      }
    } else {
      return COLORS.greyText;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.brand}}>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
        <ScrollView>
          <StatusBar barStyle="light-content" backgroundColor="#F74C11" />
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
              {chooseData.isPlayoff === true ? (
                <View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: wp(100),
                      height: wp(20),
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: COLORS.brand,
                        fontFamily: FONTS.brandFont,
                        fontSize: wp(4),
                      }}>
                      PLAYOFF
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onRefresh()}
                    style={{
                      position: 'absolute',
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                      marginTop: wp(3),
                    }}>
                    <Text
                      style={{
                        color: COLORS.greyText,
                        fontFamily: FONTS.brandFont,
                        fontSize: wp(3),
                      }}>
                      refresh
                    </Text>
                  </TouchableOpacity>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      alignItems: 'center',
                      width: wp(110),
                    }}>
                    <View>
                      <View style={styles.bracketContainer}>
                        <View style={styles.sectionContainer}>
                          <View>
                            <View style={styles.teamContainer}>
                              <View style={{flexDirection: 'row'}}>
                                {confAhomeImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {confAhomeImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                  </View>
                                )}
                              </View>
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={styles.textStyle}>
                                {confAhomeName}
                              </Text>
                            </View>
                            <View style={styles.space}>
                              <Text
                                style={[
                                  styles.seriesText,
                                  {
                                    color: getColor(win1, win2),
                                  },
                                ]}>
                                {win1}
                              </Text>
                              <Text
                                style={[
                                  styles.seriesText,
                                  {color: COLORS.greyText},
                                ]}>
                                {' '}
                                -{' '}
                              </Text>

                              <Text
                                style={[
                                  styles.seriesText,
                                  {
                                    color: getColor(win2, win1),
                                  },
                                ]}>
                                {win2}
                              </Text>
                            </View>
                            <View style={styles.teamContainer}>
                              <View style={{flexDirection: 'row'}}>
                                {confAawayImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {confAawayImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                  </View>
                                )}
                              </View>
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={styles.textStyle}>
                                {confAawayName}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <View style={styles.teamContainer}>
                              <View style={{flexDirection: 'row'}}>
                                {confBhomeImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {confBhomeImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                  </View>
                                )}
                              </View>
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={styles.textStyle}>
                                {confBhomeName}
                              </Text>
                            </View>
                            <View style={styles.space}>
                              <Text
                                style={[
                                  styles.seriesText,
                                  {
                                    color: getColor(win3, win4),
                                  },
                                ]}>
                                {win3}
                              </Text>
                              <Text
                                style={[
                                  styles.seriesText,
                                  {color: COLORS.greyText},
                                ]}>
                                {' '}
                                -{' '}
                              </Text>

                              <Text
                                style={[
                                  styles.seriesText,
                                  {
                                    color: getColor(win4, win3),
                                  },
                                ]}>
                                {win4}
                              </Text>
                            </View>
                            <View style={styles.teamContainer}>
                              <View style={{flexDirection: 'row'}}>
                                {confBawayImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {confBawayImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                  </View>
                                )}
                              </View>
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={styles.textStyle}>
                                {confBawayName}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.lineContainer}>
                          <View
                            style={{
                              height: wp(37.3),
                              width: wp(18),
                            }}>
                            <Image
                              source={
                                win1 === 2
                                  ? icons.line1agreen
                                  : icons.line1agrey
                              }
                              style={[
                                {
                                  zIndex: win1 !== 2 ? 0 : 1,
                                  marginTop: wp(4.4),
                                },
                                styles.line1,
                              ]}
                            />
                            <Image
                              source={
                                win2 === 2
                                  ? icons.line1bgreen
                                  : icons.line1bgrey
                              }
                              style={[
                                {
                                  zIndex: win2 !== 2 ? 0 : 1,
                                  marginTop: wp(17.06),
                                },
                                styles.line1,
                              ]}
                            />
                          </View>
                          <View
                            style={{
                              height: wp(47.46),
                              width: wp(18),
                            }}>
                            <Image
                              source={
                                win3 === 2
                                  ? icons.line1agreen
                                  : icons.line1agrey
                              }
                              style={[
                                {
                                  zIndex: win3 !== 2 ? 0 : 1,
                                  marginTop: wp(9.6),
                                },
                                styles.line1,
                              ]}
                            />
                            <Image
                              source={
                                win4 === 2
                                  ? icons.line1bgreen
                                  : icons.line1bgrey
                              }
                              style={[
                                {
                                  zIndex: win4 !== 2 ? 0 : 1,
                                  marginTop: wp(22.13),
                                },
                                styles.line1,
                              ]}
                            />
                          </View>
                        </View>
                        <View style={styles.section2}>
                          <View
                            style={{
                              height: wp(37.3),
                              width: wp(18),
                              paddingTop: wp(12),
                            }}>
                            <View style={styles.teamContainer}>
                              <View style={{flexDirection: 'row'}}>
                                {finalAImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {finalAImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={styles.teamAvatar}
                                    />
                                  </View>
                                )}
                              </View>
                              {finalAName ? (
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={styles.textStyle}>
                                  {finalAName}
                                </Text>
                              ) : (
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={styles.textStyle}>
                                  T1 or T2
                                </Text>
                              )}
                            </View>
                          </View>
                          <View style={{height: wp(4)}} />
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.finalPoint,
                                {
                                  color: getColor(final1, final2),
                                },
                              ]}>
                              {final1}
                            </Text>
                            <Text
                              style={[
                                styles.finalPoint,
                                {color: COLORS.greyText},
                              ]}>
                              {' '}
                              -{' '}
                            </Text>

                            <Text
                              style={[
                                styles.finalPoint,
                                {
                                  color: getColor(final2, final1),
                                },
                              ]}>
                              {final2}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: wp(47.46),
                              width: wp(18),
                            }}>
                            <View
                              style={{
                                height: wp(37.3),
                                width: wp(18),
                                paddingTop: wp(17.86),
                              }}>
                              <View style={styles.teamContainer}>
                                <View style={{flexDirection: 'row'}}>
                                  {finalBImage ? (
                                    <View style={{flexDirection: 'row'}}>
                                      {finalBImage.map(_item => {
                                        return (
                                          <Image
                                            source={_item}
                                            style={styles.teamAvatar}
                                          />
                                        );
                                      })}
                                    </View>
                                  ) : (
                                    <View style={{flexDirection: 'row'}}>
                                      <Image
                                        source={images.logo}
                                        style={styles.teamAvatar}
                                      />
                                      <Image
                                        source={images.logo}
                                        style={styles.teamAvatar}
                                      />
                                    </View>
                                  )}
                                </View>
                                {finalBName ? (
                                  <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={styles.textStyle}>
                                    {finalBName}
                                  </Text>
                                ) : (
                                  <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={{
                                      color: COLORS.greyText,
                                      fontFamily: FONTS.brandFont,
                                      fontSize: wp(2.66),
                                    }}>
                                    T3 or T4
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.sectionContainerFinal}>
                          <View
                            style={{
                              height: wp(117.6),
                              width: wp(16.89),
                            }}>
                            <Image
                              source={
                                final1 === 2
                                  ? icons.line2agreen
                                  : icons.line2agrey
                              }
                              style={{
                                zIndex: final1 !== 2 ? 0 : 1,
                                width: wp(16),
                                height: wp(41.06),
                                position: 'absolute',
                                marginTop: wp(16.26),
                              }}
                            />
                            <Image
                              source={
                                final2 === 2
                                  ? icons.line2bgreen
                                  : icons.line2bgrey
                              }
                              style={{
                                zIndex: final2 !== 2 ? 0 : 1,
                                width: wp(16),
                                height: wp(41.06),
                                position: 'absolute',
                                marginTop: wp(54.1),
                              }}
                            />
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <View style={styles.teamContainerFinal}>
                              <View style={{flexDirection: 'row'}}>
                                {champImage ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {champImage.map(_item => {
                                      return (
                                        <Image
                                          source={_item}
                                          style={styles.teamAvatar}
                                        />
                                      );
                                    })}
                                  </View>
                                ) : (
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={images.logo}
                                      style={{width: wp(9.6), height: wp(9.6)}}
                                    />
                                    <Image
                                      source={images.logo}
                                      style={{width: wp(9.6), height: wp(9.6)}}
                                    />
                                  </View>
                                )}
                              </View>
                              {champName ? (
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={{
                                    color: COLORS.greyText,
                                    fontFamily: FONTS.brandFont,
                                    fontSize: wp(2.66),
                                  }}>
                                  {champName}
                                </Text>
                              ) : (
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={{
                                    color: COLORS.greyText,
                                    fontFamily: FONTS.brandFont,
                                    fontSize: wp(2.66),
                                  }}>
                                  Finalist
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              ) : teamData.length !== 0 ? (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      tintColor={COLORS.brand}
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  data={teamData}
                  style={{height: hp(100)}}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                />
              ) : (
                <View style={styles.logoContainer}>
                  <Animated.Image
                    source={images.logo}
                    style={[
                      styles.logoStyle,
                      {transform: [{rotate: RotateData}]},
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  teamAvatar: {
    width: wp(9.6),
    height: wp(9.6),
  },
  seriesText: {
    fontFamily: FONTS.brandFont,
    fontSize: wp(3.2),
  },
  finalPoint: {
    fontFamily: FONTS.brandFont,
    fontSize: wp(4.2),
  },
  skeletonMain: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  skeletonAnotherSub: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeletonInner: {
    width: wp(20),
    height: hp(5),
  },

  skeleton3: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
  },
  skeletonSub: {
    width: wp(15),
    height: wp(15),
    borderRadius: 40,
    marginRight: hp(1),
    flexDirection: 'row',
  },
  skeletonSubMain: {
    flexDirection: 'row',
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
  dropButton: {
    resizeMode: 'contain',
    height: wp(4.53),
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
  avatar: {
    width: wp(14.4),
    height: hp(6.65),
    borderRadius: 50,
  },
  standingStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
    marginHorizontal: wp(5),
  },
  line: {
    alignSelf: 'center',
    width: wp(85),
    marginLeft: wp(5),
    height: 2,
    backgroundColor: 'white',
  },
  logoContainer: {
    height: hp(65),
    marginTop: hp(6.07),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    width: wp(40),
    height: hp(30),
    resizeMode: 'contain',
    opacity: 0.7,
  },
  lottie: {
    width: wp(80),
    height: wp(80),
    alignSelf: 'center',
  },
  bracketContainer: {
    width: wp(96),
    height: wp(117.6),
    flexDirection: 'row',
  },

  sectionContainer: {
    height: wp(117.6),
    width: wp(23),
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
  textStyle: {
    color: COLORS.greyText,
    fontFamily: FONTS.brandFont,
    fontSize: wp(2.66),
  },
  space: {
    width: wp(23),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  lineContainer: {
    height: wp(117.6),
    width: wp(18),

    justifyContent: 'space-between',
  },
  line1: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
  },
  section2: {
    height: wp(117.6),
    width: wp(23),
    justifyContent: 'space-between',
  },
  sectionContainerFinal: {
    height: wp(117.6),
    width: wp(32),
    flexDirection: 'row',
  },
});

export default StandingsScreen;
