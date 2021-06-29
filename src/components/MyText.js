import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {COLORS} from '../constants';
import {FONTS, hp, wp} from '../constants/theme';

export default function MyText() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      // behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
      style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          multiline
          numberOfLines={4}
          maxLength={150}
          autoCorrect={false}
          // onChangeText={val => setleagueDescription(val)}
          // value={formState.name}
          style={styles.input}
          // onChangeText={onChangeNumber}
          // value={number}
          placeholder="Enter description"
          placeholderTextColor={COLORS.purpleText}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
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
});
