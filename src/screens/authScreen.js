import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Button,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import Amplify, {Auth} from 'aws-amplify';
import awsmobile from '../aws-exports';
import {wp, hp} from '../constants/constants';
import {useNavigation} from '@react-navigation/core';
import FormInput from '../components/formInput';
import {SignUp} from 'aws-amplify-react-native/dist/Auth';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

const SwitchView = ({value, onPress}) => {
  const navigation = useNavigation();
  const [email, setSignUpEmail] = useState('');
  const [username, setSignUpUsername] = useState('');
  const [password, setSignUpPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('+97688888888');
  const [authCode, setConfirmCode] = useState('');
  const [Level, setLevel] = useState(0);
  const [Xp, setXp] = useState(0);

  async function signUp() {
    console.log(email);
    console.log(password);
    console.log(username);
    console.log('dugaar-->', phone_number);

    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: `${email}`,
          phone_number: `${phone_number}`,
          'custom:IntLevel': `${Level}`,
          'custom:Xp': `${Xp}`,
        },
      });

      console.log('✅ Sign-up Confirmed');
      onPress(3);
    } catch (error) {
      console.log('❌ Error signing up...', error);
    }
  }
  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, authCode);
      console.log('✅ Code confirmed');
      navigation.navigate('Home');
    } catch (error) {
      console.log('❌ Verification code does not match.', error.code);
    }
  }

  switch (value) {
    case 0:
      return (
        <View style={{flex: 1, marginTop: 400, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => onPress(1)}>
            <ImageBackground
              source={require('../images/button.png')}
              style={styles.button}>
              <Text style={[styles.btnText, {color: 'white'}]}>SIGN IN</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => onPress(2)}>
            <ImageBackground
              source={require('../images/button.png')}
              style={styles.button}>
              <Text style={[styles.btnText, {color: 'white'}]}>SIGN UP</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );

    //SignIn
    case 1:
      return <SignInScreen navigation={navigation} onPress={onPress} />;
    //SignUp screen
    case 2:
      return (
        <View
          style={{
            flex: 1,
            marginTop: 350,
            alignSelf: 'center',
            alignItems: 'center',
            width: wp(72.5),
            height: hp(28),
            backgroundColor: 'rgba(0,3,37,0.75)',
            borderRadius: 15,
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.inner}>
              <View style={styles.form}>
                <TextInput
                  // value={signUpEmail}
                  onChangeText={text => [
                    setSignUpEmail(text),
                    setSignUpUsername(text),
                  ]}
                  leftIcon="account"
                  placeholder="Enter sign up email"
                  placeholderTextColor="white"
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  style={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 3,
                  }}
                />
                <TextInput
                  // value={signUpPassword}
                  onChangeText={text => setSignUpPassword(text)}
                  leftIcon="lock"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  placeholderTextColor="white"
                  autoCorrect={false}
                  secureTextEntry
                  textContentType="password"
                  style={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 3,
                    marginTop: 5,
                  }}
                />
                <TextInput
                  // value={signUpPassword}
                  onChangeText={text => [setPhoneNumber(`+976${text}`)]}
                  keyboardType="number-pad"
                  leftIcon="lock"
                  placeholder="Enter phone number"
                  autoCapitalize="none"
                  placeholderTextColor="white"
                  autoCorrect={false}
                  style={{
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 3,
                    marginTop: 5,
                  }}
                />
                {/* <TouchableOpacity onPress={() => onPress(3)}> */}
                <TouchableOpacity onPress={() => signUp()}>
                  <ImageBackground
                    source={require('../images/button.png')}
                    style={{
                      width: wp(50),
                      height: hp(5.29),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        paddingTop: hp(0.6),
                        margin: hp(1),
                        color: 'white',
                      }}>
                      SIGN UP
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    //SignUp
    case 3:
      return (
        <View
          style={{
            flex: 1,
            marginTop: 350,
            alignSelf: 'center',
            width: wp(72.5),
            height: hp(28),
            backgroundColor: 'rgba(0,3,37,0.75)',
            borderRadius: 15,
          }}>
          <FlashMessage position="top" />
          <TextInput
            // value={signUpPassword}
            onChangeText={text => setConfirmCode(text)}
            keyboardType="number-pad"
            leftIcon="lock"
            placeholder="Enter confirmation code"
            autoCapitalize="none"
            placeholderTextColor="white"
            autoCorrect={false}
            style={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 3,
              marginTop: 5,
            }}
          />
          <TouchableOpacity onPress={() => confirmSignUp()}>
            <ImageBackground
              source={require('../images/button.png')}
              style={{
                width: wp(50),
                height: hp(5.29),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  paddingTop: hp(0.6),
                  margin: hp(1),
                  color: 'white',
                }}>
                SIGN UP
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    default:
      return;
  }
};

const SignInScreen = ({navigation, onPress}) => {
  const [username, setUsername] = useState('temuleon8899@gmail.com');
  const [password, setPassword] = useState('12345678');
  const signIn = async () => {
    try {
      await Auth.signIn(username, password);
      navigation.navigate('Home');
      console.log('✅ Sign In Success');
      setUsername('');
      setPassword('');
      onPress(0);
    } catch (error) {
      showMessage({
        message: `${error.message}`,
        description: 'Check your email and password',
        type: 'warning',
      });
      console.log('❌ Error signing in...', error);
    }
  };
  return (
    <View
      style={{marginTop: 450, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          width: wp(72.5),
          height: hp(28),
          backgroundColor: 'rgba(0,3,37,0.75)',
          borderRadius: 15,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'PressStart2P-Regular',
              justifyContent: 'center',
            }}>
            Sign in to your account
          </Text>
        </View>

        <TextInput
          value={username}
          onChangeText={text => setUsername(text)}
          leftIcon="account"
          placeholder="Enter username"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          style={{
            color: 'white',
            borderColor: 'white',
            borderWidth: 3,
          }}
        />
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
          style={{
            color: 'white',
            borderColor: 'white',
            borderWidth: 3,
            marginTop: 5,
          }}
        />
        <Button title="Login" onPress={signIn} />
        <View style={{flexDirection: 'row'}}>
          <Button
            title="Forgot password"
            color="white"
            style={{borderColor: 'white', borderRadius: 10, borderWidth: 10}}
          />
          <Button title="Sign in" />
        </View>
      </View>
    </View>
  );
};

export default function AuthScreen() {
  const [whichScreen, setWhichScreen] = useState(0);

  //SignIn Home screen
  return (
    <ImageBackground
      source={require('../images/background.png')}
      style={styles.container}>
      <FlashMessage position="top" />
      <StatusBar animated={true} barStyle="light-content" />
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="light-content" />
        <View style={{alignItems: 'center'}}>
          <View style={{flex: 3}}>
            {/* <ImageBackground
                source={require('../images/button.png')}
                style={{
                  resizeMode: 'contain',
                  width: wp(74.66),
                  height: hp(36.08),
                  marginTop: hp(8),
                  justifyContent: 'flex-start',
                }}
              /> */}
          </View>
        </View>
        <SwitchView value={whichScreen} onPress={val => setWhichScreen(val)} />
      </SafeAreaView>
      {/* <SafeAreaView>
          <View style={{marginTop: 450}}>
            <TouchableOpacity onPress={() => setWhichScreen(1)}>
              <ImageBackground
                source={require('../images/button.png')}
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>Sign In</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground
                source={require('../images/button.png')}
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>Sign Up</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </SafeAreaView> */}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  btnContainer: {
    width: wp(81.28),
    height: hp(9.719),
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: hp(1),
  },
});
