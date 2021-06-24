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
  Easing,
  ActivityIndicator,
} from 'react-native';

import LottieView from 'lottie-react-native';
import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {listSchedules, listTeamPlayers, listTeams} from '../graphql/queries';
import {graphqlOperation} from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const StandingsScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [PlayerInfo, setPlayerInfo] = useState([]);
  const [logoLoad, setLogoLoad] = useState();

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

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = React.useCallback(
    async option => {
      await setChooseData(option);
      await console.log('leagueID :>> ', option.id);
      await fetchTeam(option.id);
    },
    [fetchTeam],
  );

  const onRefresh = React.useCallback(() => {
    setData(chooseData);
    wait(500).then(() => setRefreshing(false));
  }, [chooseData, setData]);

  const fetchTeam = React.useCallback(async lgID => {
    console.log('lgID :>> ', lgID);
    try {
      const leagueData2 = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {leagueID: {eq: lgID}},
        }),
      );
      console.log('Teams>>>>>>>>>>>>>>', leagueData2.data.listSchedules.items);
      let leagueData = [];
      for (let i = 0; i < leagueData2.data.listSchedules.items.length; i++) {
        const found = leagueData.find(
          e => e.id == leagueData2.data.listSchedules.items[i].home.id,
        );
        if (found == undefined) {
          let item = new Object();
          item = leagueData2.data.listSchedules.items[i].home;
          item.image = leagueData2.data.listSchedules.items[i].homeImage;
          leagueData.push(item);
        }
        const found2 = leagueData.find(
          e => e.id == leagueData2.data.listSchedules.items[i].away.id,
        );
        if (found2 == undefined) {
          let item = new Object();
          item = leagueData2.data.listSchedules.items[i].away;
          item.image = leagueData2.data.listSchedules.items[i].awayImage;
          leagueData.push(item);
        }
      }
      console.log('Unique League data ->', leagueData);
      const sorted = leagueData
        .sort((a, b) => a.win / (a.lose + a.win) - b.win / (b.lose + b.win))
        .reverse();
      setTeamData(sorted);
      setLoading(false);
      setLogoLoad(false);
      console.log('set_load false');
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
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
          {teamData.length != 0 ? (
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
              keyExtractor={item => item}
              renderItem={({item, index}) => (
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
                      <Image source={item.image[0]} style={styles.avatar} />
                      <Image source={item.image[1]} style={styles.avatar} />
                    </View>
                    <Text
                      style={{
                        fontFamily: FONTS.brandFont,
                        color: COLORS.white,
                        marginLeft: wp(5),
                      }}>
                      {item.name}
                    </Text>
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
                          }}>{`-`}</Text>
                        <Text style={{color: COLORS.red}}>{item.lose}</Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.line} />
                </View>
              )}
            />
          ) : (
            <View style={styles.logoContainer}>
              <Animated.Image
                source={images.logo}
                style={[styles.logoStyle, {transform: [{rotate: RotateData}]}]}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
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
});

export default StandingsScreen;
