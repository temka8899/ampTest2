import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';
export default function CountScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <StatusBar hidden />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => alert('1')} style={styles.addBtn}>
          <TouchableOpacity style={styles.removeBtn} onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <TouchableOpacity style={styles.removeBtn} onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity style={styles.addBtnA} onPress={() => alert('1')}>
          <View>
            <Image source={images.men} style={styles.removeBtn} />
          </View>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtnA} />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image source={icons.removeBtn} style={styles.removeBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.brand,
            width: wp(16),
            height: hp(5),
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: wp(42),
          }}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(2.3),
            }}>
            10
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
    // transform: [{rotate: '180deg'}],
  },
  addBtnA: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
    // flexDirection: 'row',
    alignItems: 'flex-end',
  },
  removeBtn: {
    resizeMode: 'contain',
    width: wp(8),
    height: hp(4.2),
  },
  removeBtnA: {
    resizeMode: 'contain',
    width: wp(10),
    height: hp(5.2),
    marginTop: hp(6),
  },
});
