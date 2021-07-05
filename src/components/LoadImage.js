import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../constants';
import {FONTS, hp, wp} from '../constants/theme';

const LoadImage = ({imgURL, gameTitle, gameDate}) => {
  const [imageLoad, setLoad] = useState(true);
  return (
    <ImageBackground
      style={styles.img}
      imageStyle={{
        borderRadius: wp(12),
      }}
      source={{uri: imgURL}}
      onLoadEnd={() => setLoad(false)}>
      {imageLoad && <ActivityIndicator size={'large'} color={COLORS.brand} />}
      <LinearGradient
        style={{flex: 1, borderRadius: wp(12)}}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        buh
        colors={['#00000000', '#000']}>
        <View style={styles.leagueStatus}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              paddingVertical: hp(1),
            }}>
            {gameTitle}
          </Text>
          <Text style={{color: COLORS.white, fontFamily: FONTS.brandFont}}>
            {gameDate}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  img: {
    width: wp(52),
    height: wp(68),
  },
  leagueStatus: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: hp(5),
    marginHorizontal: wp(5),
  },
});

export default LoadImage;
