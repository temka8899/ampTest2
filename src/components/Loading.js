import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {COLORS} from '../constants';
import {hp, wp} from '../constants/theme';

const CustomButton = ({
  disabled,
  styleAdd,
  loading,
  typStyle,
  text,
  onPress,
}) => {
  const [btnLoad, setLoading] = React.useState(false);

  const pressBtn = () => {
    onPress();
    setLoading(true);
  };

  return (
    <TouchableOpacity
      onPress={pressBtn}
      disabled={disabled}
      style={[styles.onGoingBtn, styleAdd]}>
      {loading && btnLoad ? (
        <ActivityIndicator size="small" color={COLORS.brand} />
      ) : (
        <Text style={typStyle}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  onGoingBtn: {
    width: wp(35),
    height: hp(3),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
});

export default CustomButton;
