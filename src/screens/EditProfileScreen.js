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
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import {AuthContext} from '../../App';
import {Avatars} from '../data/Avatars';
import {COLORS} from '../constants';
import {FONTS, hp, wp} from '../constants/theme';

import Modal from 'react-native-modal';
import {listPlayers, listSchedules, listTeamPlayers} from '../graphql/queries';
import {updatePlayer, updateSchedule} from '../graphql/mutations';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {LoadingModal} from '../components/LoadingModal';

const Avatar = ({item, onPress, backgroundColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.avatars, backgroundColor]}>
    <Image source={item.image} style={{width: wp(14), height: wp(14)}} />
  </TouchableOpacity>
);

let newAvatar;
export default function EditProfileScreen({navigation}) {
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [newName, setNewName] = useState();
  const [newImage, setNewImage] = useState();
  const [AvatarModal, setAvatarModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    setImage();
  }, [setImage]);

  const setImage = React.useCallback(() => {
    setNewImage(userInfo.avatar);
  }, [userInfo.avatar]);

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
    if (selectedItem === null) {
      setNewImage(userInfo.avatar);
    } else {
      setNewImage(selectedItem);
    }
    setAvatarModal(false);
  };
  async function updateProfile() {
    const user = await Auth.currentUserInfo();
    newAvatar = newImage;
    try {
      setBtnLoading(true);
      const temp = await API.graphql(
        graphqlOperation(updatePlayer, {
          input: {
            id: userInfo.id,
            avatar: newImage,
            name: newName,
          },
        }),
      );
    } catch (err) {
      setBtnLoading(false);
      console.log('error updating League: ', err);
    }

    if (newImage !== userInfo.avatar) {
      await changeTeamAvatar();
    }

    await findUser(user);
    setBtnLoading(false);

    navigation.pop();
  }
  const changeTeamAvatar = React.useCallback(async () => {
    try {
      const myTeams = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {
            playerID: {eq: userInfo.id},
          },
        }),
      );
      const todos = myTeams.data.listTeamPlayers.items;
      for (let i = 0; i < todos.length; i++) {
        await getAndChange(todos[0].teamID);
      }
    } catch (err) {
      console.log('error creating myTeams:', err);
    }
  }, []);

  const getAndChange = React.useCallback(async id => {
    try {
      const myAwaySchedules = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            or: [{scheduleAwayId: {eq: id}}, {scheduleHomeId: {eq: id}}],
          },
        }),
      );
      const todos = myAwaySchedules.data.listSchedules.items;

      for (let i = 0; i < todos.length; i++) {
        if (todos[i].scheduleHomeId === id) {
          let homeImages1 = todos[i].homeImage.split('[');
          let homeImages2 = homeImages1[1].split(']');
          let homeImages = homeImages2[0].split(', ');
          const _newHomeImages = [];
          if (homeImages[0] === userInfo.avatar) {
            _newHomeImages.push(newAvatar);
            _newHomeImages.push(homeImages[1]);
          } else {
            _newHomeImages.push(newAvatar);
            _newHomeImages.push(homeImages[0]);
          }
          await updateScheduleHomeImages(todos[i].id, _newHomeImages, true);
        } else {
          let awayImages1 = todos[i].awayImage.split('[');
          let awayImages2 = awayImages1[1].split(']');
          let awayImages = awayImages2[0].split(', ');
          const _newAwayImages = [];
          if (awayImages[0] === userInfo.avatar) {
            _newAwayImages.push(newAvatar);
            _newAwayImages.push(awayImages[1]);
          } else {
            _newAwayImages.push(newAvatar);
            _newAwayImages.push(awayImages[0]);
          }
          await updateScheduleHomeImages(todos[i].id, _newAwayImages, false);
        }
      }
    } catch (err) {
      console.log('error creating mySchedules:', err);
    }
  }, []);

  async function updateScheduleHomeImages(id, images, ishome) {
    try {
      if (ishome) {
        await API.graphql(
          graphqlOperation(updateSchedule, {
            input: {
              //Schedule id
              id: id,
              homeImage: images,
            },
          }),
        );
      } else {
        await API.graphql(
          graphqlOperation(updateSchedule, {
            input: {
              //Schedule id
              id: id,
              awayImage: images,
            },
          }),
        );
      }
      console.log('Schedule iin zurag soliglooo');
    } catch (err) {
      console.log('error fetching updateschedule', err);
    }
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
    },
    [setUserInfo],
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.container}>
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
            <TouchableOpacity
              onPress={() => setAvatarModal(true)}
              style={styles.firstMainSub}>
              <Image source={newImage} style={styles.image} />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(1.5),
                  marginBottom: wp(2),
                  marginTop: wp(4),
                }}>
                New name
              </Text>

              <TextInput
                // editable={true}
                style={styles.input}
                placeholder={userInfo.name}
                maxLength={10}
                onChangeText={text => setNewName(text)}
                placeholderTextColor={COLORS.purpleText}
              />
              <View
                style={{
                  height: wp(0.4),
                  width: wp(80),
                  backgroundColor: COLORS.purpleText,
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

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
              disabled={btnLoading}
              onPress={() => updateProfile()}
              style={[{backgroundColor: COLORS.brand}, styles.button]}>
              {btnLoading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={[{}, styles.headButton]}>Save</Text>
              )}
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
                marginTop: wp(6),
                marginBottom: wp(4),
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
        <LoadingModal bool={btnLoading} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  },
  firstMainSub: {
    height: wp(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: wp(13),
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
    height: wp(9),
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: wp(8),
    width: wp(80),
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(1.8),
    padding: 0,
  },
  image: {
    width: wp(40),
    height: wp(40),
    resizeMode: 'contain',
  },
  button: {
    width: wp(80),
    height: wp(11),
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
    height: wp(26),
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
    height: wp(120),
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.brand,
    width: wp(30),
    height: wp(8),
    marginBottom: wp(4),
    marginTop: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
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
