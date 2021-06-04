import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import ImagePicker from 'react-native-image-crop-picker';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {createGame, createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import GamePicker from '../components/GamePicker';

import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {userData} from '../data/Players';
import {CognitoIdToken, CognitoUser} from 'amazon-cognito-identity-js';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createLeagueScreen = ({navigation}) => {
  const [uploadImage, setUploadImage] = useState('');
  const [GameList, setGameList] = useState([]);
  const [LeagueList, setLeagueList] = useState([]);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
  };

  useEffect(() => {
    fetchGames();
    fetchLeague();
  }, []);

  async function fetchGames() {
    // const user = await Auth.currentUserInfo();
    // console.log('Attributes =======', user);
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));
      const gameList = gameData.data.listGames.items;
      setGameList(gameList);
      console.log('Games>>>>', gameList);
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
      console.log('error fetching todos', err);
    }
  }

  async function fetchLeague() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      const leagueList = leagueData.data.listLeagues.items;
      setLeagueList(leagueList);
      console.log('League>>>>>>>>>>>>>>', leagueList);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function addLeague() {
    try {
      await API.graphql(
        graphqlOperation(createLeague, {
          input: {
            startDate: '2021-07-01',
            leagueGameId: 'bbd83f8f-0dad-4ece-a0bf-63d76a148a2d',
            description: 'aeriabeubkaejbrkhaetbkaejtbkj',
          },
        }),
      );
      console.log('League Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <StatusBar barStyle="light-content"></StatusBar>
      <View
        style={{
          width: wp(100),
          height: hp(7),
          // borderColor: 'red',
          // borderWidth: 1,
          paddingHorizontal: wp(3),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>
      <View>
        <View style={{alignItems: 'center'}}>
          {uploadImage == '' ? (
            <Image
              style={{
                width: wp(70),
                height: hp(40),
                // borderColor: 'red',
                // borderWidth: 1,
              }}
              source={require('../../assets/images/men1.png')}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{
                uri: uploadImage,
              }}
              style={{
                width: wp(70),
                height: hp(40),
                backgroundColor: COLORS.background,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => changeModalVisible(true)}
        style={{
          height: hp(6),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(3),
          borderBottomColor: COLORS.brand,
          borderTopColor: COLORS.brand,
          borderWidth: 1,
        }}>
        <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
          {chooseData}
        </Text>
        <Image
          source={icons.drop}
          style={{resizeMode: 'contain', height: hp(1.7), width: wp(4.53)}}
        />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        nRequestClose={() => changeModalVisible(false)}>
        <GamePicker changeModalVisible={changeModalVisible} setData={setData} />
      </Modal>
      <TextInput
        onChangeText={val => setInput('name', val)}
        // value={formState.name}
        style={styles.input}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="Enter name"
        placeholderTextColor={COLORS.purpleText}
      />
    </SafeAreaView>
    // <View>
    //   <SafeAreaView>
    //     <Text>addLeague screen</Text>
    //     {GameList.map((todo, index) => {
    //       return (
    //         <View>
    //           <Text key={index}>{[index, '. ', todo.name]}</Text>
    //         </View>
    //       );
    //     })}
    //     <Button title="Add League" onPress={() => addLeague()} />
    //   </SafeAreaView>
    // </View>
  );
};
const styles = StyleSheet.create({
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  input: {
    height: hp(4),
    width: wp(70),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.5),
    padding: 0,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
});
export default createLeagueScreen;
