import React from 'react';

import {View, TextInput, StyleSheet} from 'react-native';
import {wp, hp, FONTS, COLORS} from '../constants/theme';

import {RFPercentage} from 'react-native-responsive-fontsize';

const FormInput = props => {
  return (
    <View>
      <TextInput
        {...props}
        style={styles.input}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        placeholderTextColor={COLORS.purpleText}
      />
      <View
        style={{
          height: hp(0.3),
          width: wp(55.2),
          backgroundColor: COLORS.purpleText,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp(4),
    width: wp(55.2),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.5),
    padding: 0,
  },
});

export default FormInput;
