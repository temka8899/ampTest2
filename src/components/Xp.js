import * as React from 'react';
import {
  Easing,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {COLORS, images} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Xp({
  percentage = 100,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = COLORS.brand,
  delay = 0,
  textColor,
  max = 100,
}) {
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animation = toValue => {
    return Animated.timing(animated, {
      delay: 1000,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      animation(toValue === 0 ? percentage : 0);
    });
  };

  React.useEffect(() => {
    animation(percentage);
    animated.addListener(
      v => {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPerc) / 100;
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
            text: `${Math.round(v.value)}`,
          });
        }
        if (circleRef?.current) {
          circleRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [max, percentage],
    );

    return () => {
      animated.removeAllListeners();
    };
  });

  return (
    <View style={{width: radius * 2, height: radius * 2}}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}>
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeOpacity="0.1">
              <View
                style={{
                  width: wp(10),
                  height: hp(5),
                  backgroundColor: COLORS.white,
                }}></View>
              {/* {userData.map(item => (
                <>
                  {item.id === 1 && (
                    <Image
                      source={item.image}
                      style={{
                        width: wp(26.6),
                        height: hp(12.3),
                        resizeMode: 'contain',
                        borderRadius: wp(26.6),
                      }}
                    />
                  )}
                </>
              ))} */}
            </Circle>
          </Circle>
        </G>
      </Svg>
      <View
        style={{
          width: wp(10),
          height: hp(5),
          backgroundColor: COLORS.white,
        }}></View>
      {/* <AnimatedTextInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFillObject,
          {fontSize: radius / 2, color: textColor ?? color},
          styles.text,
        ]}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {fontWeight: '900', textAlign: 'center'},
});
