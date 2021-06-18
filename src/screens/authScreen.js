import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  Platform,
  Animated,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

import {icons, images} from '../constants';
import {wp, hp, FONTS, COLORS} from '../constants/theme';
import FormInput from '../components/FormInput';
import RadioButton from '../components/RadioButton';

import awsmobile from '../aws-exports';
import {useNavigation} from '@react-navigation/core';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';

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
  const [name, setSignUpName] = useState('');
  const [phone_number, setPhoneNumber] = useState('+97688888888');
  const [authCode, setConfirmCode] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [gender, setGender] = useState([
    {id: 1, value: true, name: 'Female', selected: false},
    {id: 2, value: false, name: 'Male', selected: false},
  ]);
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

  async function forgotPasswordEmail() {
    try {
      const temp = Auth.forgotPassword(username);
      console.log(username);
      console.log('✅ Email sent', temp);
    } catch (error) {
      console.log(err);
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

  const onRadioBtnClick = item => {
    let updateState = gender.map(genderItem =>
      genderItem.id == item.id
        ? {...genderItem, selected: true}
        : {...genderItem, selected: false},
    );
    setGender(updateState);
  };
  switch (value) {
    case 0:
      return (
        <View style={styles.twoButtonContainer}>
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.signupContainer}>
              <FormInput
                autoCorrect={false}
                max={10}
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
              <View style={styles.radioContainer}>
                {gender.map(item => (
                  <RadioButton
                    onPress={() => onRadioBtnClick(item)}
                    selected={item.selected}
                    value={item.value}
                    key={item.id}>
                    {item.name}
                  </RadioButton>
                ))}
              </View>

              <TouchableOpacity onPress={() => signUp()}>
                <ImageBackground
                  source={images.button}
                  style={styles.signupButton}>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    //Verify email
    case 3:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.confirmCodeContainer}>
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
                  style={styles.smallButton}>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    //Forgot password1
    case 4:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.forgotPassContainer}>
              <FlashMessage position="top" />
              <Text style={styles.text}>Enter your email </Text>

              <FormInput
                autoCorrect={false}
                placeholder="Email"
                onChangeText={text2 => [setSignUpUsername(text2)]}
                keyboardType="email-address"
              />

              <TouchableOpacity onPress={() => [forgotPasswordEmail()]}>
                <ImageBackground
                  source={images.button}
                  style={styles.smallButton}>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    //Forgot password2
    case 5:
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.forgotPassContainer}>
            <FlashMessage position="top" />
            <Text style={styles.text}>Enter your code from email</Text>

            <FormInput
              autoCorrect={false}
              placeholder="Code"
              onChangeText={text2 => setConfirmCode(text2)}
              keyboardType="number-pad"
            />

            <TouchableOpacity onPress={() => onPress(6)}>
              <ImageBackground
                source={images.button}
                style={styles.smallButton}>
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
          <View style={styles.forgotPassContainer}>
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
                style={styles.smallButton}>
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.signInModal, {paddingBottom: hp(4)}]}>
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
            <ImageBackground source={images.button} style={styles.smallButton}>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default function AuthScreen() {
  const [whichScreen, setWhichScreen] = useState(0);
  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');
  const startValue = useRef(new Animated.Value(1)).current;
  const moveValue = useState(new Animated.Value(0))[0];
  const endValue = 0.8;

  const _keyboardDidShow = React.useCallback(() => {
    setKeyboardStatus('Keyboard Shown');
    imgScale();
    imgMove();
  }, [imgMove, imgScale]);

  const _keyboardDidHide = React.useCallback(() => {
    setKeyboardStatus('Keyboard Hidden');
    imgScaleBack();
    imgMoveBack();
  }, [imgMoveBack, imgScaleBack]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [_keyboardDidHide, _keyboardDidShow]);

  const imgScale = React.useCallback(() => {
    Animated.timing(startValue, {
      toValue: endValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [startValue]);

  const imgScaleBack = React.useCallback(() => {
    Animated.timing(startValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [startValue]);

  const imgMove = React.useCallback(() => {
    Animated.timing(moveValue, {
      toValue: -80,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [moveValue]);

  const imgMoveBack = React.useCallback(() => {
    Animated.timing(moveValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [moveValue]);

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
        style={styles.backgroundImg}>
        <FlashMessage position="top" />
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar barStyle="light-content" />
          {whichScreen ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => BackButton()}>
              <Image
                source={icons.signBackBtn}
                style={{
                  width: wp(14),
                  height: hp(5.4),
                  marginTop: hp(7),

                  marginLeft: -wp(5),
                }}
              />
            </TouchableOpacity>
          ) : null}
          <View style={styles.mainSubContainer}>
            <Animated.View style={styles.animatedContainer}>
              <Animated.Image
                source={images.banner}
                style={[
                  {
                    transform: [
                      {
                        scale: startValue,
                      },
                      {
                        translateY: moveValue,
                      },
                    ],
                  },
                  styles.banner,
                ]}
              />
            </Animated.View>
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
  mainContainer: {
    flex: 1,
  },
  mainSubContainer: {
    alignItems: 'center',
  },
  twoButtonContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImg: {
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
  smallButton: {
    width: wp(50),
    height: hp(5.29),
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    marginTop: hp(7),
    resizeMode: 'contain',
    width: wp(64.66),
    height: wp(74.66),
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
  signupContainer: {
    width: wp(75.5),
    height: hp(40),
    backgroundColor: '#00032590',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: hp(2),
    marginBottom: hp(3),
  },
  signupButton: {
    width: wp(50),
    height: hp(5.29),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCodeContainer: {
    width: wp(75.5),
    height: hp(26),
    backgroundColor: '#00032590',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: hp(2),
  },
  animatedContainer: {
    flex: 3,
  },
  text: {
    fontFamily: FONTS.brandFont,
    color: COLORS.greyText,
    fontSize: RFPercentage(1.7),
    textAlign: 'center',
    width: wp(50),
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
  },
  forgotPassContainer: {
    width: wp(75.5),
    height: hp(26),
    backgroundColor: '#00032590',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: hp(2),
    paddingBottom: hp(3),
  },
  signInModal: {
    width: wp(75.5),
    height: hp(30),
    backgroundColor: '#00032590',
    borderRadius: 15,
    alignItems: 'center',

    justifyContent: 'space-evenly',
    paddingVertical: hp(2),
  },
  radioContainer: {
    width: wp(55),
    height: hp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
