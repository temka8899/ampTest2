import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {AuthContext} from '../../App';
import {hp, wp} from '../constants/theme';
import CircleXp from '../components/CircleXp';
import {COLORS, FONTS, icons} from '../constants';
import {LogoutModal} from '../components/LogoutModal';
import LeaguePicker from '../components/LeaguePicker';

import {RFPercentage} from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {updatePlayer} from '../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import {listPlayers} from '../graphql/queries';

const Profile = ({navigation}) => {
  const [isLoading, setLoading] = React.useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [LogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState();
  const [xpPercent, setXpPercent] = useState('');
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  // const [xpCount, setXpCount] = useState(true);

  useEffect(() => {
    getXp();
  }, []);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };

  const getXp = React.useCallback(async () => {
    let count = true;
    let value = userInfo.xp;
    let diff = 0;
    let level = userInfo.level;
    while (count) {
      console.log('count - ', count);
      console.log('value- ', value);
      console.log('level - ', level);
      if (value < 50 * level) {
        count = false;
        diff = value;
      } else {
        value -= level * 50;
        level++;
      }
    }
    console.log(`value in last`, value);
    console.log(`diff`, diff);
    let max = level * 50;
    let xp = diff;
    updateLevel(xp, level);
    // console.log(`max`, max);
    // console.log(`xp`, xp);
    setLoading(false);

    setXpPercent((xp * 100) / max);
  }, []);

  const updateLevel = React.useCallback(
    async (xp, level) => {
      console.log('mai');
      // const level = await fetchPlayer(userInfo.id);
      const user = await Auth.currentUserInfo();
      try {
        const temp = await API.graphql(
          graphqlOperation(updatePlayer, {
            input: {
              id: userInfo.id,
              level,
              xp,
            },
          }),
        );
        console.log('Player updated', temp);
      } catch (err) {
        console.log('error updating Player: ', err);
      }
      findUser(user);
    },
    [findUser, userInfo.id],
  );

  async function fetchPlayer(id) {
    try {
      const playerData = await API.graphql(
        graphqlOperation(listPlayers, {
          filter: {id: {eq: id}},
        }),
      );

      console.log(
        'Player>>>>>>>>>>>>>>',
        playerData.data.listPlayers.items[0].id,
      );
      return playerData.data.listPlayers.items[0].level;
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }
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

  async function isAdmin() {
    if (userInfo.admin) {
      setAdminVisible(true);
      console.log('admin');
    } else {
      setAdminVisible(false);
    }
  }
  const modalHide = () => {
    setLogoutModalVisible(false);
  };
  const logout = () => {
    setLogoutModalVisible(false);
    setUserInfo('');
    navigation.navigate('Auth');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <SkeletonPlaceholder
          speed={800}
          backgroundColor={'#E1E9EE'}
          highlightColor={'gray'}>
          <View>
            <View style={{paddingHorizontal: hp(2)}}>
              <View style={styles.skeleton1} />
            </View>
            <View style={styles.skeleton2}>
              <View style={styles.skeleton2_1} />
              <View style={styles.skeleton2_2}>
                <View style={styles.skeleton2_2_1} />
                <View style={styles.skeleton2_2_2} />
              </View>
            </View>
            <View style={styles.skeleton3} />
            <View style={styles.skeleton4}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
            </View>
            <View style={styles.skeleton5} />
            <View style={styles.skeleton6}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
            </View>
            <View style={styles.skeleton7} />
            <View style={styles.skeleton8}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{width: wp(15), height: wp(15), marginRight: hp(1)}}
                />
                <View style={{width: wp(15), height: wp(15)}} />
              </View>
            </View>
            <View style={styles.skeleton9} />
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View>
          <View style={styles.header}>
            <View>
              {/* {adminVisible ? ( */}
              <TouchableOpacity
                onPress={() => navigation.navigate('AdminScreen')}>
                <Image source={icons.plus} style={styles.plusBtn} />
              </TouchableOpacity>
              {/* ) : null} */}
            </View>
            <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
              <Image source={icons.logOut} style={styles.plusBtn} />
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <View style={styles.subSubContainer}>
              <CircleXp fill={xpPercent} />
              <View style={styles.statusMain}>
                <View style={styles.statusSub}>
                  <Text
                    style={[{fontSize: RFPercentage(2.5)}, styles.profileText]}>
                    {userInfo === undefined ? `Player` : `${userInfo.name}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfileScreen')}>
                    <Image source={icons.editBtn} style={styles.editButton} />
                  </TouchableOpacity>
                </View>
                <View style={styles.levelContainer}>
                  <Text
                    style={[{fontSize: RFPercentage(2)}, styles.profileText]}>
                    Level
                  </Text>
                  <Text style={styles.level}>
                    {userInfo === undefined ? '1' : `${userInfo.level}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: hp(8),
              marginBottom: hp(2),
            }}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.7),
                marginLeft: wp(3),
              }}>
              RECENT MATCHES
            </Text>
          </View>
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
            <LogoutModal
              visible={LogoutModalVisible}
              modalHide={modalHide}
              logout={logout}
            />
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
  header: {
    width: wp(100),
    height: hp(7),
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    width: wp(100),
    height: hp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  subSubContainer: {
    width: wp(100),
    height: hp(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusMain: {
    flexDirection: 'column',
    marginLeft: wp(3),
  },
  statusSub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: wp(7.53),
    height: hp(6.09),
    resizeMode: 'contain',
    marginLeft: wp(2),
  },
  dropButton: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  skeleton1: {
    alignSelf: 'flex-end',
    width: wp(10),
    height: hp(8),
  },
  skeleton2: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  skeleton2_1: {
    width: wp(30),
    height: wp(30),
    borderRadius: 60,
    marginRight: wp(4),
  },
  skeleton2_2: {
    justifyContent: 'center',
  },
  skeleton2_2_1: {
    width: wp(40),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton2_2_2: {
    marginTop: hp(1),
    width: wp(30),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton3: {
    alignSelf: 'center',
    marginTop: hp(20),
    width: wp(90),
    height: hp(4),
    borderRadius: 10,
  },
  skeleton4: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton5: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeleton6: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton7: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeleton8: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(2),
  },
  skeleton9: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  chooseButton: {
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomColor: COLORS.brand,
    borderTopColor: COLORS.brand,
    borderWidth: 1,
  },
  level: {
    fontFamily: FONTS.brandFont,
    color: COLORS.brand,
    fontSize: RFPercentage(2),
    marginLeft: wp(2),
  },
  profileText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.white,
  },
  input: {
    height: 40,
    margin: 12,
  },
  plusBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
});

export default Profile;
