import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import AppBar from '../components/AppBar';
import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';
import LeaguePicker from '../components/LeaguePicker';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const StandingsScreen = ({navigation, route}) => {
  // let itemID = 0;

  // if (route.params?.itemId) {
  //   itemID = route.params.itemId;
  // }
  const [isLoading, setLoading] = useState(false);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <SkeletonPlaceholder
          speed={800}
          backgroundColor={'#E1E9EE'}
          highlightColor={'#F2F8FC'}>
          <View>
            <View>
              <View style={{width: wp(100), height: hp(4)}} />

              <View style={{width: wp(100), height: hp(3), marginTop: hp(1)}} />
            </View>
            <View style={styles.skeletonMain}>
              <View style={styles.skeleton1}>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonSub} />
                  <View style={styles.skeletonSub} />
                </View>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonInner} />
                </View>
              </View>
              <View style={styles.skeletonAnotherSub} />
              <View style={styles.skeleton3}>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonSub} />
                  <View style={styles.skeletonSub} />
                </View>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonInner} />
                </View>
              </View>
              <View style={styles.skeletonAnotherSub} />
              <View style={styles.skeleton}>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonSub} />
                  <View style={styles.skeletonSub} />
                </View>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonInner} />
                </View>
              </View>
              <View style={styles.skeletonAnotherSub} />
              <View style={styles.skeleton3}>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonSub} />
                  <View style={styles.skeletonSub} />
                </View>
                <View style={styles.skeletonSubMain}>
                  <View style={styles.skeletonInner} />
                </View>
              </View>
              <View style={styles.skeletonAnotherSub} />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        <View>
          <AppBar />
          <TouchableOpacity
            onPress={() => changeModalVisible(true)}
            style={styles.chooseButton}>
            <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
              {chooseData === '' ? 'Select' : chooseData.game.name}
            </Text>
            <Image source={icons.drop} style={styles.dropButton} />
          </TouchableOpacity>
          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            nRequestClose={() => changeModalVisible(false)}>
            <LeaguePicker
              changeModalVisible={changeModalVisible}
              setData={setData}
            />
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skeletonMain: {
    alignItems: 'center',
  },
  skeletonAnotherSub: {
    width: wp(80),
    height: 1,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  skeletonInner: {
    width: wp(20),
    height: hp(5),
  },
  skeleton1: {
    flexDirection: 'row',
    marginTop: hp(10),
    alignItems: 'center',
  },
  skeleton3: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
  },
  skeletonSub: {
    width: wp(15),
    height: wp(15),
    borderRadius: 40,
    marginRight: hp(1),
  },
  skeletonSubMain: {
    flexDirection: 'row',
  },
  chooseButton: {
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomColor: COLORS.brand,
    borderWidth: 1,
  },
  dropButton: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  appBar: {
    borderWidth: 1,
    borderColor: '#F74C11',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: 'PressStart2P-Regular',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default StandingsScreen;
