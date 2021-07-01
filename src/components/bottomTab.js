import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';

import {hp, wp} from '../constants/theme';
import {COLORS, FONTS, icons} from '../constants';
import GameScreen from '../screens/GameScreen';
import CountScreen from '../screens/CountScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateGameScreen from '../screens/CreateGame';
import ScheduleScreen from '../screens/ScheduleScreen';
import StandingsScreen from '../screens/StandingsScreen';
import CreateLeagueScreen from '../screens/CreateLeague';
import ParticipatesScreen from '../screens/ParticipatesScreen';
// import EditProfileScreen from '../screens/EditProfileScreen';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import createTeamScreen from '../screens/CreateTeam';
import EditProfileScreen from '../screens/EditProfileScreen';
import FormInterface from '../screens/FormInterface';

const Tab = createBottomTabNavigator();
const GameStack = createStackNavigator();
const ScheduleStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const Tabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      shifting={false}
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
        component={ScheduleScreen}
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
        component={StandingsScreen}
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
        component={ProfileScreen}
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

// const GameStackScreen = ({navigation}) => {
//   return (
//     <GameStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <GameStack.Screen name="Game" component={GameScreen} />
//     </GameStack.Navigator>
//   );
// };

// const ScheduleStackScreen = ({navigation}) => {
//   return (
//     <ScheduleStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <ScheduleStack.Screen name="Schedule" component={ScheduleScreen} />
//     </ScheduleStack.Navigator>
//   );
// };

// const ProfileStackScreen = ({navigation}) => {
//   return (
//     <ProfileStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <ProfileStack.Screen name="Profile" component={ProfileScreen} />
//     </ProfileStack.Navigator>
//   );
// };

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
