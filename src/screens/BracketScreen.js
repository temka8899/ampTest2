import React from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, icons, images} from '../constants';
import {FONTS, wp} from '../constants/theme';

export default function BracketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={{alignItems: 'center', width: wp(110)}}>
        <View>
          <View style={styles.bracketContainer}>
            <View style={styles.sectionContainer}>
              <View>
                <View style={styles.teamContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textStyle}>
                    T1
                  </Text>
                </View>

                <View style={styles.space}></View>
                <View style={styles.teamContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textStyle}>
                    T2
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.teamContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textStyle}>
                    T3
                  </Text>
                </View>

                <View style={styles.space}></View>
                <View style={styles.teamContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textStyle}>
                    T4
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.lineContainer}>
              <View
                style={{
                  height: wp(37.3),
                  width: wp(18),
                }}>
                <Image source={icons.line1agrey} style={styles.line1agrey} />
                <Image source={icons.line1bgreen} style={styles.line1bgreen} />
              </View>
              <View
                style={{
                  height: wp(47.46),
                  width: wp(18),
                }}>
                <Image
                  source={icons.line1agrey}
                  style={styles.line1agreyBottom}
                />
                <Image
                  source={icons.line1bgreen}
                  style={styles.line1bgreenBottom}
                />
              </View>
            </View>
            <View style={styles.section2}>
              <View
                style={{
                  height: wp(37.3),
                  width: wp(18),
                  paddingTop: wp(12),
                }}>
                <View style={styles.teamContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textStyle}>
                    T1 or T2
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: wp(47.46),
                  width: wp(18),
                }}>
                <View
                  style={{
                    height: wp(37.3),
                    width: wp(18),
                    paddingTop: wp(17.86),
                  }}>
                  <View style={styles.teamContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={images.men}
                        style={{width: wp(9.6), height: wp(9.6)}}
                      />
                      <Image
                        source={images.men}
                        style={{width: wp(9.6), height: wp(9.6)}}
                      />
                    </View>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        color: COLORS.greyText,
                        fontFamily: FONTS.brandFont,
                        fontSize: wp(2.66),
                      }}>
                      T3 or T4
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.sectionContainerFinal}>
              <View
                style={{
                  height: wp(117.6),
                  width: wp(16.89),
                  borderWidth: 1,
                }}>
                <Image
                  source={icons.line2agreen}
                  style={{
                    width: wp(16),
                    height: wp(41.06),
                    position: 'absolute',
                    marginTop: wp(16.26),
                  }}
                />
                <Image
                  source={icons.line2bgreen}
                  style={{
                    width: wp(16),
                    height: wp(41.06),
                    position: 'absolute',
                    marginTop: wp(54.1),
                  }}
                />
              </View>
              <View style={{justifyContent: 'center'}}>
                <View style={styles.teamContainerFinal}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                    <Image
                      source={images.men}
                      style={{width: wp(9.6), height: wp(9.6)}}
                    />
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      color: COLORS.greyText,
                      fontFamily: FONTS.brandFont,
                      fontSize: wp(2.66),
                    }}>
                    T3 or T4
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bracketContainer: {
    borderWidth: 1,
    width: wp(96),
    height: wp(117.6),
    flexDirection: 'row',
  },

  sectionContainer: {
    height: wp(117.6),
    width: wp(23),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  teamContainer: {
    width: wp(23),
    height: wp(17.3),
    paddingVertical: wp(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainerFinal: {
    width: wp(23),
    height: wp(17.3),
    paddingVertical: wp(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    color: COLORS.greyText,
    fontFamily: FONTS.brandFont,
    fontSize: wp(2.66),
  },
  space: {
    width: wp(23),
    height: wp(8),
  },
  lineContainer: {
    height: wp(117.6),
    width: wp(18),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  line1agrey: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(4.26),
  },
  line1bgreen: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(17.06),
  },
  line1agreyBottom: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(9.6),
  },
  line1bgreenBottom: {
    width: wp(17.06),
    height: wp(16),
    position: 'absolute',
    marginTop: wp(22.13),
  },
  section2: {
    height: wp(117.6),
    width: wp(23),
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  sectionContainerFinal: {
    height: wp(117.6),
    width: wp(32),
    borderWidth: 1,
    flexDirection: 'row',
  },
});
