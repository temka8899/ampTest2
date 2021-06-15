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
// import Svg, {Circle} from 'react-native-svg';
import {COLORS, images} from '../constants';
import {hp, wp} from '../constants/theme';
import {userData} from '../data/Players';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {AuthContext} from '../../App';

const CircleXp = props => {
  const {userInfo, setUserInfo} = React.useContext(AuthContext);

  console.log(props.fill);
  return (
    <View>
      <AnimatedCircularProgress
        {...props}
        size={wp(31.5)}
        width={wp(1.5)}
        fill={parseInt(props.fill)}
        rotation={0}
        duration={750}
        lineCap="round"
        style={{
          zIndex: -2,
          // position: 'absolute',
        }}
        tintColor={COLORS.brand}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#F74C1130">
        {fill => (
          <View>
            <Image
              source={userInfo.avatar}
              style={{
                width: wp(26.6),
                height: hp(12.3),
                resizeMode: 'contain',
                borderRadius: wp(26.6),
                // position: 'absolute',
                // zIndex: 2,
              }}
            />
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};
export default CircleXp;
