import React, {useState, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  View,
  TextBase,
} from 'react-native';
import {icons, images, index, theme} from '../constants';
import {wp, hp, ft, COLORS, FONTS} from '../constants/theme';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import color from 'color';

import {DATA} from '../data/DATA';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <View>
    <TouchableOpacity
      onPress={onPress}
      style={[[styles.item, backgroundColor], {borderRadius: 10}]}>
      <Image
        source={item.image}
        style={[styles.image, {width: wp(69.3), height: hp(42)}]}
      />
    </TouchableOpacity>
  </View>
);

const GameScreen = ({navigation}) => {
  const [selectedId, setSelectedId] = useState(null);
  const renderItem = ({item}) => {
    // const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() =>
          navigation.navigate('ParticipatesScreen', {
            data: DATA,
            itemId: item.id,
          })
        }
        // backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const [greet, setGreet] = useState('');

  const findGreet = () => {
    const hrs = new Date().getHours();
    if (hrs === 0 || hrs < 12) return setGreet('Morning');
    if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
    setGreet('Evening');
  };

  useEffect(() => {
    findGreet();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      <SafeAreaView style={{paddingTop: hp(2)}}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp(4),
          }}>
          <View>
            <Text
              style={[
                styles.greeting,
                {fontSize: RFPercentage(1.8), color: COLORS.greyText},
              ]}>{`Good ${greet} `}</Text>
            <Text
              style={[
                styles.greeting,
                {marginTop: hp(1), fontSize: RFPercentage(2.5)},
              ]}>
              Moogii
            </Text>
          </View>
          <View>
            <TouchableOpacity>
              <Image
                source={images.profilePic}
                style={{
                  resizeMode: 'contain',
                  width: wp(14.4),
                  height: hp(6.65),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <FlatList
            // showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  greeting: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // paddingLeft: 10,
    // paddingRight: 10,
    marginVertical: 8,
    // marginHorizontal: 16,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  title: {
    fontSize: 32,
  },
});

export default GameScreen;
