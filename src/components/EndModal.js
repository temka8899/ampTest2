import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {images} from '../constants';
import {COLORS, FONTS, hp, wp} from '../constants/theme';

export const EndModal = props => {
  const [allData, setAllData] = useState(props.allData);
  const [isHomeWin, setIsHomeWin] = useState();
  const [isAwayWin, setIsAwayWin] = useState();
  const [loserGetRound, setLoserGetRound] = useState(false);
  const [winner, setWinner] = useState({
    one: {
      point: 0,
      name: 'Moogii',
    },
    two: {
      point: 0,
      name: 'Moogii',
    },
  });
  const [loser, setLoser] = useState({
    one: {
      point: 0,
      name: 'Moogii',
    },
    two: {
      point: 0,
      name: 'Moogii',
    },
  });
  // console.log('allData', allData);
  useEffect(() => {
    getWinner();
  }, []);
  async function getWinner() {
    if (props.HomeWin && allData.one.point + allData.two.point == 10) {
      setIsHomeWin(true);
      if (props.AwayWin) {
        setLoserGetRound(true);
      }
    } else if (props.HomeWin && allData.one.point + allData.two.point == 10) {
      setIsAwayWin(true);
      if (props.HomeWin) {
        setLoserGetRound(true);
      }
    }
    if (allData.one.point + allData.two.point == 10) {
      setWinner(prev => ({
        ...prev,
        one: {point: allData.one.point, name: allData.one.name},
        two: {point: allData.two.point, name: allData.two.name},
      }));
      setLoser(prev => ({
        ...prev,
        one: {point: allData.three.point, name: allData.three.name},
        two: {point: allData.four.point, name: allData.four.name},
      }));
    } else {
      setWinner(prev => ({
        ...prev,
        one: {point: allData.three.point, name: allData.three.name},
        two: {point: allData.four.point, name: allData.four.name},
      }));
      setLoser(prev => ({
        ...prev,
        one: {point: allData.one.point, name: allData.one.name},
        two: {point: allData.two.point, name: allData.two.name},
      }));
    }
  }
  if (props.isBestOne) {
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
            // paddingVertical: hp(1),
          }}>
          <View
            style={
              {
                // borderWidth: 1,
                // borderColor: 'red',
              }
            }>
            <View
              style={{
                // borderColor: 'red',
                // borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.5),
                }}>
                WINNER
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 1,
                  alignItems: 'center',
                  width: wp(40),
                  justifyContent: 'space-between',
                  marginTop: hp(2),
                  marginBottom: hp(1),
                }}>
                <Image source={images.men} style={[styles.winnerImage]} />
                <Text style={[{color: COLORS.green}, styles.score]}>
                  {winner.one.point + winner.two.point}
                </Text>
                <Image source={images.men} style={[styles.winnerImage]} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 1,
                  alignItems: 'center',
                  width: wp(30),
                  justifyContent: 'space-between',
                  marginBottom: hp(2),
                }}>
                <Image source={images.men} style={[styles.image]} />
                <Text style={[{color: COLORS.red}, styles.score]}>
                  {loser.one.point + loser.two.point}
                </Text>
                <Image source={images.men} style={[styles.image]} />
              </View>
            </View>
            <View
              style={{
                width: wp(80),
                // height: hp(11),
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={props.cancelbtn}>
                <Text
                  style={[styles.modalBtnText, {fontSize: RFPercentage(1.7)}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={props.EndBtn}>
                <Text
                  style={[styles.modalBtnText, {fontSize: RFPercentage(1.6)}]}>
                  End Match
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
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
            // paddingVertical: hp(1),
          }}>
          <View
            style={
              {
                // borderWidth: 1,
                // borderColor: 'red',
              }
            }>
            <View
              style={{
                // borderColor: 'red',
                // borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.5),
                }}>
                {isHomeWin || isAwayWin
                  ? `Winner`
                  : `${props.Round} Round winner!`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 1,
                  alignItems: 'center',
                  width: wp(40),
                  justifyContent: 'space-between',
                  marginTop: hp(2),
                  marginBottom: hp(1),
                }}>
                <Image source={images.men} style={[styles.winnerImage]} />
                <Text style={[{color: COLORS.green}, styles.score]}>
                  {winner.one.point + winner.two.point}
                </Text>
                <Image source={images.men} style={[styles.winnerImage]} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 1,
                  alignItems: 'center',
                  width: wp(30),
                  justifyContent: 'space-between',
                  marginBottom: hp(2),
                }}>
                <Image source={images.men} style={[styles.image]} />
                <Text style={[{color: COLORS.red}, styles.score]}>
                  {loser.one.point + loser.two.point}
                </Text>
                <Image source={images.men} style={[styles.image]} />
              </View>
            </View>
            <View
              style={{
                width: wp(80),
                // height: hp(11),
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={props.cancelbtn}>
                <Text
                  style={[styles.modalBtnText, {fontSize: RFPercentage(1.6)}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={props.NextBtn}>
                <Text
                  style={[styles.modalBtnText, {fontSize: RFPercentage(1.6)}]}>
                  {props.Round !== 2
                    ? `${props.Round + 1} Round`
                    : `Last Round`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  score: {
    fontSize: RFPercentage(2, 5),
    fontFamily: FONTS.brandFont,
  },
  modalBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  modalCancelBtn: {
    width: wp(32),
    height: hp(5),
    borderColor: COLORS.brand,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnContainer: {
    backgroundColor: COLORS.brand,
    width: wp(32),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(9.6),
    height: hp(4.43),
    resizeMode: 'contain',
  },
  winnerImage: {
    resizeMode: 'contain',
    width: wp(12),
    height: hp(5.43),
  },
});
