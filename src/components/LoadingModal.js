import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {COLORS, wp} from '../constants/theme';

export const LoadingModal = props => {
  return (
    <Modal isVisible={props.bool} animationIn="fadeIn" style={styles.modal}>
      <View style={styles.modalContainer}>
        <LottieView
          autoPlay
          source={require('../assets/Lottie/game-loader.json')}
          style={{width: wp(50), height: wp(50)}}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    width: wp(40),
    height: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.brand,
    borderWidth: 2,
  },
});
