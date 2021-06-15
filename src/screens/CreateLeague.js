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

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import GamePicker from '../components/GamePicker';

import awsmobile from '../aws-exports';
import DatePicker from 'react-native-datepicker';
import {createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';

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
            isStart: false,
          },
        }),
      );
      console.log('League Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <Image source={icons.backBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.imageContainer}>
          {uploadImage === '' ? (
            <Image
              style={{
                width: wp(70),
                height: hp(40),
                // borderColor: 'red',
                // borderWidth: 1,
              }}
              source={require('../assets/images/avatars/men1.png')}
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
        style={styles.chooseButton}>
        <Text style={{fontFamily: FONTS.brandFont, color: COLORS.white}}>
          {chooseData.name}
        </Text>
        <Image source={icons.drop} style={styles.dropImage} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        nRequestClose={() => changeModalVisible(false)}>
        <GamePicker changeModalVisible={changeModalVisible} setData={setData} />
      </Modal>
      <View style={styles.formContainer}>
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
      <View style={{marginHorizontal: wp(4), marginTop: hp(3)}}>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => addLeague()} style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create League</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    width: wp(100),
    height: hp(7),
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  chooseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  dropImage: {
    resizeMode: 'contain',
    height: hp(1.7),
    width: wp(4.53),
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  buttonContainer: {
    flex: 1,
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
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
    padding: wp(1),
    borderColor: COLORS.purpleText,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
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
