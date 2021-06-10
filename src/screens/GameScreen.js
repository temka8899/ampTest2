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
  ActivityIndicator,
} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {icons, images, index, theme} from '../constants';
import {wp, hp, ft, COLORS, FONTS} from '../constants/theme';
import {createGame, createLeague, createPlayer} from '../graphql/mutations';
import {listPlayers, listLeagues, listTeams} from '../graphql/queries';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import awsmobile from '../aws-exports';
import {DATA} from '../data/DATA';
import LinearGradient from 'react-native-linear-gradient';
import Amplify, {API, graphqlOperation, Auth, Storage, JS} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../App';
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <View style={{marginLeft: wp(4), marginTop: hp(3), borderRadius: 20}}>
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <ImageBackground
        source={{
          uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${item.game.image}`,
        }}
        style={{
          width: wp(63.3),
          height: hp(39),
        }}
        imageStyle={{borderRadius: 40}}>
        <LinearGradient
          style={{flex: 1, borderRadius: 40}}
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#00000000', '#000']}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginBottom: hp(5),
              marginHorizontal: wp(5),
            }}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                paddingVertical: hp(1),
              }}>
              {item.game.name}
            </Text>
            <Text style={{color: COLORS.white, fontFamily: FONTS.brandFont}}>
              {item.startDate}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

async function getUserData() {
  const user = Auth.currentUserInfo();
  console.log(user);
}

const GameScreen = ({navigation}) => {
  const {userInfo, setUserInfo} = React.useContext(AuthContext);

  useEffect(() => {
    fetchLeague();
    findGreet();
    getName();
  }, [getName]);

  const [LeagueList, setLeagueList] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [playerId, setId] = useState('');
  const [name, setName] = useState();
  const [greet, setGreet] = useState('');
  const [name2, setName2] = useState('');

  const renderItem = ({item}) => {
    // const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() =>
          navigation.navigate('ParticipatesScreen', {
            itemId: item,
          })
        }
        textColor={{color}}
      />
    );
  };

  const findGreet = () => {
    const hrs = new Date().getHours();
    const day = new Date().getDay();
    console.log(day);
    if (hrs === 0 || hrs < 12) return setGreet('Morning');
    if (hrs === 1 || hrs < 17) return setGreet('Afternoon');

    setGreet('Evening');
  };

  const getName = React.useCallback(async () => {
    const user = await Auth.currentUserInfo();
    const playerData = await API.graphql(graphqlOperation(listPlayers));
    setLoading(false);
    //console.log('userInfo', userInfo);
    setName(user.attributes['custom:Name']);
    let existing = await checkPlayer(playerData, user.username);
    if (existing) {
      await addPlayer(user.attributes['custom:Name'], user.username);
    } else {
      // user baigaa nuhtsul
    }
    findUser(user);
  }, [findUser]);

  const findUser = React.useCallback(
    async user => {
      console.log(`cognito data`, user);
      const playerData = await API.graphql(graphqlOperation(listPlayers));
      // console.log(
      //   `playerData.data.listPlayers.items`,
      //   playerData.data.listPlayers.items,
      // );
      let finded = playerData.data.listPlayers.items.find((item, index) => {
        if (user.username === item.c_id) {
          return item;
        }
      });
      setUserInfo(finded);
      console.log('context player model data', finded);
    },
    [setUserInfo],
  );

  const fetchLeague = async () => {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      // const todos = leagueData.data.listTeams.items;
      // console.log('Teams>>>>>>>>>>>>>>', todos);
      console.log('Leagues>>>>>>>>>>>>>>', leagueData.data.listLeagues.items);
      setLeagueList(leagueData.data.listLeagues.items);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  };

  async function checkPlayer(playerData, p_id) {
    try {
      const players = playerData.data.listPlayers.items;
      console.log('Players>>>>>>>>>>>>>>', players);
      for (var i = 0; i < players.length; i++) {
        if (players[i].c_id == p_id) {
          return false;
        }
      }
      return true;
    } catch (err) {
      console.log('error fetching players', err);
    }
  }

  async function addPlayer(username, p_id) {
    console.log('uuslee', username, p_id);
    try {
      const res = await API.graphql(
        graphqlOperation(createPlayer, {
          input: {
            c_id: p_id,
            name: username,
            xp: 1,
            level: 1,
            admin: true,
          },
        }),
      );
      console.log('>>>>>>>>>>>>>>>>>>>>', res);
      console.log('Player Created');
    } catch (err) {
      console.log('error creating Player:', err);
    }
  }

  // if (isLoading) {
  //   return (
  //     <View>
  //       <ActivityIndicator size={'large'} color={'red'} />
  //     </View>
  //   );
  // }
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
              {name}
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
            showsHorizontalScrollIndicator={false}
            horizontal
            data={LeagueList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
            onPress={() => {}}
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
    marginVertical: 8,
  },
  title: {
    fontSize: 32,
  },
});

export default GameScreen;
