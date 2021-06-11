import React, {useEffect, useState} from 'react';
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
import Modal from 'react-native-modal';
import {EndModal} from '../components/EndModal';
export default function CountScreen({navigation}) {
  const [CancelModalVisible, setCancelModalVisible] = useState(false);
  const [EndModalVisible, setEndModalVisible] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [findMistake, setfindMistake] = useState(0);
  // const [CancelPress, setCancelPress] = useState(false);

  const [allPoint, setAllPoint] = useState({
    one: {
      point: 0,
      name: 'Moogii',
    },
    two: {
      point: 0,
      name: 'Temuulen',
    },
    three: {
      point: 0,
      name: 'Buynaa',
    },
    four: {
      point: 0,
      name: 'Amaraa',
    },
  });

  // useEffect(() => {
  //   checkHomeWin();
  // }, [checkHomeWin]);

  function setFind(option) {
    setfindMistake(option);
    console.log('suuliin onoo', allPoint);
    setEndModalVisible(true);
  }
  const cancelBtnPress = () => {
    // setCancelPress(true);
    console.log('object');
    console.log(`findMistake`, findMistake);
    switch (findMistake) {
      case 1:
        setAllPoint(prev => ({
          ...prev,
          one: {point: allPoint.one.point - 1, name: 'Moogii'},
        }));
        break;
      case 2:
        setAllPoint(prev => ({
          ...prev,
          two: {point: allPoint.two.point - 1, name: 'Temuulen'},
        }));
        break;
      case 3:
        setAllPoint(prev => ({
          ...prev,
          three: {point: allPoint.three.point - 1, name: 'Buynaa'},
        }));
        break;
      case 4:
        setAllPoint(prev => ({
          ...prev,
          four: {point: allPoint.four.point - 1, name: 'Amaraa'},
        }));
        break;
      default:
        break;
    }
    toggleEndModal(false);
  };
  const toggleCancelModal = bool => {
    setCancelModalVisible(bool);
  };
  const toggleEndModal = bool => {
    setEndModalVisible(bool);
  };

  const EndBtnPress = () => {
    // switch (findMistake) {
    //   case 1:
    //     setAllPoint(prev => ({...prev, one: prev.one - 1}));
    //     break;
    //   case 2:
    //     setAllPoint(prev => ({...prev, two: prev.two - 1}));
    //     break;
    //   case 3:
    //     setAllPoint(prev => ({...prev, three.point: prev.three.point - 1}));
    //     break;
    //   case 4:
    //     setAllPoint(prev => ({...prev, four: prev.four - 1}));
    //     break;
    //   default:
    //     break;
    // }
    toggleEndModal(false);
    console.log('allpoint', allPoint);
  };

  function CancelModal() {
    return (
      <View>
        <Modal
          animationIn="rubberBand"
          isVisible={CancelModalVisible}
          onBackdropPress={() => toggleCancelModal(false)}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: wp(70),
              height: hp(20),
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
                onPress={() => navigation.pop()}>
                <Text style={styles.modalBtnText}>End Match</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={() => toggleCancelModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const endMatch = () => {
    let response = '';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.backContainer}>
        <TouchableOpacity onPress={() => toggleCancelModal(true)}>
          <Image source={icons.backWhiteBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar hidden />
      <View style={[styles.topContainer, {transform: [{rotate: '180deg'}]}]}>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>
            {allPoint.three.point + allPoint.four.point}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            width: wp(22),
            justifyContent: 'space-between',
            marginHorizontal: wp(39),
            marginTop: hp(5.5),
          }}>
          <TouchableOpacity
            onPress={() =>
              allPoint.three.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    three: {point: allPoint.three.point - 1, name: 'Buynaa'},
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              allPoint.four.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    four: {point: allPoint.four.point - 1, name: 'Amaraa'},
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.three.point + allPoint.four.point !== 9
              ? null
              : setFind(3);
            setAllPoint(prev => ({
              ...prev,
              three: {point: allPoint.three.point + 1, name: 'Buynaa'},
            }));
          }}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              {allPoint.three.name}
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
                {allPoint.three.point}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.three.point + allPoint.four.point !== 9
              ? null
              : setFind(4);
            setAllPoint(prev => ({
              ...prev,
              four: {point: allPoint.four.point + 1, name: 'Amaraa'},
            }));
          }}
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
              {allPoint.four.name}
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
                {allPoint.four.point}
              </Text>
              <Image
                source={images.men}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>
            {allPoint.two.point + allPoint.one.point}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            width: wp(22),
            justifyContent: 'space-between',
            marginHorizontal: wp(39),
            marginTop: hp(5.5),
          }}>
          <TouchableOpacity
            onPress={() =>
              allPoint.one.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    one: {point: allPoint.one.point - 1, name: 'Moogii'},
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              allPoint.two.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    two: {point: allPoint.two.point - 1, name: 'Temuulen'},
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.one.point + allPoint.two.point !== 9 ? null : setFind(1);
            setAllPoint(prev => ({
              ...prev,
              one: {point: allPoint.one.point + 1, name: 'Moogii'},
            }));
          }}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              {allPoint.one.name}
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
                {allPoint.one.point}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            allPoint.one.point + allPoint.two.point !== 9 ? null : setFind(2);
            setAllPoint(prev => ({
              ...prev,
              two: {point: allPoint.two.point + 1, name: 'Temuulen'},
            }));
          }}
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
              {allPoint.two.name}
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
                {allPoint.two.point}
              </Text>
              <Image
                source={images.men}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {CancelModal()}
        {/* {EndModal()} */}
        {EndModalVisible && (
          <EndModal
            isVisible={EndModalVisible}
            onBackdropPress={() => setEndModalVisible(false)}
            navigateSchedule={endMatch}
            cancelbtn={cancelBtnPress}
            EndBtn={EndBtnPress}
            allData={allPoint}
          />
        )}
        {/* {checkHomeWin()} */}
      </View>
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
    left: wp(2),
    zIndex: 4,
    marginTop: hp(7),
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarScore: {
    flexDirection: 'column',
    marginTop: wp(2),
    width: wp(49),
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
    marginHorizontal: wp(39.1),
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
    opacity: 0.5,
  },
});
