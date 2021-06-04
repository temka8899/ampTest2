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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {createGame, createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const createGameScreen = ({navigation}) => {
  const initialState = {name: '', description: ''};
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
        setFileName(file.name);
        setUploadImage(image.path);
        //console.log('-0-0-0-0-0-0-0-0-', image);
        //console.log(image.path);
      });
    } catch (err) {
      console.log('Error getting filename:', err);
    }
  };

  const blobber = async file => {
    //console.log('file ', file);
    const response = await fetch(file.uri);
    const blob = await response.blob();
    Storage.put(fileName123, blob, {
      contentType: 'image/jpeg',
      level: 'public',
    })
      .then(() => {
        console.log('Blobber Success');
        createGameItem(fileName123);
      })
      .catch(err => console.log('Blobber error>>>>', err));
  };

  const createGameItem = async fileName123 => {
    let res = await API.graphql(
      graphqlOperation(createGame, {
        input: {
          name: formState.name,
          image: fileName123,
        },
      }),
    );
    console.log('done?????', res);
  };

  // async function addGame() {
  //   console.log('FormState name: ', formState.name);
  //   console.log('Filename: ', file123.name);
  //   try {
  //     blobber(file123).then;
  //     const todo = {...formState};
  //     setTodos([...todos, todo]);
  //     setFormState(initialState);
  //     await API.graphql(
  //       graphqlOperation(createGame, {
  //         input: {
  //           name: formState.name,
  //           image: fileName123,

  //           // image: file123.name,
  //         },
  //       }),
  //     );
  //     //console.log('>>>>>>>>>>>>>>>>>', todo);
  //   } catch (err) {
  //     console.log('error creating todo:', err);
  //   }
  // }

  return (
    <View>
      <View style={{alignItems: 'center'}}>
        {uploadImage == '' ? (
          <Image
            style={{width: 195, height: 107}}
            source={require('../../assets/images/men1.png')}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{
              uri: uploadImage,
            }}
            style={{height: 195, width: 107, backgroundColor: 'green'}}
            resizeMode="contain"
          />
        )}
      </View>
      <SafeAreaView>
        <TextInput
          onChangeText={val => setInput('name', val)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <Button
          style={styles.btnContainer}
          onPress={choosePhotoFromLibrary}
          title="Choose an image"
        />
        <Button title="Create Game" onPress={() => blobber(file123)} />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  todo: {marginBottom: 15},
  input: {height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8},
  todoName: {fontSize: 18},
});
export default createGameScreen;
