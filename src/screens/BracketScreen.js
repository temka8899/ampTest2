import React from 'react';

import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {COLORS, icons, images} from '../constants';
import {FONTS, wp} from '../constants/theme';

export default function BracketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View
          style={{
            borderColor: 'red',
            borderWidth: 1,
            width: wp(96),
            height: wp(117.6),
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: wp(117.6),
              width: wp(23),
              borderWidth: 1,
              borderColor: 'red',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  width: wp(23),
                  height: wp(17.3),
                  // borderWidth: 1,
                  // borderColor: 'red',
                  paddingVertical: wp(0.8),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
                  TEAM GANG
                </Text>
              </View>

              <View
                style={{
                  width: wp(23),
                  height: wp(8),
                  // borderWidth: 1,
                  // borderColor: 'red',
                }}></View>
              <View
                style={{
                  width: wp(23),
                  height: wp(17.3),
                  // borderWidth: 1,
                  // borderColor: 'red',
                  paddingVertical: wp(0.8),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
                  TEAM GANG
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  width: wp(23),
                  height: wp(17.3),
                  // borderWidth: 1,
                  // borderColor: 'red',
                  paddingVertical: wp(0.8),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
                  TEAM GANG
                </Text>
              </View>

              <View
                style={{
                  width: wp(23),
                  height: wp(8),
                  // borderWidth: 1,
                  // borderColor: 'red',
                }}></View>
              <View
                style={{
                  width: wp(23),
                  height: wp(17.3),
                  // borderWidth: 1,
                  // borderColor: 'red',
                  paddingVertical: wp(0.8),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
                  TEAM GANG
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              height: wp(117.6),
              width: wp(18),
              borderWidth: 1,
              borderColor: 'red',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: wp(37.3),
                width: wp(18),
                // borderWidth: 1,
                // borderColor: 'red',
              }}>
              <Image
                source={icons.line1agrey}
                style={{
                  width: wp(17.06),
                  height: wp(16),
                  position: 'absolute',
                  marginTop: wp(4.26),
                }}
              />
              <Image
                source={icons.line1bgreen}
                style={{
                  width: wp(17.06),
                  height: wp(16),
                  position: 'absolute',
                  marginTop: wp(17.06),
                }}
              />
            </View>
            <View
              style={{
                height: wp(47.46),
                width: wp(18),
                // borderWidth: 1,
                // borderColor: 'red',
              }}>
              <Image
                source={icons.line1agrey}
                style={{
                  width: wp(17.06),
                  height: wp(16),
                  position: 'absolute',
                  marginTop: wp(9.6),
                }}
              />
              <Image
                source={icons.line1bgreen}
                style={{
                  width: wp(17.06),
                  height: wp(16),
                  position: 'absolute',
                  marginTop: wp(22.13),
                }}
              />
            </View>
          </View>
          <View
            style={{
              height: wp(117.6),
              width: wp(23),
              borderWidth: 1,
              borderColor: 'red',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: wp(37.3),
                width: wp(18),
                // borderWidth: 1,
                // borderColor: 'red',
                paddingTop: wp(12),
              }}>
              <View
                style={{
                  width: wp(23),
                  height: wp(17.3),
                  borderWidth: 1,
                  borderColor: 'red',
                  paddingVertical: wp(0.8),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
                  TEAM GANG
                </Text>
              </View>
            </View>
            <View
              style={{
                height: wp(47.46),
                width: wp(18),
                // borderWidth: 1,
                // borderColor: 'red',
              }}>
              <View
                style={{
                  height: wp(37.3),
                  width: wp(18),
                  // borderWidth: 1,
                  // borderColor: 'red',
                  paddingTop: wp(17.86),
                }}>
                <View
                  style={{
                    width: wp(23),
                    height: wp(17.3),
                    // borderWidth: 1,
                    // borderColor: 'red',
                    paddingVertical: wp(0.8),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
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
                    TEAM GANG
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              height: wp(117.6),
              width: wp(32),
              borderWidth: 1,
              borderColor: 'red',
            }}>
            <View
              style={{
                height: wp(104),
                width: wp(21.89),
                borderWidth: 1,
                borderColor: 'red',
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
                source={icons.line2bgrey}
                style={{
                  width: wp(16),
                  height: wp(41.06),
                  position: 'absolute',
                  marginTop: wp(54.1),
                }}
              />
            </View>
          </View>
        </View>
      </View>
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
});
