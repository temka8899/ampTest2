import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {createGame, createLeague, createPlayer} from '../graphql/mutations';
// import {listGames, listLeagues} from '../graphql/queries';
import awsmobile from '../aws-exports';
import {useNavigation} from '@react-navigation/core';
import FormInput from '../components/FormInput';
import {SignUp} from 'aws-amplify-react-native/dist/Auth';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {icons, images, index, theme} from '../constants';
import {wp, hp, ft, FONTS, COLORS} from '../constants/theme';
import {listPlayers, listLeagues, listTeams} from '../graphql/queries';

import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {userData} from '../data/Players';
import {useBackButton} from '@react-navigation/native';

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
  const [name, setSignUpName] = useState('');
  const [phone_number, setPhoneNumber] = useState('+97688888888');
  const [authCode, setConfirmCode] = useState('');
  const [Level, setLevel] = useState('1');
  const [Xp, setXp] = useState('1');

  const [currentUser, setCurrentUser] = useState();

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
          'custom:Admin': `1`,
          'custom:Name': `${name}`,
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
      let temp = await Auth.confirmSignUp(username, authCode);
      console.log(temp);
      console.log('✅ Code confirmed');
      onPress(1);
    } catch (error) {
      console.log('❌ Verification code does not match.', error.code);
    }
  }

  switch (value) {
    case 0:
      return (
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => onPress(1)}>
            <ImageBackground source={images.button} style={styles.button}>
              <Text style={styles.btnText}>SIGN IN</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => onPress(2)}>
            <ImageBackground source={images.button} style={styles.button}>
              <Text style={styles.btnText}>SIGN UP</Text>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: wp(75.5),
              height: hp(35),
              backgroundColor: '#00032590',
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: hp(2),
            }}>
            <FormInput
              autoCorrect={false}
              // value={signUpPassword}
              onChangeText={text => [setSignUpName(text)]}
              placeholder="Name"
            />
            <FormInput
              autoCorrect={false}
              autoCapitalize="none"
              // value={signUpEmail}
              onChangeText={text => [
                setSignUpEmail(text),
                setSignUpUsername(text),
              ]}
              placeholder="Email"
              keyboardType="email-address"
            />

            <FormInput
              autoCorrect={false}
              // value={signUpPassword}
              onChangeText={text => setSignUpPassword(text)}
              placeholder="Password"
              secureTextEntry
            />

            <FormInput
              autoCorrect={false}
              whichScreen
              // value={signUpPassword}
              onChangeText={text => [setPhoneNumber(`+976${text}`)]}
              placeholder="Phone number"
              keyboardType="number-pad"
            />

            <TouchableOpacity onPress={() => signUp()}>
              <ImageBackground
                source={images.button}
                style={{
                  width: wp(50),
                  height: hp(5.29),
                  // borderColor: 'white',
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.brandFont,
                    color: COLORS.white,
                    paddingTop: hp(0.6),
                    margin: hp(1),
                    fontSize: RFPercentage(1.7),
                  }}>
                  SIGN UP
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    //SignUp
    case 3:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: wp(75.5),
              height: hp(26),
              backgroundColor: '#00032590',
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: hp(2),
            }}>
            <FlashMessage position="top" />
            <Text style={styles.text}>Enter your code from email</Text>

            <FormInput
              value={authCode}
              autoCorrect={false}
              placeholder="Code"
              onChangeText={text2 => setConfirmCode(text2)}
              keyboardType="number-pad"
            />

            <TouchableOpacity onPress={() => confirmSignUp()}>
              <ImageBackground
                source={images.button}
                style={{
                  width: wp(50),
                  height: hp(5.29),
                  // borderColor: 'white',
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.brandFont,
                    color: COLORS.white,
                    paddingTop: hp(0.6),
                    margin: hp(1),
                    fontSize: RFPercentage(1.7),
                  }}>
                  CONFIRM
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    //Forgot password1
    case 4:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: wp(75.5),
              height: hp(26),
              backgroundColor: '#00032590',
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: hp(2),
            }}>
            <FlashMessage position="top" />
            <Text style={styles.text}>Enter your email </Text>

            <FormInput
              value={authCode}
              autoCorrect={false}
              placeholder="Email"
              onChangeText={text2 => setConfirmCode(text2)}
              keyboardType="email-address"
            />

            <TouchableOpacity onPress={() => onPress(5)}>
              <ImageBackground
                source={images.button}
                style={{
                  width: wp(50),
                  height: hp(5.29),
                  // borderColor: 'white',
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.brandFont,
                    color: COLORS.white,
                    paddingTop: hp(0.6),
                    margin: hp(1),
                    fontSize: RFPercentage(1.7),
                  }}>
                  SEND
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    //Forgot password2
    case 5:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: wp(75.5),
              height: hp(26),
              backgroundColor: '#00032590',
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: hp(2),
            }}>
            <FlashMessage position="top" />
            <Text style={styles.text}>Enter your code from email</Text>

            <FormInput
              value={authCode}
              autoCorrect={false}
              placeholder="Code"
              onChangeText={text2 => setConfirmCode(text2)}
              keyboardType="number-pad"
            />

            <TouchableOpacity onPress={() => onPress(6)}>
              <ImageBackground
                source={images.button}
                style={{
                  width: wp(50),
                  height: hp(5.29),
                  // borderColor: 'white',
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.brandFont,
                    color: COLORS.white,
                    paddingTop: hp(0.6),
                    margin: hp(1),
                    fontSize: RFPercentage(1.7),
                  }}>
                  CONFIRM
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    //Forgot password3
    case 6:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: wp(75.5),
              height: hp(26),
              backgroundColor: '#00032590',
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: hp(2),
            }}>
            <FlashMessage position="top" />
            <Text style={styles.text}>Enter new password</Text>

            <FormInput
              value={authCode}
              autoCorrect={false}
              onChangeText={text2 => setConfirmCode(text2)}
              placeholder="Password"
              secureTextEntry
            />

            <TouchableOpacity onPress={() => onPress(1)}>
              <ImageBackground
                source={images.button}
                style={{
                  width: wp(50),
                  height: hp(5.29),
                  // borderColor: 'white',
                  // borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.brandFont,
                    color: COLORS.white,
                    paddingTop: hp(0.6),
                    margin: hp(1),
                    fontSize: RFPercentage(1.7),
                  }}>
                  CONFIRM
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    default:
      return;
  }
};

const SignInScreen = ({navigation, onPress}) => {
  const [username, setUsername] = useState('moogii67890@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const signIn = async () => {
    try {
      setLoading(true);
      let response = await Auth.signIn(username, password);

      navigation.replace('Tabs');
      console.log('✅ Sign In Success');
      setLoading(false);
      setUsername('');
      setPassword('');
      onPress(0);
    } catch (error) {
      showMessage({
        message: `${error.message}`,
        description: 'Check your email and password',
        type: 'warning',
      });
      setLoading(false);
      console.log('❌ Error signing in...', error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={{
          width: wp(75.5),
          height: hp(30),
          backgroundColor: '#00032590',
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'space-evenly',

          paddingVertical: hp(2),
        }}>
        <FormInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          keyboardType="email-address"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <FormInput
          autoCorrect={false}
          placeholder="Password"
          keyboardType="email-address"
          value={password}
          onChangeText={text => setPassword(text)}
          textContentType="password"
          secureTextEntry
        />
        <TouchableOpacity disabled={loading} onPress={signIn}>
          <ImageBackground
            source={images.button}
            style={{
              width: wp(50),
              height: hp(5.29),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!loading ? (
              <Text
                style={{
                  fontFamily: FONTS.brandFont,
                  color: COLORS.white,
                  paddingTop: hp(0.6),
                  margin: hp(1),
                  fontSize: RFPercentage(1.7),
                }}>
                SIGN IN
              </Text>
            ) : (
              <ActivityIndicator size="small" color={'#fff'} />
            )}
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress(4)}>
          <Text
            style={{
              fontFamily: FONTS.brandFont,
              color: COLORS.white,
              paddingTop: hp(0.6),
              margin: hp(1),
              fontSize: RFPercentage(1.7),
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default function AuthScreen() {
  const [whichScreen, setWhichScreen] = useState(0);

  function BackButton() {
    if (whichScreen !== 0) {
      setWhichScreen(0);
    }
  }
  //SignIn Home screen
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={images.backgroundImage}
        style={styles.backgroundImage}>
        <FlashMessage position="top" />
        <SafeAreaView style={{flex: 1}}>
          <StatusBar barStyle="light-content" />
          {whichScreen ? (
            <TouchableOpacity
              style={{position: 'absolute', zIndex: 2}}
              onPress={() => BackButton()}>
              <Image
                source={icons.signBackBtn}
                style={{
                  width: wp(14),
                  height: hp(5.4),
                  marginTop: hp(7),
                  // borderColor: 'red',
                  // borderWidth: 1,
                  marginLeft: -wp(5),
                }}
              />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              alignItems: 'center',
            }}>
            <View style={{flex: 3}}>
              <Image
                source={images.banner}
                style={{
                  resizeMode: 'contain',
                  width: wp(74.66),
                  height: hp(36.08),
                  marginTop: hp(8),
                  justifyContent: 'flex-start',
                }}
              />
            </View>
            <SwitchView
              value={whichScreen}
              onPress={val => setWhichScreen(val)}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
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
    fontFamily: FONTS.brandFont,
    color: COLORS.white,
  },
  input: {
    height: hp(4),
    width: wp(55.2),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.5),
    padding: 0,
  },
  text: {
    fontFamily: FONTS.brandFont,
    color: COLORS.greyText,
    fontSize: RFPercentage(1.7),
    textAlign: 'center',
    width: wp(50),
  },
});
