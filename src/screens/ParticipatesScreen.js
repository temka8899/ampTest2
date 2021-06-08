import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ImageBackground,
  Button,
} from 'react-native';
// import {DATA} from './GameScreen';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {
  createGame,
  createLeague,
  createTeam,
  createTeamPlayer,
  createLeaguePlayer,
} from '../graphql/mutations';
import LinearGradient from 'react-native-linear-gradient';
import {
  listGames,
  listLeagues,
  listPlayers,
  listTeamPlayers,
  listTeams,
  listLeaguePlayers,
  getTeam,
} from '../graphql/queries';

import AppBar from '../components/AppBar';
import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {DATA} from '../data/DATA';
import {userData} from '../data/Players';
import Modal from 'react-native-modal';
import {AuthContext} from '../../App';

const Player = ({item, index}) => (
  <View
    style={{
      width: wp(95),
      height: hp(6),
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.greyText,
      alignSelf: 'center',
    }}>
    <Text style={[{color: COLORS.greyText, marginLeft: wp(4)}, styles.player]}>
      {index + 1}
    </Text>
    <Image source={item.image} style={styles.avatar} />
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <Text
        style={[{color: COLORS.greyText, marginLeft: wp(4)}, styles.player]}>
        {item.name}
      </Text>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          width: wp(21),
        }}>
        <Text style={[{color: COLORS.greyText}, styles.player]}>lvl </Text>
        <Text style={[{color: COLORS.brand}, styles.player]}>{item.level}</Text>
      </View>
    </View>
  </View>
);

const ParticipatesScreen = ({navigation, route}) => {
  const [leagueId, setLeagueId] = useState('');
  const [PlayerID, setPlayerID] = useState('');
  const [participants, setParticipants] = useState([]);
  const {userInfo} = React.useContext(AuthContext);

  const fetchLeague = async () => {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Leagues>>>>>>>>>>>>>>', leagueData.data.listLeagues.items);
      setLeagueId(leagueData.data.listLeagues.items[0].id);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  };

  useEffect(() => {
    fetchLeague();
    getPlayerId();
  }, []);

  const sorted = userData.sort((a, b) => b.level - a.level);

  const renderPlayers = ({item, index}) => <Player item={item} index={index} />;

  const gameInfo = route.params.itemId;

  console.log('gameInfo', gameInfo);

  const [inLeague, setInLeague] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };
  const changeInLeague = bool => {
    setInLeague(bool);
  };

  const getPlayerId = async () => {
    try {
      const playerData = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {c_id: {eq: userInfo.c_id}},
        }),
      );
      setPlayerID(playerData.data.listPlayers.items[0].id);
      console.log('Player ID', playerData.data.listPlayers.items[0].id);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  };

  const addPlayerBtn = async () => {
    try {
      await API.graphql(
        graphqlOperation(createLeaguePlayer, {
          input: {
            leaguePlayerLeagueId: leagueId,
            leaguePlayerPlayerId: PlayerID,
          },
        }),
      );
      console.log('League Player Created');
    } catch (err) {
      console.log('error creating League Player:', err);
    }
    LeaguePlayers();
  };

  const LeaguePlayers = async () => {
    try {
      const leaguePlayerData = await API.graphql(
        graphqlOperation(listLeaguePlayers),
      );
      const data = leaguePlayerData.data.listLeaguePlayers.items;
      console.log('League Player>>>>>>>>>>>>>>', data);
      setParticipants(data.player);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  };

  function bottomModal() {
    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onSwipeComplete={() => changeModalVisible(false)}
          swipeDirection="down"
          style={{margin: 0}}>
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setModalVisible(!isModalVisible);
              }}></TouchableOpacity>
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                textAlign: 'center',
                color: COLORS.white,
                width: wp(70),
                lineHeight: hp(2),
                marginTop: hp(2),
              }}>
              {!inLeague
                ? 'Do you agree to participate in the league?'
                : 'Do you agree to out from the league?'}
            </Text>
            <TouchableOpacity
              style={{
                width: wp(85),
                height: hp(6),
                backgroundColor: COLORS.brand,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp(3),
              }}
              onPress={() => {
                {
                  inLeague ? changeInLeague(false) : changeInLeague(true),
                    setModalVisible(false),
                    addPlayerBtn();
                }
              }}>
              <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
                {!inLeague ? "Yes, I'm in" : "Yes, I'm out"}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        flexDirection: 'column',
      }}>
      <StatusBar barStyle="light-content" />
      <AppBar />
      <View
        style={{
          width: wp(100),
          height: hp(6),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: wp(2),
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
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
            {!inLeague ? "I'm in" : "I'm out"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: wp(100),
          height: hp(40),
          borderWidth: 1,
        }}>
        <ImageBackground
          source={{
            uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${gameInfo.game.image}`,
          }}
          style={{
            alignSelf: 'center',
            width: wp(63.3),
            height: hp(39),
          }}
          imageStyle={{borderRadius: 40}}>
          <LinearGradient
            style={{flex: 1, borderRadius: 40}}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00000000', '#000']}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                marginBottom: hp(5),
                marginHorizontal: wp(5),
              }}>
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
      <View
        style={{
          height: hp(5),
          justifyContent: 'center',
          paddingLeft: wp(7),
          marginVertical: hp(1),
        }}>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.brandFont,
            alignSelf: 'center',
          }}>
          {gameInfo.description}
        </Text>
        <Button title="test fetch" onPress={() => fetchLeague()} />
      </View>
      <FlatList data={sorted} renderItem={renderPlayers} />
      {bottomModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  player: {
    fontFamily: FONTS.brandFont,
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
  modalBtn: {
    width: wp(84.53),
    height: hp(5.43),
    borderRadius: 12,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(7.735),
    marginTop: hp(2),
  },
});

export default ParticipatesScreen;
