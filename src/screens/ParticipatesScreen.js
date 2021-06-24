import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {AuthContext} from '../../App';
import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';

import {userData} from '../data/Players';

import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {RFPercentage} from 'react-native-responsive-fontsize';

import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';

import {
  listPlayers,
  listLeaguePlayers,
  getTeam,
  getLeague,
} from '../graphql/queries';

import {
  createLeaguePlayer,
  deleteLeaguePlayer,
  deleteLeague,
} from '../graphql/mutations';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const ParticipatesScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(true);
  const [deleteID, setDeleteID] = useState('');
  const [PlayerID, setPlayerID] = useState('');
  const [myID, setMyID] = useState('');
  const [leaguePlayers, setLeaguePlayers] = useState([]);
  const {userInfo} = React.useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [inLeague, setInLeague] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    // checkInLeague();
    LeaguePlayers();
    fetchLeague();
    getPlayerId();
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, [LeaguePlayers, fetchLeague, getPlayerId]);

  useEffect(() => {
    getPlayerId();
    LeaguePlayers();
    fetchLeague();
  }, [LeaguePlayers, checkInLeague, fetchLeague, getPlayerId]);

  const sorted = leaguePlayers.sort((a, b) => b.player.level - a.player.level);
  const gameInfo = route.params.itemId;
  const LeagueId = route.params.itemId.id;
  const _isStart = route.params.itemId.isStart;

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const addPlayerBtn = async () => {
    try {
      await API.graphql(
        graphqlOperation(createLeaguePlayer, {
          input: {
            leaguePlayerLeagueId: LeagueId,
            leaguePlayerPlayerId: myID,
            playerID: myID,
            leagueID: LeagueId,
          },
        }),
      );
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (err) {}
  };

  const DeleteLeaguePlayer = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteLeaguePlayer, {
          input: {
            id: deleteID,
          },
        }),
      );
      // setLeaguePlayers(leaguePlayers.splice(1, 1));
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (err) {}
  };

  const DeleteLeague = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteLeague, {
          input: {
            leagueID: LeagueId,
          },
        }),
      );
      // setLeaguePlayers(leaguePlayers.splice(1, 1));
    } catch (err) {}
  };

  const checkInLeague = React.useCallback(
    async my_id => {
      try {
        setMyID(my_id);
        const leaguePlayerData = await API.graphql(
          graphqlOperation(listLeaguePlayers, {
            filter: {
              playerID: {eq: my_id},
              leagueID: {eq: LeagueId},
            },
          }),
        );
        console.log('CHECK IF IM IN :>> ', leaguePlayerData);
        const todos = await leaguePlayerData.data.listLeaguePlayers.items;
        if (todos.length === 0) {
          setInLeague(false);
        } else {
          setDeleteID(todos[0].id);
          setInLeague(true);
        }
      } catch (err) {}
      setLoading(false);
    },
    [LeagueId],
  );

  const getPlayerId = React.useCallback(async () => {
    try {
      const playerData = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {c_id: {eq: userInfo.c_id}},
        }),
      );
      let my_id = playerData.data.listPlayers.items[0].id;
      console.log('my_id :>> ', my_id);
      // await setPlayerID(playerData.data.listPlayers.items[0].id);
      checkInLeague(my_id);
    } catch (err) {}
  }, [checkInLeague, userInfo.c_id]);

  const fetchLeague = React.useCallback(async () => {
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            leagueID: {eq: LeagueId},
          },
        }),
      );
      const todos = leaguePlayerData.data.listLeaguePlayers.items;
    } catch (err) {}
  }, [LeagueId]);

  const LeaguePlayers = React.useCallback(async () => {
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers, {
          filter: {
            leagueID: {eq: LeagueId},
          },
        }),
      );
      const data = await leaguePlayerData.data.listLeaguePlayers.items;
      setLeaguePlayers(data);
      console.log('data :>> ', data);
    } catch (err) {}
  }, [LeagueId]);

  function bottomModal() {
    return (
      <View style={styles.modalContainer}>
        <Modal
          isVisible={isModalVisible}
          animationType="fade"
          transparent={true}
          onSwipeComplete={() => changeModalVisible(false)}
          swipeDirection="down"
          onBackdropPress={() => {
            setModalVisible(false);
          }}
          style={styles.modal}>
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setModalVisible(!isModalVisible);
              }}
            />
            <Text style={styles.modalText}>
              {!inLeague
                ? 'Do you agree to participate in the league?'
                : 'Do you agree to out from the league?'}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                {
                  inLeague
                    ? [
                        setInLeague(false),
                        DeleteLeaguePlayer(),
                        setModalVisible(false),
                      ]
                    : [
                        addPlayerBtn(),
                        setInLeague(true),
                        setModalVisible(false),
                      ];
                }
              }}>
              <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
                {inLeague ? "Yes, I'm out" : "Yes, I'm in"}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <AppBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={'white'} />
        ) : _isStart === true ? (
          <TouchableOpacity
            disabled={true}
            style={[
              {
                backgroundColor: COLORS.red,
              },
              styles.btnContainer,
            ]}>
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.7),
                color: COLORS.white,
              }}>
              Started
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              {
                backgroundColor: !inLeague ? COLORS.green : COLORS.red,
              },
              styles.btnContainer,
            ]}
            onPress={() => changeModalVisible(true)}>
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.7),
                color: COLORS.white,
              }}>
              {inLeague ? "I'm out" : "I'm in"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          width: wp(100),
          height: hp(40),
          marginTop: hp(1),
        }}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${gameInfo.game.image}`,
          }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageSub}>
          <LinearGradient
            style={styles.linear}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00000000', '#000']}>
            <View style={styles.linearText}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  paddingVertical: hp(1),
                }}>
                {gameInfo.game.name}
              </Text>
              <Text style={{color: COLORS.white, fontFamily: FONTS.brandFont}}>
                {gameInfo.startDate}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{gameInfo.description}</Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={COLORS.brand}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={sorted}
        renderItem={({item, index}) => (
          <>
            {leaguePlayers.length !== 0 ? (
              <View style={styles.playerContainer}>
                <Text
                  style={[
                    {color: COLORS.greyText, marginLeft: wp(4)},
                    styles.player,
                  ]}>
                  {index + 1}
                </Text>
                <Image source={item.player.avatar} style={styles.avatar} />
                <View style={styles.playerSubContainer}>
                  <Text
                    style={[
                      {color: COLORS.greyText, marginLeft: wp(4)},
                      styles.player,
                    ]}>
                    {item.player.name}
                  </Text>
                  <View style={styles.playerSubSub}>
                    <Text style={[{color: COLORS.greyText}, styles.player]}>
                      lvl{' '}
                    </Text>
                    <Text style={[{color: COLORS.brand}, styles.player]}>
                      {item.player.level}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.playerZeroText}>
                <Text> Join the league! </Text>
              </View>
            )}
          </>
        )}
      />
      {bottomModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'column',
  },
  header: {
    width: wp(100),
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },
  backgroundImage: {
    alignSelf: 'center',
    width: wp(63.3),
    height: hp(39),
  },
  backgroundImageSub: {
    borderRadius: 40,
  },
  modal: {
    margin: 0,
  },
  modalText: {
    fontFamily: FONTS.brandFont,
    textAlign: 'center',
    color: COLORS.white,
    width: wp(70),
    lineHeight: hp(2),
    marginTop: hp(2),
  },
  modalButton: {
    width: wp(85),
    height: hp(6),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  linear: {
    flex: 1,
    borderRadius: 40,
  },
  linearText: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: hp(5),
    marginHorizontal: wp(5),
  },
  descriptionContainer: {
    height: hp(5),
    justifyContent: 'center',
    paddingLeft: wp(7),
    marginVertical: hp(1),
  },
  description: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    alignSelf: 'center',
  },
  playerContainer: {
    width: wp(95),
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    alignSelf: 'center',
  },
  playerSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  playerSubSub: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(21),
  },
  player: {
    fontFamily: FONTS.brandFont,
  },
  playerZeroText: {
    alignSelf: 'center',
  },
  avatar: {
    width: wp(9.6),
    height: hp(4.43),
    resizeMode: 'contain',
    marginLeft: wp(4),
  },
  btnContainer: {
    width: wp(31),
    height: hp(4.55),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.09),
    borderColor: 'white',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalBody: {
    height: '25%',
    marginTop: 'auto',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    borderTopColor: COLORS.white,
    borderLeftColor: COLORS.white,
    borderRightColor: COLORS.white,
    borderWidth: 1,
  },
  closeBtn: {
    marginVertical: hp(1),
    borderRadius: 20,
    width: wp(25),
    height: hp(1),
    backgroundColor: COLORS.white,
  },
});

export default ParticipatesScreen;
