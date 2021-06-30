import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {COLORS, FONTS, hp, wp} from '../constants/theme';
import {icons, images} from '../constants';
import Modal from 'react-native-modal';
import {EndModalForm} from '../components/EndModalForm';

import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import API, {graphqlOperation} from '@aws-amplify/api';
import {listPlayers, listTeamPlayers} from '../graphql/queries';
import Auth from '@aws-amplify/auth';
import {AuthContext} from '../../App';

const tempData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const tempData2 = ['+1', '+2', '+3', 'OK'];
const tempData3 = ['clear', 'back'];
const ScoreButton = ({item, onPress, select}) => {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        disabled={select === '' ? true : false}
        style={[styles.animButton, {backgroundColor: COLORS.brand}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};
function ScoreButton2({item, onPress}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
function ScoreButton3({item, onPress}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

export default function FormInterface({navigation, route}) {
  const [CancelModalVisible, setCancelModalVisible] = useState(false);
  const [EndModalVisible, setEndModalVisible] = useState(false);
  const [select, setSelect] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [MatchData, setMatchData] = useState();
  const [HomeID, setHomeID] = useState();
  const [AwayID, setAwayID] = useState();
  const [HomeAvatars, setHomeAvatars] = useState();
  const [AwayAvatars, setAwayAvatars] = useState();
  const [imgLoad, setImgLoad] = useState(true);
  const [HomeName, setHomeName] = useState();
  const [AwayName, setAwayName] = useState();
  const [loading, setLoading] = useState(false);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);

  useEffect(() => {
    const ScheduleData = route.params.match;
    setMatchData(ScheduleData);
    console.log(`ScheduleData`, ScheduleData.home.name);
    getPlayerData(ScheduleData);
  }, [getPlayerData, route.params.match]);
  const toggleCancelModal = bool => {
    setCancelModalVisible(bool);
  };
  const getPlayerData = React.useCallback(item => {
    if (item !== null) {
      setImgLoad(false);
    }
    let homePlayersID1 = item.homePlayers.split('[');
    let homePlayersID2 = homePlayersID1[1].split(']');
    let homePlayersID = homePlayersID2[0].split(', ');
    let awayPlayersID1 = item.awayPlayers.split('[');
    let awayPlayersID2 = awayPlayersID1[1].split(']');
    let awayPlayersID = awayPlayersID2[0].split(', ');
    setHomeID(homePlayersID);
    setAwayID(awayPlayersID);
    let homeImages1 = item.homeImage.split('[');
    let homeImages2 = homeImages1[1].split(']');
    let homeImages = homeImages2[0].split(', ');
    let awayImages1 = item.awayImage.split('[');
    let awayImages2 = awayImages1[1].split(']');
    let awayImages = awayImages2[0].split(', ');
    setHomeAvatars(homeImages);
    setAwayAvatars(awayImages);
    setHomeName(item.home.name);
    setAwayName(item.away.name);
  }, []);

  // async function fetchTeamPlayers(id) {
  //   try {
  //     const leagueData = await API.graphql(
  //       graphqlOperation(listTeamPlayers, {
  //         filter: {teamID: {eq: `${id}`}},
  //       }),
  //     );
  //     const todos = leagueData.data.listTeamPlayers.items;
  //     console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
  //     return todos;
  //   } catch (err) {
  //     console.log('error fetching todos', err);
  //   }
  // }
  function CancelModal() {
    return (
      <View>
        <Modal
          animationIn="rubberBand"
          isVisible={CancelModalVisible}
          onBackdropPress={() => toggleCancelModal(false)}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: wp(70),
              height: wp(40),
              backgroundColor: COLORS.background,
              borderColor: COLORS.brand,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: wp(25),
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={() => navigation.pop()}>
                <Text style={styles.modalBtnText}>End Match</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={() => toggleCancelModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  const HomeScorePlaceholder = () => {
    if (homeScore.toString().length === 3) {
      return null;
    } else if (homeScore.toString().length === 2) {
      return '0';
    } else {
      return '00';
    }
  };

  const AwayScorePlaceholder = () => {
    if (awayScore.toString().length === 3) {
      return null;
    } else if (awayScore.toString().length === 2) {
      return '0';
    } else {
      return '00';
    }
  };
  const addNumber = item => {
    if (select === 'home') {
      if (homeScore.toString().length <= 2) {
        if (homeScore === 0) {
          setHomeScore(item);
        } else {
          let temp = homeScore.toString() + item;
          setHomeScore(temp);
        }
      }
    } else {
      if (awayScore.toString().length <= 2) {
        if (awayScore === 0) {
          setAwayScore(item);
        } else {
          let temp = awayScore.toString() + item;
          setAwayScore(temp);
        }
      }
    }
  };

  const clearBack = item => {
    if (select === 'home') {
      if (item === 'clear') {
        setHomeScore(0);
      } else {
        if (homeScore.toString().length === 1) {
          setHomeScore(0);
        } else {
          let temp = homeScore
            .toString()
            .substring(0, homeScore.toString().length - 1);
          setHomeScore(temp);
        }
      }
    } else {
      if (item === 'clear') {
        setAwayScore(0);
      } else {
        if (awayScore.toString().length === 1) {
          setAwayScore(0);
        } else {
          let temp = awayScore
            .toString()
            .substring(0, awayScore.toString().length - 1);
          setAwayScore(temp);
        }
      }
    }
  };
  const doublePlus = item => {
    if (select === 'home') {
      if (item !== 'OK') {
        let sub = item.substring(1, item.toString().length);
        let temp = parseInt(homeScore) + parseInt(sub);
        if (temp > 999) {
          setHomeScore(homeScore);
        } else {
          setHomeScore(temp);
        }
      } else {
        setHomeScore(homeScore);
        setSelect('');
      }
    } else {
      if (item !== 'OK') {
        let sub = item.substring(1, item.toString().length);
        let temp = parseInt(awayScore) + parseInt(sub);
        if (temp > 999) {
          setAwayScore(awayScore);
        } else {
          setAwayScore(temp);
        }
      } else {
        setAwayScore(awayScore);
        setSelect('');
      }
    }
  };
  const toggleEndModal = bool => {
    setEndModalVisible(bool);
  };
  const cancelBtnPress = () => {
    toggleEndModal(false);
  };
  const EndBtnPress = async () => {
    setLoading(true);
    await UpdateSchedule();
    const user = await Auth.currentUserInfo();
    findUser(user);
    toggleEndModal(false);
    setLoading(false);
    navigation.pop();
  };
  const findUser = React.useCallback(
    async user => {
      const playerData = await API.graphql(graphqlOperation(listPlayers));
      let finded = playerData.data.listPlayers.items.find((item, index) => {
        if (user.username === item.c_id) {
          return item;
        }
      });
      setUserInfo(finded);
    },
    [setUserInfo],
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => toggleCancelModal(true)}>
        <Image source={icons.backWhiteBtn} style={styles.backBtn} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: wp(10),
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: wp(4),
              marginBottom: wp(2),
            }}>
            {HomeName}
          </Text>
          {HomeAvatars && (
            <View style={{flexDirection: 'row'}}>
              {HomeAvatars.map(_item => {
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
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: wp(4),
              marginBottom: wp(2),
            }}>
            {AwayName}
          </Text>
          {AwayAvatars && (
            <View style={{flexDirection: 'row'}}>
              {AwayAvatars.map(_item => {
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
        </View>
      </View>

      <View style={styles.scoreBoardContainer}>
        <View
          style={{
            width: wp(90),
            height: wp(30),
            borderColor: COLORS.count,
            borderWidth: 2,
            backgroundColor: 'black',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(90),
              height: wp(10),
              backgroundColor: COLORS.count,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>HOME</Text>
            </View>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>AWAY</Text>
            </View>
          </View>
          <View
            style={{
              width: wp(90),
              height: wp(35),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>888</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  {HomeScorePlaceholder()}
                </Text>
                {homeScore}
              </Text>
            </View>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>888</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  {AwayScorePlaceholder()}
                </Text>
                {awayScore}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: wp(10),
        }}>
        <View
          styles={{
            width: wp(38),
            height: wp(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setSelect('home')}
            style={[
              styles.selectSide,
              {
                width: select === 'home' ? wp(38) : wp(36),
                height: select === 'home' ? wp(10) : wp(8),
                borderColor: select === 'home' ? COLORS.white : COLORS.count,
              },
            ]}>
            <Text
              style={{
                color: select === 'home' ? COLORS.white : '#ffffff50',
                fontFamily: FONTS.brandFont,
                fontSize: wp(3.5),
              }}>
              HOME
            </Text>
          </TouchableOpacity>
        </View>
        <View
          styles={{
            width: wp(38),
            height: wp(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setSelect('away')}
            style={[
              styles.selectSide,
              {
                width: select === 'away' ? wp(38) : wp(36),
                height: select === 'away' ? wp(10) : wp(8),
                borderColor: select === 'away' ? COLORS.white : COLORS.count,
              },
            ]}>
            <Text
              style={{
                color: select === 'away' ? COLORS.white : '#ffffff50',
                fontFamily: FONTS.brandFont,
                fontSize: wp(3.5),
              }}>
              AWAY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: wp(5),
          width: wp(90),
          height: wp(47.5),
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: wp(66),
          }}>
          {tempData.map(item => (
            <ScoreButton
              key={item}
              item={item}
              onPress={() => addNumber(item)}
              select={select}
            />
          ))}

          {tempData3.map(item => (
            <ScoreButton3
              key={item}
              item={item}
              select={select}
              onPress={() => clearBack(item)}
            />
          ))}
        </View>
        <View
          style={{
            width: wp(24),
            height: wp(47.5),
            marginLeft: wp(1),
          }}>
          {tempData2.map(item => (
            <ScoreButton2
              key={item}
              item={item}
              select={select}
              onPress={() => doublePlus(item)}
            />
          ))}
        </View>
        <View
          style={{
            width: wp(90),
            height: wp(47.5),
            backgroundColor: COLORS.background,
            opacity: 0.7,
            zIndex: select === '' ? 2 : -1,
            position: 'absolute',
          }}
        />
      </View>
      <View
        style={{
          flex: 1,

          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.modalBtnContainer}
          onPress={() => setEndModalVisible(true)}>
          <Text style={styles.modalBtnText}>End Match</Text>
        </TouchableOpacity>
        {CancelModal()}
        {EndModalVisible && (
          <EndModalForm
            isVisible={EndModalVisible}
            onBackdropPress={() => setEndModalVisible(false)}
            HomeScore={homeScore}
            AwayScore={awayScore}
            HomeID={HomeID}
            AwayID={AwayID}
            HomeName={HomeName}
            AwayName={AwayName}
            HomeAvatars={HomeAvatars}
            AwayAvatars={AwayAvatars}
            cancelbtn={cancelBtnPress}
            EndBtn={EndBtnPress}
            loading={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  animButton: {
    width: wp(20),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(1),
    shadowColor: COLORS.brand,
    elevation: 1,
    shadowOffset: {
      width: wp(1),
      height: wp(1),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    marginLeft: wp(1.5),
    marginTop: wp(1.5),
  },
  backBtn: {
    width: wp(9),
    height: wp(9),
    opacity: 0.5,
    marginLeft: wp(5),
    marginTop: wp(3),
  },
  modalBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  modalBtnContainer: {
    backgroundColor: COLORS.brand,
    width: wp(50),
    height: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectSide: {
    backgroundColor: COLORS.count,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: wp(5),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scoreBoardContainer: {
    marginVertical: wp(15),
    backgroundColor: COLORS.count,
    width: wp(90),
    height: wp(25),
    marginHorizontal: wp(5),

    justifyContent: 'center',
    alignItems: 'center',
  },
  pointContainer: {
    width: wp(35),
    height: wp(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  placeholder: {
    fontFamily: 'CursedTimerULiL',
    color: '#ffffff10',
    fontSize: wp(18),
  },
  avatar: {
    width: wp(13),
    height: wp(13),
  },
  homeAway: {
    width: wp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeAwayText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.tabgrey,
    fontWeight: '900',
    fontSize: wp(4),
  },
});
