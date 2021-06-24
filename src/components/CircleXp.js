import * as React from 'react';
import {View, Image, StyleSheet, Platform} from 'react-native';

import {COLORS} from '../constants';
import {AuthContext} from '../../App';
import {hp, wp} from '../constants/theme';

import {AnimatedCircularProgress} from 'react-native-circular-progress';

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
        tintColor={COLORS.brand}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#F74C1130">
        {fill => (
          <View>
            <Image
              source={userInfo === undefined ? null : userInfo.avatar}
              style={[styles.image]}
            />
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: wp(27),
    height: wp(27),
    // resizeMode: 'contain',
    borderRadius: wp(26.6),
  },
});
export default CircleXp;
