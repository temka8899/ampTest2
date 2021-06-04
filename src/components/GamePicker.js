import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {COLORS, FONTS, hp, wp} from '../constants/theme';
import Amplify, {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {listGames, listLeagues} from '../graphql/queries';

const GamePicker = props => {
  const [GameList, setGameList] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    // const user = await Auth.currentUserInfo();
    // console.log('Attributes =======', user);
    try {
      const gameData = await API.graphql(graphqlOperation(listGames));
      const gameList = gameData.data.listGames.items;
      setGameList(gameList);
      console.log('Games>>>>', gameList);
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // const user2 = await Auth.currentAuthenticatedUser();
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', user2);
      // const result = await Auth.updateUserAttributes(user2, {
      //   'custom:IntLevel': `5`,
      //   'custom:Xp': `390`,
      //   'custom:Name': `Mkoogii`,
      //   'custom:Admin': `1`,
      // });
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }
  const option = GameList.map((item, index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item.name)}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  });
  const onPressItem = option => {
    props.changeModalVisible(false);
    props.setData(option);
  };
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisible(false)}
      style={styles.container}>
      <View style={styles.modal}>
        <ScrollView>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modal: {
    width: wp(80),
    backgroundColor: COLORS.brand,
    borderRadius: 10,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    margin: wp(5),
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2),
    color: COLORS.white,
  },
});

export default GamePicker;
