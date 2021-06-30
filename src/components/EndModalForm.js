import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LottieView from 'lottie-react-native';

import {COLORS, FONTS, wp} from '../constants/theme';

export const EndModalForm = props => {
  const [allData, setAllData] = useState(props.allData);
  const [winner, setWinner] = useState({
    team: {
      point: 0,
      name: 'TEAM',
      avatar1: '',
      avatar2: '',
    },
  });
  const [loser, setLoser] = useState({
    team: {
      point: 0,
      name: 'TEAM',
      avatar1: '',
      avatar2: '',
    },
  });
  useEffect(() => {
    getWinner();
  }, []);
  function getWinner() {
    if (props.HomeScore > props.AwayScore) {
      setWinner(prev => ({
        ...prev,
        team: {
          point: props.HomeScore,
          name: props.HomeName,
          avatar1: props.HomeAvatars[0],
          avatar2: props.HomeAvatars[1],
        },
      }));
      setLoser(prev => ({
        ...prev,
        team: {
          point: props.AwayScore,
          name: props.AwayName,
          avatar1: props.AwayAvatars[0],
          avatar2: props.AwayAvatars[1],
        },
      }));
    } else {
      setWinner(prev => ({
        ...prev,
        team: {
          point: props.AwayScore,
          name: props.AwayName,
          avatar1: props.AwayAvatars[0],
          avatar2: props.AwayAvatars[1],
        },
      }));
      setLoser(prev => ({
        ...prev,
        team: {
          point: props.HomeScore,
          name: props.HomeName,
          avatar1: props.HomeAvatars[0],
          avatar2: props.HomeAvatars[1],
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
                <Image
                  source={winner.team.avatar1}
                  style={[styles.winnerImage]}
                />
                <Text style={[{color: COLORS.green}, styles.score]}>
                  {winner.team.point}
                </Text>
                <Image
                  source={winner.team.avatar1}
                  style={[styles.winnerImage]}
                />
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
                <Image source={loser.team.avatar1} style={[styles.image]} />
                <Text style={[{color: COLORS.red}, styles.score]}>
                  {loser.team.point}
                </Text>
                <Image source={loser.team.avatar2} style={[styles.image]} />
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
