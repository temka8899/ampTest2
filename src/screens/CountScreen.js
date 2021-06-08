import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  View,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';

export default function CountScreen() {
  const [cancelModal, setCancelModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.backContainer}>
        <TouchableOpacity onPress={() => alert('4')}>
          <Image source={icons.backWhiteBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar hidden />
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.touch}>
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text>2</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>10</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            width: wp(22),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('2')}>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.touch}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={images.men} style={[styles.image]} />
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginLeft: wp(2),
                }}>
                8
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alert('121')}
          style={[styles.touch, {overflow: 'hidden'}]}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                alignSelf: 'flex-end',
                marginRight: wp(2),
              }}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginRight: wp(2),
                }}>
                7
              </Text>
              <Image
                source={images.men}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View
        style={[
          styles.subContainer,
          // {
          //   transform: [{rotate: '180deg'}],
          // },
        ]}>
        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={images.men} style={[styles.image]} />
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginLeft: wp(2),
                }}>
                8
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                alignSelf: 'flex-end',
                marginRight: wp(2),
              }}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginRight: wp(2),
                }}>
                7
              </Text>
              <Image
                source={images.men}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>10</Text>
        </View>
        <View
          style={{
            // position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: wp(39),
            marginTop: hp(5.5),
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: wp(22),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => alert('2')}>
              <Image
                source={icons.removeBtn}
                style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('2')}>
              <Image
                source={icons.removeBtn}
                style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => alert('4')}
          style={{
            // position: 'absolute',
            // justifyContent: 'center',
            // alignItems: 'center',
            // marginHorizontal: wp(39),
            // marginTop: hp(35),
            borderWidth: 1,
            borderColor: 'red',
            // marginTop: hp(35),
            flexDirection: 'column',
            // marginLeft: wp(10),
            width: wp(90),
            height: hp(4.43),
            // alignSelf: 'flex-end',
            // position: 'absolute',
            // zIndex: 2,
          }}>
          <TouchableOpacity onPress={() => alert('4')}>
            <Image source={icons.backWhiteBtn} style={styles.backBtn} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View> */}

      {/* <View style={styles.subContainer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={images.men} style={[styles.image]} />
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginLeft: wp(2),
                }}>
                8
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={() => alert('1')}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                alignSelf: 'flex-end',
                marginRight: wp(2),
              }}>
              Moogii
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginRight: wp(2),
                }}>
                7
              </Text>
              <Image
                source={images.men}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>10</Text>
        </View>
        <View
          style={{
            // position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: wp(39),
            marginTop: hp(5.5),
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: wp(22),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => alert('2')}>
              <Image
                source={icons.removeBtn}
                style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('2')}>
              <Image
                source={icons.removeBtn}
                style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // flexDirection: 'column',
    justifyContent: 'space-between',
  },
  touch: {
    flex: 1,
    width: wp(49),
    overflow: 'visible',
    backgroundColor: COLORS.count,
  },
  topContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: hp(50) - wp(1),
    overflow: 'visible',
  },
  backContainer: {
    position: 'absolute',
    left: wp(4),
    top: wp(2),
    zIndex: 4,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarScore: {
    flexDirection: 'column',
    marginTop: wp(2),
    // marginLeft: wp(2),
    width: wp(49),
    // borderColor: 'red',
    // borderWidth: 1,
    // alignItems: 'center',
  },
  personScore: {
    color: COLORS.greyText,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),

    marginTop: wp(2),
    marginLeft: wp(2),
  },
  image: {
    width: wp(9.6),
    height: hp(4.43),
    marginTop: wp(2),
  },
  teamScoreContainer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'visible',
    backgroundColor: COLORS.brand,
    width: wp(22),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(39),
  },
  teamScore: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),
  },
  addBtn: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
  },
  removeBtn: {
    resizeMode: 'contain',
    width: wp(10),
    height: hp(5.2),
  },
  backBtn: {
    width: wp(9.6),
    height: hp(4.43),
    // position: 'absolute',
    // transform: [{rotate: '180deg'}],
    // alignSelf: 'flex-end',
    marginLeft: wp(4),
    // opacity: 0.5,
  },
});
