import React, {useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {COLORS, FONTS, hp, wp} from '../constants/theme';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';

const tempData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'back'];
const tempData2 = ['+1', '+2', '+3', 'OK'];
function ScoreButton({item}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
function ScoreButton2({item}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

export default function FormInterface({navigation}) {
  const [CancelModalVisible, setCancelModalVisible] = useState(false);
  const pulseAnimRef = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scoreBoardContainer}>
        <View
          style={{
            width: wp(90),
            height: wp(45),
            backgroundColor: COLORS.brand,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(90),
              height: wp(10),

              backgroundColor: COLORS.brand,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
            }}>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>HOME</Text>
            </View>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>AWAY</Text>
            </View>
          </View>
          <View
            style={{
              width: wp(90),
              height: wp(35),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>000</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  0
                </Text>
                88
              </Text>
            </View>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>000</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  0
                </Text>
                15
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'red',
          marginTop: wp(10),
          width: wp(90),
          height: wp(70),
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: wp(66),
            borderColor: 'red',
            borderWidth: 1,
          }}>
          {tempData.map(item => (
            <ScoreButton key={item} item={item} />
          ))}
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'red',
            width: wp(24),
            height: wp(70),
          }}>
          {tempData2.map(item => (
            <ScoreButton2 key={item} item={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  animButton: {
    width: wp(20),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(1),
    shadowColor: COLORS.brand,
    elevation: 1,
    shadowOffset: {
      width: wp(1),
      height: wp(1),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    marginLeft: wp(1.5),
    marginTop: wp(1.5),
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: wp(5),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // transform: [{rotate: '90deg'}],
  },
  scoreBoardContainer: {
    marginTop: wp(30),
    backgroundColor: COLORS.count,
    width: wp(90),
    height: wp(30),
    margin: wp(5),
    borderColor: 'red',
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  pointContainer: {
    width: wp(35),
    height: wp(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  placeholder: {
    fontFamily: 'CursedTimerULiL',
    color: '#ffffff10',
    fontSize: wp(18),
  },
  homeAway: {
    width: wp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeAwayText: {
    // fontFamily: FONTS.brandFont,

    fontWeight: '900',
    fontSize: wp(4),
  },
});
