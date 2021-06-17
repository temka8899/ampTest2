import React from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';

import {RFPercentage} from 'react-native-responsive-fontsize';

const AdminScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
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
      <View style={{alignSelf: 'center', marginTop: hp(1)}}>
        <TouchableOpacity onPress={() => {}} style={styles.createBtn}>
          <Text style={styles.createBtnText}>Delete League</Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  },
});
export default AdminScreen;
