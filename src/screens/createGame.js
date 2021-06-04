import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ColorPropType,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {createGame, createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import {COLORS, FONTS, icons} from '../constants';
import {hp, wp} from '../constants/theme';
import FormInput from '../components/FormInput';
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createGameScreen = ({navigation}) => {
  const initialState = {name: ''};
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [uploadImage, setUploadImage] = useState('');
  const [fileName123, setFileName] = useState('');
  const [file123, setFile123] = useState('');

  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }
  useEffect(() => {}, []);

  const choosePhotoFromLibrary = async () => {
    try {
      ImagePicker.openPicker({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 400,
        compressImageQuality: 0.7,
        cropping: true,
      }).then(image => {
        const file = {
          uri: image.sourceURL,
          name: image.filename,
          type: image.mime,
        };
        //
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //blobber(file);
        setFile123(file);
        //
        //
        setUploadImage(image.path);
        //console.log('-0-0-0-0-0-0-0-0-', image);
        //console.log(image.path);
      });
    } catch (err) {
      console.log('Error uploading file:', err);
    }
  };
  const blobber = async file => {
    //console.log('file ', file);
    const response = await fetch(file.uri);
    const blob = await response.blob();
    //console.log('blob --> ', blob);
    const fileName = file.name;
    setFileName(fileName);
    await Storage.put(fileName, blob, {
      contentType: 'image/jpeg',
      level: 'public',
    })
      .then(data => console.log('Blobber Upload to S3 Success>>>>', data))
      .catch(err => console.log('Blobber error>>>>', err));
  };
  async function addGame() {
    console.log('FormState name: ', formState.name);
    console.log('Filename: ', file123.name);
    try {
      blobber(file123);
      const todo = {...formState};
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(
        graphqlOperation(createGame, {
          input: {
            name: formState.name,
            image: fileName123,

            // image: file123.name,
          },
        }),
      );
      //console.log('>>>>>>>>>>>>>>>>>', todo);
    } catch (err) {
      console.log('error creating todo:', err);
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
                width: wp(80),
                height: hp(50),
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
                width: wp(80),
                height: hp(50),
                backgroundColor: COLORS.background,
              }}
              resizeMode="contain"
            />
          )}
        </View>
        <View
          style={{
            marginTop: hp(2),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Text>Enter game name</Text> */}
          <TextInput
            onChangeText={val => setInput('name', val)}
            value={formState.name}
            style={styles.input}
            // onChangeText={onChangeNumber}
            // value={number}
            placeholder="Enter name"
            placeholderTextColor={COLORS.purpleText}
          />
          <View
            style={{
              height: hp(0.3),
              width: wp(70),
              // marginTop: -hp(1),
              backgroundColor: COLORS.purpleText,
            }}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={choosePhotoFromLibrary}>
          <Text style={styles.btnText}>Choose an image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={addGame}>
          <Text style={styles.btnText}>Create game</Text>
        </TouchableOpacity>
      </View>
      {/* <Button
        style={styles.btnContainer}
        onPress={choosePhotoFromLibrary}
        title="Choose an image"
      />
      <Button title="Create game" onPress={addGame} /> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
  btnContainer: {
    width: wp(100),
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // borderColor: 'red',
    // borderWidth: 1,
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    width: wp(45),
    height: hp(5),
    // borderColor: 'red',
    // borderWidth: 1,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    resizeMode: 'contain',
    width: wp(7.4),
    height: hp(3.2),
    borderColor: 'white',
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.4),
  },
});
export default createGameScreen;
