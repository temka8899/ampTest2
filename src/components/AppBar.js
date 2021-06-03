import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {icons, images, index, theme} from '../constants';
import {wp, hp, ft, FONTS, COLORS} from '../constants/theme';

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HIPPOLEAGUE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(3),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.8),
  },
});

export default AppBar;
