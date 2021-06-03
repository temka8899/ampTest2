import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
// import {DATA} from './GameScreen';
import AppBar from '../components/AppBar';
import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {DATA} from '../data/DATA';
import {userData} from '../data/Players';
import Modal from 'react-native-modal';

const Player = ({item, index}) => (
  <View
    style={{
      width: wp(95),
      height: hp(6),
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.greyText,
      alignSelf: 'center',
    }}>
    <Text style={[{color: COLORS.greyText, marginLeft: wp(4)}, styles.player]}>
      {index + 1}
    </Text>
    <Image source={item.image} style={styles.avatar} />
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <Text
        style={[{color: COLORS.greyText, marginLeft: wp(4)}, styles.player]}>
        {item.name}
      </Text>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          width: wp(21),
        }}>
        <Text style={[{color: COLORS.greyText}, styles.player]}>lvl </Text>
        <Text style={[{color: COLORS.brand}, styles.player]}>{item.level}</Text>
      </View>
    </View>
  </View>
);

const ParticipatesScreen = ({navigation, route}) => {
  const sorted = userData.sort((a, b) => b.level - a.level);

  const renderPlayers = ({item, index}) => <Player item={item} index={index} />;

  let itemID = 0;

  if (route.params?.itemId) {
    itemID = route.params.itemId;
  }
  const [inLeague, setInLeague] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };
  const changeInLeague = bool => {
    setInLeague(bool);
  };
  function bottomModal() {
    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onSwipeComplete={() => changeModalVisible(fasle)}
          swipeDirection="down"
          style={{margin: 0}}>
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() =>
                setModalVisible(!isModalVisible)
              }></TouchableOpacity>
            <Text
              style={{
                fontFamily: FONTS.brandFont,
                textAlign: 'center',
                color: COLORS.white,
                width: wp(70),
                lineHeight: hp(2),
                marginTop: hp(2),
              }}>
              {!inLeague
                ? 'Do you agree to participate in the league?'
                : 'Do you agree to out from the league?'}
            </Text>
            <TouchableOpacity
              style={{
                width: wp(85),
                height: hp(6),
                backgroundColor: COLORS.brand,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp(3),
              }}
              onPress={() => {
                [
                  inLeague ? changeInLeague(false) : changeInLeague(true),
                  setModalVisible(false),
                ];
              }}>
              <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
                {!inLeague ? "Yes, I'am in" : "Yes, I'am out"}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        flexDirection: 'column',
      }}>
      <StatusBar barStyle="light-content" />
      <AppBar />
      <View
        style={{
          width: wp(100),
          height: hp(6),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: wp(2),
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              backgroundColor: !inLeague ? COLORS.green : COLORS.red,
            },
            styles.btnContainer,
          ]}
          onPress={() => changeModalVisible(true)}>
          <Text
            style={{
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.7),
              color: COLORS.white,
            }}>
            {!inLeague ? "I'am in" : "I'am out"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: wp(100),
          height: hp(40),
          justifyContent: 'center',
          alignItems: 'center',
          // borderColor: 'red',
          // borderWidth: 1,
        }}>
        <Image
          source={DATA[itemID].image}
          style={{resizeMode: 'contain', height: hp(42)}}
        />
      </View>
      <View
        style={{
          height: hp(5),
          // borderColor: 'red',
          // borderWidth: 1,
          justifyContent: 'center',
          paddingLeft: wp(7),
        }}>
        <Text style={{color: COLORS.white, fontFamily: FONTS.brandFont}}>
          In League
        </Text>
      </View>
      <FlatList data={sorted} renderItem={renderPlayers} />
      {bottomModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  player: {
    fontFamily: FONTS.brandFont,
  },
  avatar: {
    width: wp(9.6),
    height: hp(4.43),
    resizeMode: 'contain',
    marginLeft: wp(4),
  },
  btnContainer: {
    width: wp(31),
    height: hp(4.55),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.09),
    borderColor: 'white',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalBody: {
    height: '25%',
    marginTop: 'auto',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    borderTopColor: COLORS.white,
    borderLeftColor: COLORS.white,
    borderRightColor: COLORS.white,
    borderWidth: 1,
    // justifyContent: 'space-evenly',
  },
  closeBtn: {
    marginVertical: hp(1),
    borderRadius: 20,
    width: wp(25),
    height: hp(1),
    backgroundColor: COLORS.white,
  },
  modalBtn: {
    width: wp(84.53),
    height: hp(5.43),
    borderRadius: 12,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(7.735),
    marginTop: hp(2),
  },
});

export default ParticipatesScreen;
