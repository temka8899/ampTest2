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
} from 'react-native';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {listTeamPlayers, listTeams} from '../graphql/queries';
import {graphqlOperation} from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let load = true;

const StandingsScreen = ({navigation, route}) => {
  // let itemID = 0;

  // if (route.params?.itemId) {
  //   itemID = route.params.itemId;
  // }
  const [rotateValue, setRotateValue] = useState(new Animated.Value(0));
  const [isLoading, setLoading] = useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [PlayerInfo, setPlayerInfo] = useState([]);

  const StartImageRotate = React.useCallback(() => {
    console.log('start rot callde');
    rotateValue.setValue(0);

    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      load ? StartImageRotate() : null;
      console.log('s load', isLoading);
    });
  }, [isLoading, rotateValue]);

  const RotateData = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const sorted = teamData
    .sort((a, b) => a.win / (a.lose + a.win) - b.win / (b.lose + b.win))
    .reverse();

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = React.useCallback(
    async option => {
      await setChooseData(option);
      await console.log('leagueID :>> ', option.id);
      fetchTeam(option.id);
    },
    [fetchTeam],
  );

  useEffect(() => {
    StartImageRotate();
  }, [StartImageRotate]);

  const onRefresh = React.useCallback(() => {
    setData(chooseData);
    wait(500).then(() => setRefreshing(false));
  }, [chooseData, setData]);

  const fetchTeam = React.useCallback(async lgID => {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeams, {
          filter: {leagueID: {eq: lgID}},
        }),
      );
      console.log('Teams>>>>>>>>>>>>>>', leagueData.data.listTeams.items);
      const sorted = leagueData.data.listTeams.items
        .sort((a, b) => a.win / (a.lose + a.win) - b.win / (b.lose + b.win))
        .reverse();
      setTeamData(sorted);
      setLoading(false);
      load = false;
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
            <>
              {isLoading ? (
                <SkeletonPlaceholder
                  speed={800}
                  backgroundColor={'#E1E9EE'}
                  highlightColor={'gray'}>
                  <View>
                    <View style={styles.skeletonMain}>
                      <View style={styles.skeleton3}>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonSub} />
                          <View style={styles.skeletonSub} />
                        </View>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonInner} />
                        </View>
                      </View>
                      <View style={styles.skeletonAnotherSub} />
                      <View style={styles.skeleton3}>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonSub} />
                          <View style={styles.skeletonSub} />
                        </View>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonInner} />
                        </View>
                      </View>
                      <View style={styles.skeletonAnotherSub} />
                      <View style={styles.skeleton3}>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonSub} />
                          <View style={styles.skeletonSub} />
                        </View>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonInner} />
                        </View>
                      </View>
                      <View style={styles.skeletonAnotherSub} />
                      <View style={styles.skeleton3}>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonSub} />
                          <View style={styles.skeletonSub} />
                        </View>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonInner} />
                        </View>
                      </View>
                      <View style={styles.skeletonAnotherSub} />
                      <View style={styles.skeleton3}>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonSub} />
                          <View style={styles.skeletonSub} />
                        </View>
                        <View style={styles.skeletonSubMain}>
                          <View style={styles.skeletonInner} />
                        </View>
                      </View>
                      <View style={styles.skeletonAnotherSub} />
                    </View>
                  </View>
                </SkeletonPlaceholder>
              ) : (
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
                          <Image
                            source={item.playerAvatar1}
                            style={styles.avatar}
                          />
                          <Image
                            source={item.playerAvatar2}
                            style={styles.avatar}
                          />
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
              )}
            </>
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
});

export default StandingsScreen;
