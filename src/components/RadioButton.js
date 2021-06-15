import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';

const RadioButton = ({onPress, selected, children}) => {
  return (
    <View style={styles.radioButtonContainer}>
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
  radioButtonContainer: {},
  genderText: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.7),
  },
});

export default RadioButton;
