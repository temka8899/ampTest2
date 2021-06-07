import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  StatusBar,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import GamePicker from '../components/GamePicker';

const AdminScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('createGameScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLeagueScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create League</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('createTeamScreen')}
          style={styles.createBtn}>
          <Text style={styles.createBtnText}>Team</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  createBtn: {
    width: wp(45),
    height: hp(5),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.6),
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  backButton: {
    width: wp(100),
    height: hp(7),
    paddingHorizontal: wp(3),
    flexDirection: 'column',
  },
  ButtonContainer: {
    flex: 1,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});
export default AdminScreen;
