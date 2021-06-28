import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';

import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';
import GameScreen from '../screens/GameScreen';
import Profile from '../screens/ProfileScreen';
import Standings from '../screens/StandingsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import Admin from '../screens/CreateLeague';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
                style={styles.icon}
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
        component={Admin}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabItems, {top: insets.bottom / 2}]}>
              <Image
                source={focused ? icons.ScheduleFill : icons.Schedule}
                resizeMode="contain"
                style={styles.icon}
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
                style={styles.icon}
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
                style={styles.icon}
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
  icon: {
    width: 25,
    height: 25,
  },
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
