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
  TextBase,
  ActivityIndicator,
} from 'react-native';
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
        source={item.image}
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
          {/* <Text>dsfgh</Text> */}
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
    // fetchLeagues();
    findGreet();
    getName();
  }, []);

  const [LeagueList, setLeagueList] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [playerId, setId] = useState('');
  const [name, setName] = useState();
  const [greet, setGreet] = useState('');
  const [name2, setName2] = useState('');

  async function fetchLeagues() {
    // const user = await Auth.currentUserInfo();
    // console.log('Attributes =======', user);
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      const leagueList = leagueData.data.listLeagues.items;
      setLeagueList(leagueList);
      console.log('Leagues>>>>', leagueList);
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // const user2 = await Auth.currentAuthenticatedUser();
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', user2);
      // const result = await Auth.updateUserAttributes(user2, {
      //   'custom:IntLevel': `5`,
      //   'custom:Xp': `390`,
      //   'custom:Name': `Mkoogii`,
      //   'custom:Admin': `1`,
      // });
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    } catch (err) {
      console.log('error fetching players', err);
    }
  }

  const renderItem = ({item}) => {
    // const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() =>
          navigation.navigate('ParticipatesScreen', {
            data: DATA,
            itemId: item.id,
          })
        }
        // backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const findGreet = () => {
    const hrs = new Date().getHours();
    if (hrs === 0 || hrs < 12) return setGreet('Morning');
    if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
    setGreet('Evening');
  };

  async function getName() {
    const user = await Auth.currentUserInfo();
    const playerData = await API.graphql(graphqlOperation(listPlayers));
    setLoading(false);
    console.log(`userInfo`, userInfo);
    setName(user.attributes['custom:Name']);
    let existing = await checkPlayer(playerData, user.username);
    if (existing) {
      addPlayer(user.attributes['custom:Name'], user.username);
    } else {
      // user baigaa nuhtsul
    }
    findUser(playerData, user);
  }

  async function findUser(users, user) {
    console.log(`users`, users.data.listPlayers.items);
    console.log(`user`, user);
    let finded = users.data.listPlayers.items.find((item, index) => {
      if (user.username === item.c_id) {
        return item;
      }
    });
    // await AsyncStorage.setItem('__user_key__', JSON.stringify(finded));
    setUserInfo(finded);
    console.log('finded set hiilee', finded);
  }

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
      await API.graphql(
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
      console.log('Player Created');
    } catch (err) {
      console.log('error creating Player:', err);
    }
  }

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
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
            // showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
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
    // paddingLeft: 10,
    // paddingRight: 10,
    marginVertical: 8,
    // marginHorizontal: 16,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  title: {
    fontSize: 32,
  },
  // image: {
  //   shadowColor: 'red',
  //   shadowOpacity: 0.5,
  //   shadowRadius: 20,
  // },
});

export default GameScreen;
