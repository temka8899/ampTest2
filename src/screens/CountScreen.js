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

import {COLORS, FONTS, icons} from '../constants';
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
          {/* <TOUCHABLE_STATE */}
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
        <TouchableOpacity style={styles.addBtn}>
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
  addBtn: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
  },
  removeBtn: {
    resizeMode: 'contain',
    width: wp(8),
    height: hp(4.2),
  },
  removeBtnM: {
    resizeMode: 'contain',
    width: wp(8),
    height: hp(4.2),
  },
});
