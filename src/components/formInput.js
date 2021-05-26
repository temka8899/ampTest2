import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {wp, hp, ft, FONTS, COLORS} from '../constants/constants';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const FormInput = props => {
  return (
    <View>
      <TextInput
        {...props}
        style={styles.input}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
      />
      <View
        style={{
          height: hp(0.3),
          width: wp(55.2),
          // marginTop: -hp(1),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp(4),
    width: wp(55.2),
    padding: 0,
  },
});

export default FormInput;
