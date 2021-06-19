import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {images} from '../constants';
import {COLORS, FONTS, hp, wp} from '../constants/theme';

export default function IntroModal(props) {
  const [isEng, setEng] = useState(true);
  return (
    <Modal isVisible={props.visible} style={styles.modal}>
      <View style={styles.modalContainer}>
        <Image source={images.logo} style={styles.image} />
        <View style={styles.textContainer}>
          {isEng ? (
            <Text style={[styles.text, {fontSize: RFPercentage(2.4)}]}>
              Thank you for choosing our application. Hippoleague is an
              application designed to liven up your day to day spare time at the
              office by fueling your competitive spirit. Join a league to battle
              it out with others, and upon the completion of a league you will
              find yourself restlessly awaiting the next. Many competition
              waiting for you, conquer the leaderboards.
            </Text>
          ) : (
            <Text style={[styles.text, {fontSize: RFPercentage(2.2)}]}>
              Манай аппликейшнг сонгосонд баярлалаа. Hippoleague бол таны
              өрсөлдөх чадварыг нэмэгдүүлэх замаар оффис дахь өдөр тутмын чөлөөт
              цагийг тань идэвхжүүлэх зорилготой аппликейшн юм. Бусадтай
              тулалдахын тулд лигт орно, лиг дууссаны дараа та дараагийнхаа
              өрсөлдөөнийг хүлээх болно. Олон өрсөлдөөн таныг хүлээж байна,
              тэргүүлэгчдийг байлдан дагуул.
            </Text>
          )}
        </View>
        <View style={styles.langContainer}>
          <TouchableOpacity onPress={() => setEng(true)}>
            <Text
              style={[
                styles.langText,
                {color: isEng ? COLORS.brand : COLORS.greyText},
              ]}>
              Eng
            </Text>
          </TouchableOpacity>
          <Text style={[styles.langText, {color: COLORS.greyText}]}>|</Text>
          <TouchableOpacity onPress={() => setEng(false)}>
            <Text
              style={[
                styles.langText,
                {color: isEng ? COLORS.greyText : COLORS.brand},
              ]}>
              Mon
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={props.close} style={styles.modalButton}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.8),
            }}>
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: wp(20),
    height: hp(10),
    resizeMode: 'contain',
    // borderColor: 'red',
    // borderWidth: 1,
    // flex: 1,
  },
  text: {
    // fontFamily: 'BaronNeueItalic',
    color: COLORS.white,
    textAlign: 'justify',
    // fontSize: RFPercentage(2.5),
    // lineHeight: hp(1.9),
    // marginLeft: wp(5),
  },
  textContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: wp(70),
    paddingTop: hp(2),
  },
  langText: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.8),
  },
  langContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: wp(5),
    marginTop: hp(1.5),
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.brand,
    borderWidth: 2,
    width: wp(80),
    height: hp(57),
    alignItems: 'center',
    paddingTop: hp(2),
  },
  modalButton: {
    backgroundColor: COLORS.brand,
    width: wp(30),
    height: hp(4),
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
