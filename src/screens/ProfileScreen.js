import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
  Modal,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {RFPercentage} from 'react-native-responsive-fontsize';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import LeaguePicker from '../components/LeaguePicker';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import CircleXp from '../components/CircleXp';
import {listPlayers} from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../App';

const Profile = ({navigation}) => {
  const [isLoading, setLoading] = React.useState(true);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState();
  const [xpPercent, setXpPercent] = useState('');
  const {userInfo} = React.useContext(AuthContext);

  useEffect(() => {
    getUser();
    getXp();
  }, [getUser, getXp]);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };

  const getXp = React.useCallback(async () => {
    try {
      let max = userInfo.level * 50;
      let xp = userInfo.xp;
      setLoading(false);
      setXpPercent((xp * 100) / max);
    } catch (err) {
      console.log('aldaa', err);
    }
  }, [userInfo.level, userInfo.xp]);

  const getUser = React.useCallback(async () => {
    console.log('object');
    console.log(`userInfo`, userInfo);
  }, [userInfo]);

  async function isAdmin() {
    if (userInfo.admin) {
      setAdminVisible(true);
      console.log('admin');
    } else {
      setAdminVisible(false);
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <SkeletonPlaceholder
          speed={800}
          backgroundColor={'#E1E9EE'}
          highlightColor={'#F2F8FC'}>
          <View>
            <View style={{paddingHorizontal: hp(2)}}>
              <View
                style={{
                  alignSelf: 'flex-end',
                  width: wp(10),
                  height: hp(8),
                }}
              />
            </View>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <View
                style={{
                  width: wp(30),
                  height: wp(30),
                  borderRadius: 60,
                  marginRight: wp(4),
                }}
              />
              <View style={{justifyContent: 'center'}}>
                <View
                  style={{
                    width: wp(40),
                    height: hp(4),
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    marginTop: hp(1),
                    width: wp(30),
                    height: hp(4),
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginTop: hp(20),
                width: wp(90),
                height: hp(4),
                borderRadius: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: hp(2),
              }}>
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
            <View
              style={{
                width: wp(80),
                height: 1,
                alignSelf: 'center',
                marginTop: hp(1),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: hp(2),
              }}>
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
            <View
              style={{
                width: wp(80),
                height: 1,
                alignSelf: 'center',
                marginTop: hp(1),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: hp(2),
              }}>
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
            <View
              style={{
                width: wp(80),
                height: 1,
                alignSelf: 'center',
                marginTop: hp(1),
              }}
            />
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View>
          <View
            style={{
              width: wp(100),
              height: hp(7),
              // borderColor: 'red',
              // borderWidth: 1,
              paddingHorizontal: wp(3),
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              {/* {adminVisible ? ( */}
              <TouchableOpacity
                onPress={() => navigation.navigate('AdminScreen')}>
                <Image source={icons.plus} style={styles.plusBtn} />
              </TouchableOpacity>
              {/* ) : null} */}
            </View>
            <TouchableOpacity onPress={() => navigation.replace('Auth')}>
              <Image source={icons.logOut} style={styles.plusBtn} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp(100),
              height: hp(16),
              // borderColor: 'red',
              // borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: wp(80),
                height: hp(16),
                // borderColor: 'red',
                // borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <CircleXp fill={xpPercent} />
              <View style={{flexDirection: 'column', marginLeft: wp(3)}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // borderColor: 'red',
                    // borderWidth: 1,
                  }}>
                  <Text
                    style={[{fontSize: RFPercentage(2.5)}, styles.profileText]}>
                    {userInfo.name}
                  </Text>
                  <TouchableOpacity>
                    <Image
                      source={icons.editBtn}
                      style={{
                        width: wp(7.53),
                        height: hp(6.09),
                        resizeMode: 'contain',
                        marginLeft: wp(2),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // borderColor: 'red',
                    // borderWidth: 1,
                  }}>
                  <Text
                    style={[{fontSize: RFPercentage(2)}, styles.profileText]}>
                    Level
                  </Text>
                  <Text style={styles.level}>{userInfo.level}</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: hp(8),
              marginBottom: hp(2),
              // borderColor: 'red',
              // borderWidth: 1,
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
            style={{
              height: hp(6),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: wp(3),
              borderBottomColor: COLORS.brand,
              borderTopColor: COLORS.brand,
              borderWidth: 1,
            }}>
            <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
              {chooseData == '' ? 'Select' : chooseData.game.name}
            </Text>
            <Image
              source={icons.drop}
              style={{resizeMode: 'contain', height: hp(1.7), width: wp(4.53)}}
            />
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
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  level: {
    fontFamily: FONTS.brandFont,
    color: COLORS.brand,
    fontSize: RFPercentage(2),
    marginLeft: wp(2),
  },
  profileText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.white,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
  },
  plusBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
});

export default Profile;
