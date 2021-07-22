import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
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
import Modal from 'react-native-modal';
import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';
import {LoadingModal} from '../components/LoadingModal';

import {
  listGames,
  listPlayers,
  listSchedules,
  listTeams,
} from '../graphql/queries';
import {graphqlOperation} from '@aws-amplify/api-graphql';
import LottieView from 'lottie-react-native';

import API from '@aws-amplify/api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let confA;
let confB;

let champPlayers;

const ChampModal = props => {
  if (props.data === undefined || props.data === null) {
    return null;
  } else {
    return (
      <Modal
        transparent={true}
        animationIn="zoomIn"
        isVisible={props.visible}
        style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}
        onBackdropPress={props.onBackdropPress}>
        <View
          style={{
            width: wp(80),
            height: wp(70),
            backgroundColor: COLORS.background,
            borderColor: COLORS.brand,
            borderWidth: 2,
            flexDirection: 'column',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', marginTop: wp(5)}}>
              <Text
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.brand,
                  fontSize: wp(3.7),
                  marginLeft: wp(5),
                  marginRight: wp(2),
                  marginBottom: wp(2),
                }}>
                CHAMPIONS
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.tabgrey,
                  fontSize: wp(3),
                }}>
                of
              </Text>
            </View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                fontFamily: FONTS.brandFont,
                color: COLORS.white,
                fontSize: wp(4),
                width: wp(60),
                textAlign: 'center',
              }}>
              {props.data.leagueName}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: wp(55),
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: wp(5),
                marginBottom: wp(5),
              }}>
              <Image
                source={props.data.avatar1}
                style={{width: wp(11), height: wp(11), marginRight: wp(2)}}
              />
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.greyText,
                  fontSize: wp(3.5),
                  width: wp(44),
                }}>
                {props.data.name1}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: wp(55),
              }}>
              <Image
                source={props.data.avatar2}
                style={{width: wp(11), height: wp(11), marginRight: wp(2)}}
              />
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.greyText,
                  fontSize: wp(3.5),
                  width: wp(44),
                }}>
                {props.data.name2}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={props.onBackdropPress}
              style={{
                width: wp(30),
                height: wp(8),
                backgroundColor: COLORS.brand,
                alignSelf: 'center',
                marginBottom: wp(5),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: FONTS.brandFont,
                  fontSize: wp(3),
                }}>
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: wp(80),
              zIndex: -1,
            }}>
            <LottieView
              autoPlay
              style={{
                position: 'absolute',
                width: wp(40),
                left: wp(12.5),
              }}
              source={require('../assets/Lottie/game-speak.json')}
            />
            <View style={{transform: [{scaleX: -1}]}}>
              <LottieView
                autoPlay
                style={{
                  position: 'absolute',
                  width: wp(40),
                  right: wp(0.5),
                }}
                source={require('../assets/Lottie/game-speak.json')}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};
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

  const [initLoad, setinitLoad] = useState(true);

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

  const [win1, setWin1] = useState(0);
  const [win2, setWin2] = useState(0);
  const [win3, setWin3] = useState(0);
  const [win4, setWin4] = useState(0);
  const [final1, setFinal1] = useState(0);
  const [final2, setFinal2] = useState(0);
  const [tempOption, setTempOption] = useState();

  const [champModalVisible, setChampModal] = useState(false);

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
      setinitLoad(true);
      await setChooseData(option);
      await fetchTeam(option.id);
      setTempOption(option);
      if (option.isPlayoff === true) {
        await fetchPlayoffTeam(option.id);
        let names = await fetchPlayoffSchedule(option.id);

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

        let param = await getWinner();
        let isfinal = initFinal(param, image, names);
        if (isfinal !== false) {
          let finalMatches = await fetchFinalSchedule(option.id);
          let finalPoint = await getFinalWinner(finalMatches[0]);
          let homeID = finalMatches[1];
          let awayID = finalMatches[2];
          if (finalPoint[0] === 2 || finalPoint[1] === 2) {
            await getChamp(
              finalPoint,
              isfinal,
              homeID,
              awayID,
              finalMatches[3],
            );
          }
        }
      }
      setinitLoad(false);
    },
    [
      fetchFinalSchedule,
      fetchPlayoffSchedule,
      fetchPlayoffTeam,
      fetchTeam,
      getChamp,
      getFinalWinner,
      getWinner,
      initFinal,
    ],
  );

  async function initWin() {
    await setWin1(0);
    await setWin2(0);
    await setWin3(0);
    await setWin4(0);
    await setFinal1(0);
    await setFinal2(0);
  }

  const getChamp = React.useCallback(
    async (finalPoint, finalData, homeID, awayID, gameName) => {
      if (finalPoint[0] === 2) {
        setChampImage(finalData[0]);
        setChampName(finalData[1]);
        await getChampData(homeID, gameName);
      } else {
        setChampImage(finalData[2]);
        setChampName(finalData[3]);
        await getChampData(awayID, gameName);
      }
    },
    [],
  );
  const getChampData = React.useCallback(async (ID, gameName) => {
    try {
      setinitLoad(false);
      const player1Data = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {id: {eq: ID[0]}},
        }),
      );

      const player1 = player1Data.data.listPlayers.items[0];
      let Data1 = [player1.avatar, player1.name];

      const player2Data = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {id: {eq: ID[1]}},
        }),
      );

      const player2 = player2Data.data.listPlayers.items[0];
      let Data2 = [player2.avatar, player2.name];
      let Data = {
        avatar1: Data1[0],
        name1: Data1[1],
        avatar2: Data2[0],
        name2: Data2[1],
        leagueName: gameName,
      };
      champPlayers = Data;
      setChampModal(true);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }, []);
  const initFinal = React.useCallback((param, image, names) => {
    let finalA;
    let finalB;
    if (param[0] === 2 || param[1] === 2 || param[2] === 2 || param[3] === 2) {
      if (param[0] === 2 || param[1] === 2) {
        if (param[0] === 2) {
          setFinalAImage(image[0]);
          setFinalAName(names[0]);
          finalA = [image[0], names[0]];
        } else {
          setFinalAImage(image[1]);
          setFinalAName(names[1]);
          finalA = [image[1], names[1]];
        }
      }
      if (param[2] === 2 || param[3] === 2) {
        if (param[2] === 2) {
          setFinalBImage(image[2]);
          setFinalBName(names[2]);
          finalB = [image[2], names[2]];
        } else {
          setFinalBImage(image[3]);
          setFinalBName(names[3]);
          finalB = [image[3], names[3]];
        }
      }
      let gang = [finalA[0], finalA[1], finalB[0], finalB[1]];
      return gang;
    } else {
      return false;
    }
  }, []);

  const getFinalWinner = React.useCallback(async matches => {
    let win1 = 0;
    let win2 = 0;
    for (let i = 0; i < matches.length; i++) {
      if (!(matches[i].homeScore === 0 && matches[i].awayScore === 0)) {
        if (matches[i].homeScore > matches[i].awayScore) {
          win1++;
        } else {
          win2++;
        }
      }
    }
    setFinal1(win1);
    setFinal2(win2);
    return [win1, win2];
  }, []);

  const getWinner = React.useCallback(async () => {
    let win1 = 0;
    let win2 = 0;
    let win3 = 0;
    let win4 = 0;
    for (let i = 0; i < confA.length; i++) {
      if (!(confA[i].homeScore === 0 && confA[i].awayScore === 0)) {
        if (confA[i].homeScore > confA[i].awayScore) {
          win1++;
        } else {
          win2++;
        }
      }
    }
    for (let i = 0; i < confB.length; i++) {
      if (!(confB[i].homeScore === 0 && confB[i].awayScore === 0)) {
        if (confB[i].homeScore > confB[i].awayScore) {
          win3++;
        } else {
          win4++;
        }
      }
    }
    setWin1(win1);
    setWin2(win2);
    setWin3(win3);
    setWin4(win4);
    return [win1, win2, win3, win4];
  }, []);

  async function initShedule() {
    confA = null;
    confB = null;
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
      let gameID = finalSchedules[0].gameID;
      let homeID1 = finalSchedules[0].homePlayers.split('[');
      let homeID2 = homeID1[1].split(']');
      let homeID = homeID2[0].split(', ');
      let awayID1 = finalSchedules[0].awayPlayers.split('[');
      let awayID2 = awayID1[1].split(']');
      let awayID = awayID2[0].split(', ');

      const gameData = await API.graphql(
        graphqlOperation(listGames, {
          filter: {id: {eq: gameID}},
        }),
      );
      const gameData1 = gameData.data.listGames.items[0];
      const gameName = gameData1.name;

      return [finalSchedules, homeID, awayID, gameName];
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

      const temp = schedules.filter(
        element =>
          element.away.leagueStatus === 'Playoff4' ||
          element.away.leagueStatus === 'Playoff1',
      );
      confA = temp;
      setConfAhomeName(temp[0].home.name);
      setConfAawayName(temp[0].away.name);
      const temp1 = schedules.filter(
        element =>
          element.away.leagueStatus === 'Playoff2' ||
          element.away.leagueStatus === 'Playoff3',
      );
      confB = temp1;
      setConfBhomeName(temp1[0].home.name);
      setConfBawayName(temp1[0].away.name);
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
      // console.log(`teams`, teams);
      // console.log(`playoffTeams`, teams);
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
              isVisible={modalVisible}
              style={{margin: 0}}
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
                              <TouchableOpacity
                                onPress={() => setChampModal(true)}
                                style={{
                                  position: 'absolute',
                                  bottom: wp(20),
                                  width: wp(50),
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: FONTS.brandFont,
                                    color: COLORS.brand,
                                    fontSize: wp(3.7),
                                  }}>
                                  CHAMPIONS
                                </Text>
                              </TouchableOpacity>
                              <View style={{flexDirection: 'row'}}>
                                <ChampModal
                                  visible={champModalVisible}
                                  onBackdropPress={() => setChampModal(false)}
                                  data={champPlayers}
                                />
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
            <LoadingModal bool={initLoad} />
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
