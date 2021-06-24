import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';

import {wp, hp, COLORS, FONTS} from '../constants/theme';

import {Avatars} from '../data/Avatars';
import {AuthContext} from '../../App';

import awsmobile from '../aws-exports';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import {createPlayer} from '../graphql/mutations';
import LinearGradient from 'react-native-linear-gradient';
import {
  listPlayers,
  listLeagues,
  listSchedules,
  listTeamPlayers,
} from '../graphql/queries';

import {RFPercentage} from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Amplify, {API, graphqlOperation, Auth} from 'aws-amplify';
import IntroModal from '../components/IntroModal';
import {images} from '../constants';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const Avatar = ({item, onPress, backgroundColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.avatars, backgroundColor]}>
    <Image source={item.image} style={{width: wp(14), height: wp(14)}} />
  </TouchableOpacity>
);

const Match = ({item, onPress, user}) => {
  const [Home, setHome] = useState(undefined);
  const [Away, setAway] = useState(undefined);
  const [imgLoad, setImgLoad] = useState(true);
  const [find, setFind] = useState('');

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

    let findHome = await findTeam(user.id, item.home.id);
    let findAway = await findTeam(user.id, item.away.id);

    if (findHome) {
      setFind('home');
    } else if (findAway) {
      setFind('away');
    }
    console.log(`Home`, Home);
  }, [Home, item, user.id]);

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
      // console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
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
                  {Home.map(_item => {
                    return imgLoad ? (
                      <ActivityIndicator
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image source={_item} style={styles.avatar} />
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
                  {Away.map(_item => {
                    return imgLoad ? (
                      <ActivityIndicator
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image source={_item} style={styles.avatar} />
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
                  {Home.map(_item => {
                    return imgLoad ? (
                      <ActivityIndicator
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image source={_item} style={styles.avatar} />
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
                  {Away.map(_item => {
                    return imgLoad ? (
                      <ActivityIndicator
                        style={styles.avatar}
                        size={'small'}
                        color={COLORS.brand}
                      />
                    ) : (
                      <Image source={_item} style={styles.avatar} />
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

const GameScreen = ({navigation}) => {
  const [schedule, setSchedule] = useState([]);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [AvatarModal, setAvatarModal] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [LeagueList, setLeagueList] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playerId, setId] = useState('');
  const [name, setName] = useState();
  const [greet, setGreet] = useState('');
  const [introModal, setIntroModal] = useState(false);

  useEffect(() => {
    fetchLeague();
    findGreet();
    getName();
    getSchedule();
  }, [getName, getSchedule]);

  const onRefresh = React.useCallback(() => {
    fetchLeague();
    findGreet();
    getName();
    getSchedule();
    wait(500).then(() => setRefreshing(false));
  }, [getName, getSchedule]);

  const press = item => {
    setSelectedId(item.id);
    setSelectedItem(item.image);
  };

  const avatarsRender = ({item}) => {
    const backgroundColor =
      item.id === selectedId ? COLORS.brand : COLORS.background;

    return (
      <Avatar
        item={item}
        onPress={() => press(item)}
        // backgroundColor={{backgroundColor}}
      />
    );
  };

  function renderSchedule({item}) {
    return (
      <Match
        item={item}
        onPress={() => navigation.navigate('ScheduleScreen')}
        selectedId={selectedId}
        user={userInfo}
      />
    );
  }

  const Item = ({item, onPress}) => (
    <View
      style={{
        marginLeft: wp(4),
        marginVertical: wp(3),
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.item, {backgroundColor: COLORS.background}]}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${item.game.image}`,
          }}
          style={{
            width: wp(52),
            height: wp(68),
          }}
          imageStyle={{
            borderRadius: wp(12),
            // resizeMode: 'contain',
            backgroundColor: COLORS.background,
          }}>
          <LinearGradient
            style={{flex: 1, borderRadius: wp(12)}}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00000000', '#000']}>
            <View style={styles.leagueStatus}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  paddingVertical: hp(1),
                }}>
                {item.game.name}
              </Text>
              <Text style={{color: COLORS.white, fontFamily: FONTS.brandFont}}>
                {item.startDate}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => {
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <>
        <Item
          item={item}
          onPress={() =>
            navigation.navigate('ParticipatesScreen', {
              itemId: item,
            })
          }
          textColor={{color}}
        />
      </>
    );
  };

  const setAvatar = async () => {
    const user = await Auth.currentUserInfo();
    setAvatarModal(false);
    await addPlayer(user.attributes['custom:Name'], user.username);
    findUser(user);
    setIntroModal(true);
  };

  const findGreet = () => {
    const hrs = new Date().getHours();
    const day = new Date().getDay();
    if (hrs === 0 || hrs < 12) return setGreet('Morning');
    if (hrs === 1 || hrs < 17) return setGreet('Afternoon');

    setGreet('Evening');
  };

  const getName = React.useCallback(async () => {
    const user = await Auth.currentUserInfo();
    const playerData = await API.graphql(graphqlOperation(listPlayers));
    setName(user.attributes['custom:Name']);

    setLoading(false);
    let existing = await checkPlayer(playerData, user.username);
    if (existing) {
      getAvatar();
    } else {
      findUser(user);
    }
    findUser(user);
  }, [checkPlayer, findUser, getAvatar]);

  const findUser = React.useCallback(
    async user => {
      const playerData = await API.graphql(graphqlOperation(listPlayers));
      let finded = playerData.data.listPlayers.items.find((item, index) => {
        if (user.username === item.c_id) {
          return item;
        }
      });
      console.log('finded', finded);
      setUserInfo(finded);
    },
    [setUserInfo],
  );

  const fetchLeague = async () => {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      //

      setLeagueList(leagueData.data.listLeagues.items);
    } catch (err) {}
  };

  const checkPlayer = React.useCallback((playerData, p_id) => {
    try {
      const players = playerData.data.listPlayers.items;
      //
      for (var i = 0; i < players.length; i++) {
        if (players[i].c_id === p_id) {
          return false;
        }
      }
      return true;
    } catch (err) {}
  }, []);

  const getAvatar = React.useCallback(() => {
    setAvatarModal(true);
  }, []);

  const addPlayer = React.useCallback(
    async (username, p_id) => {
      try {
        const res = await API.graphql(
          graphqlOperation(createPlayer, {
            input: {
              c_id: p_id,
              name: username,
              xp: 1,
              level: 1,
              admin: true,
              avatar: selectedItem,
            },
          }),
        );
      } catch (err) {}
    },
    [selectedItem],
  );

  let date = new Date();
  date.setDate(date.getDate());
  // console.log(date.toLocaleDateString());

  const getSchedule = React.useCallback(async () => {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            date: {eq: `${date.toLocaleDateString()}`},
            // leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = scheduleData.data.listSchedules.items;
      const sorted = todos.sort((a, b) => a.index - b.index);
      console.log('sorted', sorted);
      setSchedule(sorted);
    } catch (err) {}
  }, []);

  function close() {
    setIntroModal(false);
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={COLORS.brand}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <StatusBar barStyle="light-content" />
        {isLoading ? (
          <SkeletonPlaceholder
            speed={800}
            backgroundColor={COLORS.count}
            highlightColor={'gray'}>
            <View style={{paddingHorizontal: wp(4)}}>
              <View style={styles.skeletonFirstContainer}>
                <View style={{marginHorizontal: wp(5)}}>
                  <View style={styles.skeletonFirstSub} />
                  <View style={styles.skeletonFirstSub} />
                </View>
                <View style={styles.skeletonFirstSubSub} />
              </View>
              <View style={styles.skeletonSecondContainer}>
                <View style={styles.skeletonSecondFirstSub} />
                <View style={styles.skeletonSecondSecondSub} />
                <View style={styles.skeletonSecondThirdSub} />
              </View>
              <View style={styles.skeletonThirdContainer} />
            </View>
          </SkeletonPlaceholder>
        ) : (
          <View>
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.greeting,
                    {fontSize: RFPercentage(1.8), color: COLORS.greyText},
                  ]}>{`Good ${greet} `}</Text>
                <Text
                  style={[
                    styles.greeting,
                    {marginTop: hp(1), fontSize: RFPercentage(2.5)},
                  ]}>
                  {userInfo === undefined ? 'Hello' : `${userInfo.name}`}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Tabs', {screen: 'Profile'})
                  }>
                  {userInfo === undefined ? (
                    <Image
                      source={images.nullPic}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={userInfo.avatar}
                      style={styles.profileImage}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {LeagueList.length !== 0 ? (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={LeagueList}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  extraData={selectedId}
                  onPress={() => {}}
                  style={{
                    height: wp(75),
                  }}
                />
              ) : (
                <View>
                  <View style={styles.lottie}>
                    <LottieView
                      autoPlay
                      source={require('../assets/Lottie/game-loading.json')}
                    />
                    <Text style={styles.lottieText}>LEAGUE CREATING...</Text>
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                height: wp(12),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.7),
                  marginLeft: wp(4),
                }}>
                PLAYING TODAY
              </Text>
            </View>
            <View style={{height: wp(76)}}>
              <FlatList
                data={schedule}
                keyExtractor={item => item.id}
                renderItem={renderSchedule}
              />
              {/* <View
              style={{
                height: hp(11),
                width: '100%',
                backgroundColor: 'red',
              }}
            /> */}
            </View>
          </View>
        )}
        <Modal
          animationIn="rubberBand"
          isVisible={AvatarModal}
          style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.8),
                marginTop: hp(3),
                marginBottom: hp(2),
              }}>
              Choose your avatar
            </Text>
            <FlatList
              data={Avatars}
              renderItem={avatarsRender}
              keyExtractor={item => item.id}
              extraData={selectedId}
              numColumns={4}
              showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity
              onPress={() => setAvatar()}
              style={styles.modalButton}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.8),
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <IntroModal visible={introModal} close={close} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: hp(2),
  },
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
  skeletonFirstContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonFirstSub: {
    marginTop: 6,
    width: 100,
    height: 20,
    borderRadius: 4,
  },
  skeletonFirstSubSub: {
    width: 60,
    height: 60,
  },
  skeletonSecondContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    marginTop: hp(3),
  },
  skeletonSecondFirstSub: {
    width: wp(63.3),
    height: hp(39),
    borderRadius: 40,
  },
  skeletonSecondSecondSub: {
    width: wp(63.3),
    height: hp(39),
    borderRadius: 40,
    marginHorizontal: hp(2),
  },
  skeletonSecondThirdSub: {
    width: wp(63.3),
    height: hp(39),
    borderRadius: 40,
  },
  skeletonThirdContainer: {
    marginTop: hp(1),
    width: 200,
    height: 20,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    height: wp(16),
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.brand,
    borderWidth: 2,
    width: wp(80),
    height: hp(57),
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.brand,
    width: wp(30),
    height: hp(4),
    marginBottom: hp(2),
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieText: {
    color: COLORS.brand,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.7),
    alignSelf: 'center',
    marginTop: hp(5),
  },
  profileImage: {
    resizeMode: 'contain',
    width: wp(14.4),
    height: wp(14.4),
  },
  leagueStatus: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: hp(5),
    marginHorizontal: wp(5),
  },
  avatars: {
    width: wp(16),
    height: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
    marginVertical: wp(1),
  },
  greeting: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // marginVertical: 8,
  },
  title: {
    fontSize: 32,
  },
  lottie: {
    width: wp(80),
    height: wp(80),
    alignSelf: 'center',
  },
});

export default GameScreen;
