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
} from 'react-native';

import {wp, hp, COLORS, FONTS} from '../constants/theme';

import {Avatars} from '../data/Avatars';
import {AuthContext} from '../../App';

import awsmobile from '../aws-exports';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import {
  showNotification,
  handleScheduleNotification,
  handleCancel,
} from '../functions/notification';

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

const Match = ({item, onPress, selectedId}) => {
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
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          width: wp(80),
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <View>
          {Home && (
            <View style={{flexDirection: 'row'}}>
              {Home.map(_item => (
                <>
                  {imgLoad ? (
                    <ActivityIndicator size={'small'} color={'red'} />
                  ) : (
                    <Image
                      source={_item.player.avatar}
                      style={{width: 50, height: 50}}
                    />
                  )}
                </>
              ))}
            </View>
          )}
          <Text
            style={{
              marginTop: hp(1),
              color: COLORS.greyText,
              fontFamily: FONTS.brandFont,
              textAlign: 'center',
            }}>
            {item.home.name}
          </Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
            }}>
            VS
          </Text>
        </View>
        <View>
          {Away && (
            <View style={{flexDirection: 'row'}}>
              {Away.map(_item => (
                <>
                  {imgLoad ? (
                    <ActivityIndicator size={'small'} color={'red'} />
                  ) : (
                    <Image
                      source={_item.player.avatar}
                      style={{width: 50, height: 50}}
                    />
                  )}
                </>
              ))}
            </View>
          )}
          <Text
            style={{
              marginTop: hp(1),
              color: COLORS.greyText,
              fontFamily: FONTS.brandFont,
              textAlign: 'center',
            }}>
            {item.away.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: 'center',
          width: wp(80),
          backgroundColor: 'white',
          height: 1.5,
          marginVertical: hp(1),
        }}
      />
    </TouchableOpacity>
  );
};

const GameScreen = ({navigation}) => {
  const [schedule, setSchedule] = useState([]);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [AvatarModal, setAvatarModal] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [LeagueList, setLeagueList] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playerId, setId] = useState('');
  const [name, setName] = useState();
  const [greet, setGreet] = useState('');

  useEffect(() => {
    fetchLeague();
    findGreet();
    getName();
    getSchedule();
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
        backgroundColor={{backgroundColor}}
      />
    );
  };

  function renderSchedule({item}) {
    console.log(`match`, item);
    return (
      <Match
        item={item}
        onPress={() => navigation.navigate('ScheduleScreen')}
        selectedId={selectedId}
      />
    );
  }

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <View style={{marginLeft: wp(4), marginTop: hp(3), borderRadius: 20}}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.item, backgroundColor]}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${item.game.image}`,
          }}
          style={{
            width: wp(63.3),
            height: hp(39),
          }}
          imageStyle={{borderRadius: 40}}>
          <LinearGradient
            style={{flex: 1, borderRadius: 40}}
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
    console.log('user medeelel ireed loading set hiih gej bn');
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
      setUserInfo(finded);
      console.log('context player model data', finded);
    },
    [setUserInfo],
  );

  const fetchLeague = async () => {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Leagues list', leagueData.data.listLeagues.items);
      setLeagueList(leagueData.data.listLeagues.items);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  };

  const checkPlayer = React.useCallback((playerData, p_id) => {
    try {
      const players = playerData.data.listPlayers.items;
      // console.log('Players>>>>>>>>>>>>>>', players);
      for (var i = 0; i < players.length; i++) {
        if (players[i].c_id === p_id) {
          return false;
        }
      }
      return true;
    } catch (err) {
      console.log('error fetching players', err);
    }
  }, []);

  const getAvatar = React.useCallback(() => {
    setAvatarModal(true);
  }, []);

  const addPlayer = React.useCallback(
    async (username, p_id) => {
      console.log('uuslee', username, p_id);
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
        console.log('>>>>>>>>>>>>>>>>>>>>', res);
        console.log('Player Created');
      } catch (err) {
        console.log('error creating Player:', err);
      }
    },
    [selectedItem],
  );

  const getSchedule = React.useCallback(async () => {
    try {
      const scheduleData = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            date: {eq: '6/18/2021'},
            // leagueID: {eq: 'afe7d6a5-8053-4007-ae6a-c52be55ed7fa'},
          },
        }),
      );
      const todos = scheduleData.data.listSchedules.items;
      console.log('Schedule>>>>>>>>>>>>>>', todos);
      setSchedule(todos);
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
                {userInfo === undefined ? undefined : (
                  <Image source={userInfo.avatar} style={styles.profileImage} />
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
          <Text
            style={{
              color: COLORS.greyText,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.7),
              marginLeft: wp(4),
              marginVertical: hp(2),
            }}>
            COMING MATCHES
          </Text>
          <View>
            <FlatList
              data={schedule}
              keyExtractor={item => item.id}
              renderItem={renderSchedule}
            />
          </View>
          {/* <View>
            <TouchableOpacity
              onPress={() => {
                showNotification(
                  'Hippo League ehleh gej baina!',
                  'burtguulne uu!',
                );
              }}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.7),
                  marginLeft: wp(4),
                  marginVertical: hp(2),
                }}>
                Test notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleScheduleNotification(
                  'Hippo League ehleh gej baina!',
                  'burtguulne uu!',
                )
              }>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.7),
                  marginLeft: wp(4),
                  marginVertical: hp(2),
                }}>
                Test scheduled notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.7),
                  marginLeft: wp(4),
                  marginVertical: hp(2),
                }}>
                Cancel all notification
              </Text>
            </TouchableOpacity>
          </View> */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: hp(2),
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
    height: hp(6.65),
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
    marginVertical: 8,
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
