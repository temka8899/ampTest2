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

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import GamePicker from '../components/GamePicker';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import CircleXp from '../components/CircleXp';

const Profile = ({navigation}) => {
  const [isLoading, setLoading] = React.useState(true);
  const [chooseData, setChooseData] = useState('Table Soccer');
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseDay, setChooseDay] = useState('1');
  const [currentUser, setCurrentUser] = useState();

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };
  useEffect(() => {
    getUser();
  }, []);
  async function getUser() {
    const user = await Auth.currentUserInfo();
    console.log('USER =======', user);
    setCurrentUser(user);
    setLoading(false);
  }

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content" />
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
        <TouchableOpacity onPress={() => navigation.navigate('AdminScreen')}>
          <Image source={icons.plus} style={styles.plusBtn} />
        </TouchableOpacity>
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
          <CircleXp />
          <View style={{flexDirection: 'column', marginLeft: wp(3)}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // borderColor: 'red',
                // borderWidth: 1,
              }}>
              <Text style={[{fontSize: RFPercentage(2.5)}, styles.profileText]}>
                {currentUser.attributes['custom:Name']}
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
              <Text style={[{fontSize: RFPercentage(2)}, styles.profileText]}>
                Level
              </Text>
              <Text style={styles.level}>
                {currentUser.attributes['custom:IntLevel']}
              </Text>
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
          {chooseData}
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
        <GamePicker changeModalVisible={changeModalVisible} setData={setData} />
      </Modal>
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
