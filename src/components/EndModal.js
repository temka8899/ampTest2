import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {images} from '../constants';
import {COLORS, FONTS, hp, wp} from '../constants/theme';

export const EndModal = props => {
  const [allData, setAllData] = useState(props.allData);
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
  console.log('allData', allData);
  useEffect(() => {
    getWinner();
  }, []);
  async function getWinner() {
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
          <View>
            <Text style={{}}>WINNER</Text>
            <Image source={images.men} style={[styles.image]} />
          </View>
          <TouchableOpacity
            style={styles.modalBtnContainer}
            onPress={props.EndBtn}>
            <Text style={styles.modalBtnText}>End Match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBtnContainer}
            onPress={props.cancelbtn}>
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
  image: {
    width: wp(9.6),
    height: hp(4.43),
    marginTop: wp(2),
  },
});
