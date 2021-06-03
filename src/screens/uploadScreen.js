import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {createGame, createLeague} from '../graphql/mutations';
import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {userData} from '../data/Players';
import {CognitoIdToken, CognitoUser} from 'amazon-cognito-identity-js';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

// import {AmplifyTheme} from 'aws-amplify-react-native';

// const MySectionHeader = Object.assign({}, AmplifyTheme.sectionHeader, {
//   background: 'black',
// });
// const MyTheme = Object.assign({}, AmplifyTheme, {
//   sectionHeader: MySectionHeader,
// });

// Amplify.configure(awsmobile);

// const [uploadImage, setUploadImage] = useState('empty');

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const initialState = {name: '', description: ''};
const imageURL = '';
const Home = ({navigation}) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [uploadImage, setUploadImage] = useState('');
  const [fileName123, setFileName] = useState('');
  const [file123, setFile123] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }

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

  // async function pathToImageFile() {
  //   try {
  //     await Storage.put(uploadImageName, uploadImage, {
  //       contentType: 'image/jpeg', // contentType is optional
  //     });
  //   } catch (err) {
  //     console.log('Error uploading file:', err);
  //   }
  // }

  async function fetchGames() {
    const user = await Auth.currentUserInfo();
    console.log('Attributes =======', user);
    // userInfo = await Auth.userAttributes(us).then(console.log(userInfo));
    try {
      const todoData = await API.graphql(graphqlOperation(listGames));
      const todos = todoData.data.listGames.items;
      console.log('Games>>>>', todos);
      setTodos(todos);
      const user2 = await Auth.currentAuthenticatedUser();
      const result = await Auth.updateUserAttributes(user2, {
        'custom:IntLevel': `5`,
        'custom:Xp': `390`,
        'custom:Name': `moogii`,
        'custom:Admin': `1`,
      });
      // const temp = Storage.get();
      // // Storage.list('') // for listing ALL files without prefix, pass '' instead
      // //         .then(result => console.log(result))
      // //         .catch(err => console.log(err));
      // console.log('tempoooo ----> ', temp);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function fetchLeague() {
    try {
      const leagueData = await API.graphql(graphqlOperation(listLeagues));
      const todos = leagueData.data.listLeagues.items;
      console.log('leagueData', leagueData);
      console.log('League>>>>>>>>>>>>>>', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

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

  async function addLeague() {
    try {
      await API.graphql(
        graphqlOperation(createLeague, {
          input: {
            startDate: '2021-08-01',
            leagueGameId: 'b95b3ca0-9338-442e-9eb8-a323c6114c4c',
          },
        }),
      );
      console.log('League Created');
    } catch (err) {
      console.log('error creating League:', err);
    }
  }

  return (
    <View style={styles.container}>
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
      <Button
        style={styles.btnContainer}
        onPress={choosePhotoFromLibrary}
        title="Choose an image"
      />

      <Button
        onPress={() => [Auth.signOut(), navigation.replace('Auth')]}
        title="Sign Out"
      />
      <Button onPress={() => addLeague()} title="Create League" />
      <Button onPress={() => fetchLeague()} title="Fetch League" />
      <Button title="Create Game" onPress={addGame} />

      <TextInput
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

      <Image
        source={{
          uri: `https://amptest2project1ff67101811247b8a7fc664ba3fce889170617-dev.s3.amazonaws.com/public/nba.png`,
        }}
        style={{width: 400, height: 400}}
      />

      {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

      {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

      {/* {todos.map((todo, index) => {
        return (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text>{todo.image}</Text>
          </View>
        );
      })} */}

      {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  todo: {marginBottom: 15},
  input: {height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8},
  todoName: {fontSize: 18},
});

export default Home;
