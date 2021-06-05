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
import {createGame, createLeague, createTeam} from '../graphql/mutations';
import {
  listGames,
  listLeagues,
  listPlayers,
  listTeamPlayers,
} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import GamePicker from '../components/GamePicker';
import DatePicker from 'react-native-datepicker';

import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {userData} from '../data/Players';
import {CognitoIdToken, CognitoUser} from 'amazon-cognito-identity-js';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createLeagueScreen = ({navigation}) => {
  // const [date, setDate] = useState('09-10-2020');
  const [uploadImage, setUploadImage] = useState('');
  const [GameList, setGameList] = useState([]);
  const [LeagueList, setLeagueList] = useState([]);
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const initialState = {name: ''};
  const [formState, setFormState] = useState(initialState);
  const [startDate, setStartDate] = useState('2021-06-01');
  const [date, setdate] = useState('2021-06-01');
  const [leagueGameId, setLeagueGameId] = useState();
  const [leagueDescription, setleagueDescription] = useState();
  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }
  const changeModalVisible = bool => {
    setModalVisible(bool);
  };

  const setData = option => {
    setChooseData(option);
    // const imageName
    setUploadImage(
      `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/${option.image}`,
    );
    console.log(option.image);
    setLeagueGameId(option.id);
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
            startDate: `${startDate}`,
            leagueGameId: `${leagueGameId}`,
            description: `${leagueDescription}`,
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
          {chooseData.name}
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
      <View
        style={{
          // borderColor: 'red',
          // borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: hp(3),
        }}>
        <TextInput
          multiline
          numberOfLines={4}
          maxLength={150}
          autoCorrect={false}
          onChangeText={val => setleagueDescription(val)}
          // value={formState.name}
          style={styles.input}
          // onChangeText={onChangeNumber}
          // value={number}
          placeholder="Enter description"
          placeholderTextColor={COLORS.purpleText}
        />
      </View>
      <View style={{marginHorizontal: wp(3), marginTop: hp(3)}}>
        <Text style={[styles.text, {color: COLORS.purpleText}]}>Start</Text>
        {/* <Text style={[styles.text, {color: COLORS.greyText}]}>{hrs}</Text> */}
        <DatePicker
          style={styles.datePickerStyle}
          date={startDate}
          mode="date"
          placeholder="select date"
          format="YYYY MM DD"
          minDate="2021-06-01"
          maxDate="2022-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              borderWidth: 0,
              alignItems: 'flex-start',
            },
            dateText: {
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
            },
          }}
          onDateChange={startDate => {
            setStartDate(startDate);
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          width: wp(90),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          // borderColor: 'red',
          // borderWidth: 1,
        }}>
        <TouchableOpacity onPress={() => addLeague()} style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create League</Text>
        </TouchableOpacity>
      </View>
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
    height: hp(10),
    width: wp(94),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.5),
    padding: 0,
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: 'center',
    // textAlign: 'center',
    alignItems: 'center',
  },
  createBtn: {
    height: hp(5),
    width: wp(75),
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2),
  },
  text: {
    fontFamily: FONTS.brandFont,
  },
});
export default createLeagueScreen;
