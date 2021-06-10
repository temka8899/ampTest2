import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, FONTS, hp, wp} from '../constants/theme';

export const EndModal = props => {
  return (
    <Modal
      animationIn="rubberBand"
      isVisible={props.isVisible}
      // onBackdropPress={props.onBackdropPress}
      style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
      <View
        style={{
          width: wp(80),
          height: hp(30),
          backgroundColor: COLORS.background,
          borderColor: COLORS.brand,
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: hp(11),
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.modalBtnContainer}
            onPress={props.EndBtn}>
            <Text style={styles.modalBtnText}>End Match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBtnContainer}
            onPress={props.cancelBtn}>
            <Text style={styles.modalBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  modalBtnContainer: {
    backgroundColor: COLORS.brand,
    width: wp(50),
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
