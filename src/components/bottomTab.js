import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import GameScreen from '../screens/GameScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import Standings from '../screens/StandingsScreen';
import Profile from '../screens/ProfileScreen';
import {Image, View, Text} from 'react-native';
import {COLORS, FONTS, icons, images, index, theme, SIZES} from '../constants';
import {hp, wp} from '../constants/theme';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          width: wp(100),
          height: hp(11),
          backgroundColor: COLORS.background,
          // position: 'absolute',
          // bottom: 25,
          // left: 20,
          // right: 20,
          // elevation: 0,
          // borderRadius: 15,
          // height: 90,
          // shadowColor: COLORS.white,
          // shadowOffset: {width: 0, height: 10},
          // shadowOpacity: 0.25,
          // shadowRadius: 3.5,
          // elevation: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={GameScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabItems, {top: insets.bottom / 2}]}>
              <Image
                source={focused ? icons.HomeFill : icons.Home}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={[
                  {color: focused ? COLORS.brand : COLORS.tabgrey},
                  styles.tabbarText,
                ]}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabItems, {top: insets.bottom / 2}]}>
              <Image
                source={focused ? icons.ScheduleFill : icons.Schedule}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={[
                  {color: focused ? COLORS.brand : COLORS.tabgrey},
                  styles.tabbarText,
                ]}>
                Schedule
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Standings"
        component={Standings}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabItems, {top: insets.bottom / 2}]}>
              <Image
                source={focused ? icons.StandingsFill : icons.Standings}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={[
                  {color: focused ? COLORS.brand : COLORS.tabgrey},
                  styles.tabbarText,
                ]}>
                Standings
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabItems, {top: insets.bottom / 2}]}>
              <Image
                source={focused ? icons.ProfileFill : icons.Profile}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text
                style={[
                  {color: focused ? COLORS.brand : COLORS.tabgrey},
                  styles.tabbarText,
                ]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Tabs;

const styles = StyleSheet.create({
  tabItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbarText: {
    fontFamily: FONTS.brandFont,
    marginTop: hp(1),
    fontSize: RFPercentage(1.2),
  },
});
