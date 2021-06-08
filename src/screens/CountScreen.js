import React from 'react';
import {StyleSheet, Text, StatusBar, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';
export default function CountScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View
        style={[
          {
            transform: [{rotate: '180deg'}],
          },
          styles.subContainer,
        ]}>
        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View style={styles.avatarScore}>
            <Image
              source={images.men}
              style={[{marginLeft: wp(2)}, styles.image]}
            />
            <Text style={styles.personScore}>10</Text>
          </View>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(2.3),

                marginTop: wp(2),
                marginRight: wp(2),
              }}>
              10
            </Text>
            <Image
              source={images.men}
              style={[{marginRight: wp(2)}, styles.image]}
            />
          </View>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtn} />
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: wp(2), marginTop: hp(25)}}>
            <Image source={icons.backWhiteBtn} style={styles.backBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>10</Text>
        </View>
      </View>

      <View style={styles.subContainer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View style={styles.avatarScore}>
            <Image
              source={images.men}
              style={[{marginLeft: wp(2)}, styles.image]}
            />
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(2.3),

                marginTop: wp(2),
                marginLeft: wp(2),
              }}>
              10
            </Text>
          </View>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(2.3),

                marginTop: wp(2),
                marginRight: wp(2),
              }}>
              10
            </Text>
            <Image
              source={images.men}
              style={[{marginRight: wp(2)}, styles.image]}
            />
          </View>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>10</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarScore: {
    flexDirection: 'row',
    width: wp(49),
    alignItems: 'center',
  },
  personScore: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),

    marginTop: wp(2),
    marginLeft: wp(2),
  },
  image: {
    width: wp(9.6),
    height: hp(4.43),
    marginTop: wp(2),
  },
  teamScoreContainer: {
    position: 'absolute',
    backgroundColor: COLORS.brand,
    width: wp(16),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(42),
  },
  teamScore: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),
  },
  addBtn: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
  },
  removeBtn: {
    resizeMode: 'contain',
    width: wp(10),
    height: hp(5.2),
  },
  backBtn: {
    width: wp(9.6),
    height: hp(4.43),
    position: 'absolute',
    transform: [{rotate: '180deg'}],
    alignSelf: 'flex-end',
  },
});
