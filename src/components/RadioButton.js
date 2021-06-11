import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {hp, wp} from '../constants/theme';
import {images, icons, COLORS, SIZES, FONTS} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const RadioButton = ({onPress, selected, children}) => {
  return (
    <View style={styles.radioButtonContainer}>
      {/* <TouchableOpacity onPress={onPress} style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            {color: selected ? COLORS.purpleText : COLORS.tabgrey},
            styles.genderText,
          ]}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  radioButtonContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    // width: wp(55),
  },
  genderText: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.7),
  },
});

export default RadioButton;
