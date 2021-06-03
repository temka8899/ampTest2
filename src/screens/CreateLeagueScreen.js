import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Modal,
  StatusBar,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import GamePicker from '../components/GamePicker';
import DatePicker from 'react-native-datepicker';
import color from 'color';

const CreateLeagueScreen = ({navigation}) => {
  const [chooseData, setChooseData] = useState('Table Soccer');
  const [modalVisible, setModalVisible] = useState(false);
  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };
  const [date, setDate] = useState('09-10-2020');
  const hrs = new Date().getDate();
  const [isTeam, setIsTeam] = useState(true);

  const changeIsTeam = bool => {
    setIsTeam(bool);
  };
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
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: hp(1)}}>
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
          <GamePicker
            changeModalVisible={changeModalVisible}
            setData={setData}
          />
        </Modal>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: hp(3),
        }}>
        <Image
          source={images.table}
          style={{
            width: wp(59.3),
            height: hp(32),
          }}
        />
        <View style={{marginTop: hp(4)}}>
          <Text style={[styles.text, {color: COLORS.greyText}]}>Start</Text>
          {/* <Text style={[styles.text, {color: COLORS.greyText}]}>{hrs}</Text> */}
          <DatePicker
            style={styles.datePickerStyle}
            date={date}
            mode="date"
            placeholder="select date"
            format="YYYY MM DD"
            minDate="1921-01-01"
            maxDate="2016-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderWidth: 0,
                alignItems: 'flex-start',
              },
              dateText: {
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
              },
            }}
            onDateChange={date => {
              setDate(date);
            }}
          />
          <View
            style={{
              height: hp(9),
              width: wp(30),
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => changeIsTeam(false)}>
              <Image
                source={isTeam ? icons.Profile : icons.ProfileFill}
                resizeMode="contain"
                style={{
                  width: wp(8),
                  height: hp(5),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeIsTeam(true)}>
              <Image
                source={isTeam ? icons.teamFill : icons.team}
                resizeMode="contain"
                style={{
                  width: wp(16),
                  height: hp(5),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'column',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLeagueScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create League</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  teamText: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2),
  },
  text: {
    fontFamily: FONTS.brandFont,
  },
  createBtn: {
    height: hp(5),
    width: wp(75),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2),
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  datePickerStyle: {
    width: wp(40),
  },
});
export default CreateLeagueScreen;
