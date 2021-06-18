import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {COLORS, FONTS, hp, wp} from '../constants/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const LogoutModal = props => {
  return (
    <Modal
      isVisible={props.visible}
      animationIn="rubberBand"
      swipeDirection="down"
      onSwipeComplete={props.modalHide}
      onBackdropPress={props.modalHide}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.text}>Are you sure ?</Text>
        <View>
          <LottieView
            autoPlay
            style={{width: wp(40)}}
            source={require('../assets/Lottie/pacman.json')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={props.modalHide}
            style={[styles.button, {backgroundColor: COLORS.brand}]}>
            <Text style={[styles.buttonText, {color: COLORS.background}]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.logout} style={styles.button}>
            <Text style={[styles.buttonText, {color: COLORS.brand}]}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(80),
    height: hp(30),
    backgroundColor: COLORS.background,
    borderColor: COLORS.brand,
    borderWidth: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    color: COLORS.greyText,
    fontFamily: FONTS.brandFont,
  },
  buttonText: {
    fontFamily: FONTS.brandFont,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: wp(60),
    justifyContent: 'space-between',
  },
  button: {
    borderColor: COLORS.brand,
    borderWidth: 2,
    width: wp(28),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
