import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import {COLORS, FONTS, wp} from '../constants/theme';

export const EndModal = props => {
  const [allData, setAllData] = useState(props.allData);
  console.log(`allData`, allData);
  const [winner, setWinner] = useState({
    one: {
      point: 0,
      name: 'Moogii',
      image: '',
    },
    two: {
      point: 0,
      name: 'Moogii',
      image: '',
    },
  });
  const [loser, setLoser] = useState({
    one: {
      point: 0,
      name: 'Moogii',
      image: '',
    },
    two: {
      point: 0,
      name: 'Moogii',
      image: '',
    },
  });
  useEffect(() => {
    getWinner();
  }, []);
  async function getWinner() {
    if (allData.one.point + allData.two.point === 10) {
      setWinner(prev => ({
        ...prev,
        one: {
          point: allData.one.point,
          name: allData.one.name,
          image: allData.one.image,
        },
        two: {
          point: allData.two.point,
          name: allData.two.name,
          image: allData.two.image,
        },
      }));
      setLoser(prev => ({
        ...prev,
        one: {
          point: allData.three.point,
          name: allData.three.name,
          image: allData.three.image,
        },
        two: {
          point: allData.four.point,
          name: allData.four.name,
          image: allData.four.image,
        },
      }));
    } else {
      setWinner(prev => ({
        ...prev,
        one: {
          point: allData.three.point,
          name: allData.three.name,
          image: allData.three.image,
        },
        two: {
          point: allData.four.point,
          name: allData.four.name,
          image: allData.four.image,
        },
      }));
      setLoser(prev => ({
        ...prev,
        one: {
          point: allData.one.point,
          name: allData.one.name,
          image: allData.one.image,
        },
        two: {
          point: allData.two.point,
          name: allData.two.name,
          image: allData.two.image,
        },
      }));
    }
  }
  return (
    <Modal
      animationIn="rubberBand"
      isVisible={props.isVisible}
      style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
      <View
        style={{
          width: wp(80),
          height: wp(60),
          backgroundColor: COLORS.background,
          borderColor: COLORS.brand,
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.loading !== true ? (
          <View>
            <View
              style={{
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
                  alignItems: 'center',
                  width: wp(40),
                  justifyContent: 'space-between',
                  marginTop: wp(3),
                  marginBottom: wp(3),
                }}>
                <Image source={winner.one.image} style={[styles.winnerImage]} />
                <Text style={[{color: COLORS.green}, styles.score]}>
                  {winner.one.point + winner.two.point}
                </Text>
                <Image source={winner.two.image} style={[styles.winnerImage]} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 1,
                  alignItems: 'center',
                  width: wp(30),
                  justifyContent: 'space-between',
                  marginBottom: wp(5),
                }}>
                <Image source={loser.one.image} style={[styles.image]} />
                <Text style={[{color: COLORS.red}, styles.score]}>
                  {loser.one.point + loser.two.point}
                </Text>
                <Image source={loser.two.image} style={[styles.image]} />
              </View>
            </View>
            <View
              style={{
                width: wp(80),
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
        ) : (
          <View>
            <LottieView
              autoPlay
              style={{width: wp(45)}}
              source={require('../assets/Lottie/game-pinpon.json')}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  score: {
    fontSize: RFPercentage(2),
    fontFamily: FONTS.brandFont,
  },
  modalBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  modalCancelBtn: {
    width: wp(32),
    height: wp(10),
    borderColor: COLORS.brand,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnContainer: {
    backgroundColor: COLORS.brand,
    width: wp(32),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(9.6),
    height: wp(9.6),
    resizeMode: 'contain',
  },
  winnerImage: {
    resizeMode: 'contain',
    width: wp(12),
    height: wp(12),
  },
});
