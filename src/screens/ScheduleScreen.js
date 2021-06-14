import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  Image,
  View,
  TouchableOpacity,
  Touchable,
  Modal,
  StatusBar,
} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {DATA} from './GameScreen';
import AppBar from '../components/AppBar';
import {COLORS, FONTS, icons} from '../constants';
import GamePicker from '../components/GamePicker';
import {hp, wp} from '../constants/theme';
import color from 'color';
import LeaguePicker from '../components/LeaguePicker';

export const ScheduleData = [
  {
    id: '0',
    title: 'NBA 2K21',
    image: require('../assets/images/nba.png'),
  },
  {
    id: '1',
    title: 'FIFA 2021',
    image: require('../assets/images/fifa.png'),
  },
  {
    id: '2',
    title: 'Table Soccer',
    image: require('../assets/images/table.png'),
  },
];

const ScheduleScreen = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseDay, setChooseDay] = useState('1');

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
    setLoading(false);
    console.log('League bainuu', option);
  };

  let itemID = 0;

  if (route.params?.itemId) {
    itemID = route.params.itemId;
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
            <View>
              <View style={{width: wp(100), height: hp(4)}} />
              <View
                style={{width: wp(100), height: hp(3), marginVertical: hp(1)}}
              />
              <View style={{width: wp(100), height: hp(3)}} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: hp(10),
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
          <AppBar />
          <TouchableOpacity
            onPress={() => changeModalVisible(true)}
            style={{
              height: hp(6),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: wp(3),
              borderBottomColor: COLORS.brand,
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
          <View
            style={{
              width: wp(100),
              height: hp(6),
              borderWidth: 1,
              borderBottomColor: COLORS.brand,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setChooseDay(1)}>
              <Text
                style={[
                  {color: chooseDay == 1 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Mon
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(2)}>
              <Text
                style={[
                  {color: chooseDay == 2 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Tue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(3)}>
              <Text
                style={[
                  {color: chooseDay == 3 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Wed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(4)}>
              <Text
                style={[
                  {color: chooseDay == 4 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Thu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseDay(5)}>
              <Text
                style={[
                  {color: chooseDay == 5 ? COLORS.brand : COLORS.greyText},
                  styles.dayBtn,
                ]}>
                Fri
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{margin: wp(10)}}
            onPress={() => navigation.navigate('CountScreen')}>
            <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
              START
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dayBtn: {
    fontFamily: FONTS.brandFont,
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
});

export default ScheduleScreen;
