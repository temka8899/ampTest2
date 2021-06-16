import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {AuthContext} from '../../App';
import {Avatars} from '../data/Avatars';
import {COLORS} from '../constants';
import {FONTS, hp, wp} from '../constants/theme';

import Modal from 'react-native-modal';
import {listPlayers} from '../graphql/queries';
import {updatePlayer} from '../graphql/mutations';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {RFPercentage} from 'react-native-responsive-fontsize';

const Avatar = ({item, onPress, backgroundColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.avatars, backgroundColor]}>
    <Image source={item.image} style={{width: wp(14), height: wp(14)}} />
  </TouchableOpacity>
);

export default function EditProfileScreen({navigation}) {
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [newName, setNewName] = useState();
  const [newImage, setNewImage] = useState();
  const [AvatarModal, setAvatarModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setImage();
  });
  const setImage = () => {
    setNewImage(userInfo.avatar);
  };
  const press = item => {
    setSelectedId(item.id);
    setSelectedItem(item.image);
  };

  const avatarsRender = ({item}) => {
    const backgroundColor =
      item.id === selectedId ? COLORS.brand : COLORS.background;

    return (
      <Avatar
        item={item}
        onPress={() => press(item)}
        backgroundColor={{backgroundColor}}
      />
    );
  };
  const setAvatar = () => {
    setNewImage(selectedItem);
    setAvatarModal(false);
  };
  async function updateProfile() {
    const user = await Auth.currentUserInfo();
    try {
      const temp = await API.graphql(
        graphqlOperation(updatePlayer, {
          input: {
            id: userInfo.id,
            avatar: newImage,
            name: newName,
          },
        }),
      );
      console.log('League updated', temp);
    } catch (err) {
      console.log('error updating League: ', err);
    }
    findUser(user);
    navigation.pop();
  }
  const findUser = React.useCallback(
    async user => {
      const playerData = await API.graphql(graphqlOperation(listPlayers));
      let finded = playerData.data.listPlayers.items.find((item, index) => {
        if (user.username === item.c_id) {
          return item;
        }
      });
      setUserInfo(finded);
      console.log('context player model data', finded);
    },
    [setUserInfo],
  );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headButtonContainer}
          onPress={() => navigation.pop()}>
          <Text style={[{color: COLORS.background}, styles.headButton]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.firstMain}>
        <View style={styles.firstMainSub}>
          <Image source={newImage} style={styles.image} />
        </View>
        <View>
          <Text
            style={{
              color: COLORS.greyText,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.5),
              marginBottom: hp(1),
              marginTop: hp(2),
            }}>
            New name
          </Text>
          <TextInput
            style={styles.input}
            placeholder={userInfo.name}
            maxLength={10}
            onChangeText={text => setNewName(text)}
            placeholderTextColor={COLORS.purpleText}
          />
          <View
            style={{
              height: hp(0.3),
              width: wp(80),
              backgroundColor: COLORS.purpleText,
            }}
          />
        </View>
      </View>
      <View style={styles.buttonMain}>
        <View style={styles.buttonSub}>
          <TouchableOpacity
            onPress={() => setAvatarModal(true)}
            style={[
              {
                borderColor: COLORS.brand,
              },
              styles.button,
            ]}>
            <Text style={[{color: COLORS.brand}, styles.headButton]}>
              Change avatar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateProfile()}
            style={[{backgroundColor: COLORS.brand}, styles.button]}>
            <Text style={[{}, styles.headButton]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationIn="rubberBand"
        isVisible={AvatarModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: RFPercentage(1.8),
              marginTop: hp(3),
              marginBottom: hp(2),
            }}>
            Choose your avatar
          </Text>
          <FlatList
            data={Avatars}
            renderItem={avatarsRender}
            keyExtractor={item => item.id}
            extraData={selectedId}
            numColumns={4}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={() => setAvatar()}
            style={styles.modalButton}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.brandFont,
                fontSize: RFPercentage(1.8),
              }}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: hp(2),
  },
  firstMain: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  firstMainSub: {
    height: hp(25),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: hp(6),
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headButton: {
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.8),
  },
  headButtonContainer: {
    backgroundColor: COLORS.brand,
    height: hp(4),
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: hp(4),
    width: wp(80),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.8),
    padding: 0,
  },
  button: {
    width: wp(80),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.brand,
  },
  buttonMain: {
    flexDirection: 'column',
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonSub: {
    height: hp(12),
    justifyContent: 'space-between',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.brand,
    borderWidth: 2,
    width: wp(80),
    height: hp(57),
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.brand,
    width: wp(30),
    height: hp(4),
    marginBottom: hp(2),
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp(40),
    height: hp(20),
    resizeMode: 'contain',
  },
  avatars: {
    width: wp(16),
    height: wp(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
    marginVertical: wp(1),
  },
});
