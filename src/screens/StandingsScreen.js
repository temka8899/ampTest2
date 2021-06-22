import React, {useState} from 'react';
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
} from 'react-native';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons, images} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useEffect} from 'react';
import {listTeamPlayers, listTeams} from '../graphql/queries';
import {graphqlOperation} from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const StandingsScreen = ({navigation, route}) => {
  // let itemID = 0;

  // if (route.params?.itemId) {
  //   itemID = route.params.itemId;
  // }
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Home, setHome] = useState(undefined);
  const [Away, setAway] = useState(undefined);
  const [imgLoad, setImgLoad] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [PlayerInfo, setPlayerInfo] = useState([]);
  console.log('PlayerInfo :>> ', PlayerInfo);

  const sorted = PlayerInfo.sort(
    (a, b) => b[0].team.win / b[0].team.lose - a[1].team.win / a[1].team.lose,
  );

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

  // useEffect(() => {
  //   fetchTeam();
  // }, [fetchTeam]);

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
      setTeamData(leagueData.data.listTeams.items);
      let array = [];
      for (let i = 0; i < leagueData.data.listTeams.items.length; i++) {
        const leagueData_ = await API.graphql(
          graphqlOperation(listTeamPlayers, {
            filter: {teamID: {eq: leagueData.data.listTeams.items[i].id}},
          }),
        );
        const teamPlayers = leagueData_.data.listTeamPlayers.items;
        array.push(teamPlayers);
      }
      console.log('array after looped :>> ', array);
      setPlayerInfo(array);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <SkeletonPlaceholder
          speed={800}
          backgroundColor={'#E1E9EE'}
          highlightColor={'gray'}>
          <View>
            <View>
              <View style={{width: wp(100), height: hp(4)}} />

              <View style={{width: wp(100), height: hp(3), marginTop: hp(1)}} />
            </View>
            <View style={styles.skeletonMain}>
              <View style={styles.skeleton1}>
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
              <View style={styles.skeleton}>
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
            {PlayerInfo.length != 0 ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                data={sorted}
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
                      <Image
                        source={item[0].player.avatar}
                        style={styles.avatar}
                      />
                      <Image
                        source={item[1].player.avatar}
                        style={styles.avatar}
                      />
                      <Text
                        style={{
                          fontFamily: FONTS.brandFont,
                          color: COLORS.white,
                        }}>
                        {item[0].team.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.brandFont,
                          color: COLORS.green,
                        }}>
                        {item[0].team.win}
                        {`-`}
                        <Text style={{color: COLORS.red}}>
                          {item[0].team.lose}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.line} />
                  </View>
                )}
              />
            ) : (
              <View style={styles.logoContainer}>
                <Image source={images.logo} style={styles.logoStyle} />
              </View>
            )}
          </View>
        </View>
      )}
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
  skeleton1: {
    flexDirection: 'row',
    marginTop: hp(10),
    alignItems: 'center',
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  line: {
    alignSelf: 'center',
    width: wp(90),
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
