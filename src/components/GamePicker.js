import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {COLORS, FONTS, hp, wp} from '../constants/theme';

const GamePicker = props => {
  const OPTIONS = ['Table Soccer', 'NBA 2K21', 'FIFA 2021'];

  const option = OPTIONS.map((item, index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  });
  const onPressItem = option => {
    props.changeModalVisible(false);
    props.setData(option);
  };
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisible(false)}
      style={styles.container}>
      <View style={styles.modal}>
        <ScrollView>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modal: {
    width: wp(80),
    backgroundColor: COLORS.brand,
    borderRadius: 10,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    margin: wp(5),
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2),
    color: COLORS.white,
  },
});

export default GamePicker;
