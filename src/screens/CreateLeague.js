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
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';
import GamePicker from '../components/GamePicker';

import awsmobile from '../aws-exports';
import DatePicker from 'react-native-datepicker';
import {createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const playerAmount = [4, 6, 8, 10, 12, 14, 16];

const CreateLeagueScreen = ({navigation}) => {
  // const [date, setDate] = useState('09-10-2020');
  const [uploadImage, setUploadImage] = useState('');
  const [GameList, setGameList] = useState([]);
  const [LeagueList, setLeagueList] = useState([]);
  const [isLoading, setLoading] = useState('');
  const [chooseData, setChooseData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const initialState = {name: ''};
  const [formState, setFormState] = useState(initialState);
  const [startDate, setStartDate] = useState('2021-06-01');
  const [date, setdate] = useState('2021-06-01');
  const [leagueGameId, setLeagueGameId] = useState();
  const [leagueDescription, setleagueDescription] = useState();
  const [minimumPlayer, setMinimumPlayer] = useState();

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
  }, []);

  async function fetchGames() {
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));
      const gameList = gameData.data.listGames.items;
      setGameList(gameList);
      console.log('Games>>>>', gameList);
    } catch (err) {
      fetchLeague();
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
      setLoading(true);
      await API.graphql(
        graphqlOperation(createLeague, {
          input: {
            startDate: `${startDate}`,
            leagueGameId: `${leagueGameId}`,
            description: `${leagueDescription}`,
            isStart: false,
            minPlayer: minimumPlayer,
            isPlayoff: false,
          },
        }),
      );
      console.log('League Created');
      setLoading(false);
      navigation.pop();
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Image source={icons.backBtn} style={styles.backBtn} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{margin: 0}}>
            <View>
              <View style={styles.imageContainer}>
                {uploadImage === '' ? (
                  <Image
                    style={{
                      width: wp(60),
                      height: wp(60),
                      // borderColor: 'red',
                      // borderWidth: 1,
                    }}
                    source={images.local}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={{
                      uri: uploadImage,
                    }}
                    style={{
                      width: wp(70),
                      height: wp(70),
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
                {chooseData === '' ? 'Select' : chooseData.name}
              </Text>
              <Image source={icons.drop} style={styles.dropButton} />
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              nRequestClose={() => changeModalVisible(false)}>
              <GamePicker
                changeModalVisible={changeModalVisible}
                setData={setData}
              />
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
            <View
              style={{
                marginHorizontal: wp(4),
                marginTop: hp(3),
                flexDirection: 'row',
              }}>
              <View>
                <Text style={[styles.text, {color: COLORS.purpleText}]}>
                  Start
                </Text>
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
                      width: 0,
                      height: 0,
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
              <View>
                <Text style={[styles.text, {color: COLORS.purpleText}]}>
                  Min player
                </Text>
                <Picker
                  itemStyle={{color: 'white'}}
                  dropdownIconColor={'white'}
                  mode={'dropdown'}
                  style={{
                    width: wp(40),
                  }}
                  selectedValue={minimumPlayer}
                  onValueChange={(itemValue, itemIndex) =>
                    setMinimumPlayer(itemValue)
                  }>
                  {playerAmount.map((item, ind) => (
                    <Picker.Item
                      label={item.toString()}
                      value={item}
                      key={ind}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                disabeled={isLoading}
                onPress={() => addLeague()}
                style={styles.createBtn}>
                {isLoading ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.createBtnText}>Create League</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    width: wp(100),
    height: wp(16),
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  chooseButton: {
    height: wp(13),
    marginTop: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomColor: COLORS.brand,
    borderTopColor: COLORS.brand,
    borderWidth: 1,
  },
  dropButton: {
    resizeMode: 'contain',
    height: wp(4.53),
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
  datePickerStyle: {
    width: wp(40),
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: wp(7.4),
    borderColor: 'white',
  },
  input: {
    height: wp(20),
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
    height: wp(11),
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
export default CreateLeagueScreen;
