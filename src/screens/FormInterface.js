import React, {useEffect, useRef, useState} from 'react';

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {COLORS, FONTS, wp} from '../constants/theme';
import {icons} from '../constants';
import Modal from 'react-native-modal';
import {EndModalForm} from '../components/EndModalForm';

import {
  updateLeague,
  updateSchedule,
  updateTeam,
  createSchedule,
} from '../graphql/mutations';

import moment from 'moment';

import {
  listLeagues,
  listPlayers,
  listTeamPlayers,
  listTeams,
  listSchedules,
} from '../graphql/queries';

import LottieView from 'lottie-react-native';

import Auth from '@aws-amplify/auth';
import {AuthContext} from '../../App';
import * as Animatable from 'react-native-animatable';
import API, {graphqlOperation} from '@aws-amplify/api';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LoadingModal} from '../components/LoadingModal';

const tempData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const tempData2 = ['+1', '+2', '+3', 'OK'];
const tempData3 = ['clear', 'back'];

const ScoreButton = ({item, onPress, select}) => {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        disabled={select === '' ? true : false}
        style={[styles.animButton, {backgroundColor: COLORS.brand}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};
function ScoreButton2({item, onPress}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
function ScoreButton3({item, onPress}) {
  const pulseAnimRef = useRef();

  return (
    <Animatable.View ref={pulseAnimRef}>
      <TouchableOpacity
        style={[styles.animButton, {backgroundColor: '#F74C11'}]}
        onPress={onPress}
        onPressIn={() => {
          pulseAnimRef.current.pulse(800);
        }}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
// let initLoad;
export default function FormInterface({navigation, route}) {
  const [CancelModalVisible, setCancelModalVisible] = useState(false);
  const [EndModalVisible, setEndModalVisible] = useState(false);
  const [select, setSelect] = useState('');
  // onoo
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  //gol data shcedule
  const [MatchData, setMatchData] = useState();
  // bagiin id
  const [HomeID, setHomeID] = useState();
  const [AwayID, setAwayID] = useState();
  const [HomeAvatars, setHomeAvatars] = useState();
  const [AwayAvatars, setAwayAvatars] = useState();
  const [imgLoad, setImgLoad] = useState(true);
  const [HomeName, setHomeName] = useState();
  const [AwayName, setAwayName] = useState();
  const [loading, setLoading] = useState(false);
  const [itsme, setMe] = useState();
  const [readyEnd, setReadyEnd] = useState(false);
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [initLoad, setinitLoad] = useState(true);

  useEffect(() => {
    const ScheduleData = route.params.match;
    setPlaying(ScheduleData.id, true);
    setMatchData(ScheduleData);
    getPlayerData(ScheduleData);
    setinitLoad(false);
  }, [getPlayerData, route.params.match]);
  const setPlaying = async (id, bool) => {
    try {
      await API.graphql(
        graphqlOperation(updateSchedule, {
          input: {
            //Schedule id
            id: id,
            isPlaying: bool,
          },
        }),
      );
      console.log('Schedule Updated');
    } catch (err) {
      console.log('error fetching Schedule Updated', err);
    }
  };
  const toggleCancelModal = bool => {
    setCancelModalVisible(bool);
  };
  const getPlayerData = React.useCallback(
    item => {
      console.log('item', item);
      if (item !== null) {
        setImgLoad(false);
      }
      let homePlayersID1 = item.homePlayers.split('[');
      let homePlayersID2 = homePlayersID1[1].split(']');
      let homePlayersID = homePlayersID2[0].split(', ');
      let awayPlayersID1 = item.awayPlayers.split('[');
      let awayPlayersID2 = awayPlayersID1[1].split(']');
      let awayPlayersID = awayPlayersID2[0].split(', ');
      setHomeID(homePlayersID);
      setAwayID(awayPlayersID);
      let homeImages1 = item.homeImage.split('[');
      let homeImages2 = homeImages1[1].split(']');
      let homeImages = homeImages2[0].split(', ');
      let awayImages1 = item.awayImage.split('[');
      let awayImages2 = awayImages1[1].split(']');
      let awayImages = awayImages2[0].split(', ');
      setHomeAvatars(homeImages);
      setAwayAvatars(awayImages);
      setHomeName(item.home.name);
      setAwayName(item.away.name);

      var inhome = homePlayersID.filter(element => element === userInfo.id);
      if (inhome.length === 0) {
        setMe('away');
      } else {
        setMe('home');
      }
    },
    [userInfo.id],
  );

  // async function fetchTeamPlayers(id) {
  //   try {
  //     const leagueData = await API.graphql(
  //       graphqlOperation(listTeamPlayers, {
  //         filter: {teamID: {eq: `${id}`}},
  //       }),
  //     );
  //     const todos = leagueData.data.listTeamPlayers.items;
  //     console.log('TeamPlayers>>>>>>>>>>>>>>', todos);
  //     return todos;
  //   } catch (err) {
  //     console.log('error fetching todos', err);
  //   }
  // }

  const endMatchButton = () => {
    if (homeScore != awayScore) {
      setEndModalVisible(true);
    }
  };

  const cancelMatch = () => {
    toggleCancelModal(false);
    setPlaying(MatchData.id, false);
    navigation.pop();
  };
  function CancelModal() {
    return (
      <View>
        <Modal
          animationIn="rubberBand"
          isVisible={CancelModalVisible}
          onBackdropPress={() => toggleCancelModal(false)}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalStyle}>
            <View
              style={{
                height: wp(25),
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={() => cancelMatch()}>
                <Text style={styles.modalBtnText}>End Match</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnContainer}
                onPress={() => toggleCancelModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const HomeScorePlaceholder = () => {
    if (homeScore.toString().length === 3) {
      return null;
    } else if (homeScore.toString().length === 2) {
      return '0';
    } else {
      return '00';
    }
  };

  const AwayScorePlaceholder = () => {
    if (awayScore.toString().length === 3) {
      return null;
    } else if (awayScore.toString().length === 2) {
      return '0';
    } else {
      return '00';
    }
  };
  const addNumber = item => {
    if (select === 'home') {
      if (homeScore.toString().length <= 2) {
        if (homeScore === 0) {
          setHomeScore(item);
        } else {
          let temp = homeScore.toString() + item;
          setHomeScore(temp);
        }
      }
    } else {
      if (awayScore.toString().length <= 2) {
        if (awayScore === 0) {
          setAwayScore(item);
        } else {
          let temp = awayScore.toString() + item;
          setAwayScore(temp);
        }
      }
    }
  };

  const clearBack = item => {
    if (select === 'home') {
      if (item === 'clear') {
        setHomeScore(0);
      } else {
        if (homeScore.toString().length === 1) {
          setHomeScore(0);
        } else {
          let temp = homeScore
            .toString()
            .substring(0, homeScore.toString().length - 1);
          setHomeScore(temp);
        }
      }
    } else {
      if (item === 'clear') {
        setAwayScore(0);
      } else {
        if (awayScore.toString().length === 1) {
          setAwayScore(0);
        } else {
          let temp = awayScore
            .toString()
            .substring(0, awayScore.toString().length - 1);
          setAwayScore(temp);
        }
      }
    }
  };
  const doublePlus = item => {
    if (select === 'home') {
      if (item !== 'OK') {
        let sub = item.substring(1, item.toString().length);
        let temp = parseInt(homeScore) + parseInt(sub);
        if (temp > 999) {
          setHomeScore(homeScore);
        } else {
          setHomeScore(temp);
        }
      } else {
        setHomeScore(homeScore);
        setReadyEnd(true);
        setSelect('');
      }
    } else {
      if (item !== 'OK') {
        let sub = item.substring(1, item.toString().length);
        let temp = parseInt(awayScore) + parseInt(sub);
        if (temp > 999) {
          setAwayScore(awayScore);
        } else {
          setAwayScore(temp);
        }
      } else {
        setAwayScore(awayScore);
        setReadyEnd(true);

        setSelect('');
      }
    }
  };
  const toggleEndModal = bool => {
    setEndModalVisible(bool);
  };
  const cancelBtnPress = () => {
    toggleEndModal(false);
  };
  const EndBtnPress = async () => {
    setLoading(true);
    await UpdateSchedule();
    const user = await Auth.currentUserInfo();
    findUser(user);
    toggleEndModal(false);
    setLoading(false);
    navigation.pop();
  };
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

  async function UpdateSchedule() {
    await _updateSchedule();

    if (homeScore > awayScore) {
      //toglogch yalahad bagiin win-lose update
      _updateHome1();
      _updateAway1();
    } else {
      //toglogch yalagdahad bagiin win-lose update
      _updateHome2();
      _updateAway2();
    }

    //Check game 3
    await _checkGame3();

    //League iin current index update
    _updateLeague();
  }

  async function _checkGame3() {
    //Playoff
    if (MatchData.playOffIndex > 0) {
      const _scheduleData1 = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            homePlayers: {eq: MatchData.homePlayers},
            awayPlayers: {eq: MatchData.awayPlayers},
            playOffIndex: {gt: 0},
          },
        }),
      );
      const _schedule1 = _scheduleData1.data.listSchedules.items;
      console.log('Playoff schedule', _schedule1);
      if (
        _schedule1.length < 3 &&
        _schedule1[0].homeScore > _schedule1[0].awayScore &&
        _schedule1[1].homeScore < _schedule1[1].awayScore
      ) {
        console.log('check1');
        _currentScheduleAdd();
        _addSchedule(
          MatchData.home.id,
          MatchData.away.id,
          MatchData.date,
          MatchData.leagueID,
          0,
          3,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          0,
          MatchData.gameID,
        );
      } else if (
        _schedule1.length < 3 &&
        _schedule1[0].homeScore < _schedule1[0].awayScore &&
        _schedule1[1].homeScore > _schedule1[1].awayScore
      ) {
        console.log('check2', MatchData);
        _currentScheduleAdd();
        _addSchedule(
          MatchData.home.id,
          MatchData.away.id,
          MatchData.date,
          MatchData.leagueID,
          0,
          3,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          0,
          MatchData.gameID,
        );
      }
    }

    //Finals
    if (MatchData.finalsIndex > 0) {
      const _scheduleData2 = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            homePlayers: {eq: MatchData.homePlayers},
            awayPlayers: {eq: MatchData.awayPlayers},
            finalsIndex: {gt: 0},
          },
        }),
      );
      const _schedule2 = _scheduleData2.data.listSchedules.items;
      console.log('Finals schedule', _schedule2);
      if (
        _schedule2.length < 3 &&
        _schedule2[0].homeScore > _schedule2[0].awayScore &&
        _schedule2[1].homeScore < _schedule2[1].awayScore
      ) {
        console.log('check3');
        _currentScheduleAdd();
        _addSchedule(
          MatchData.home.id,
          MatchData.away.id,
          MatchData.date,
          MatchData.leagueID,
          0,
          3,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          0,
          MatchData.gameID,
        );
      } else if (
        _schedule2.length < 3 &&
        _schedule2[0].homeScore < _schedule2[0].awayScore &&
        _schedule2[1].homeScore > _schedule2[1].awayScore
      ) {
        console.log('check4', MatchData);
        _currentScheduleAdd();
        _addSchedule(
          MatchData.home.id,
          MatchData.away.id,
          MatchData.date,
          MatchData.leagueID,
          0,
          3,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          0,
          MatchData.gameID,
        );
      }
    }
  }

  async function _updateLeague() {
    const updateLeagueID = MatchData.leagueID;

    //
    //Getting League current Schedule
    //
    const leagueData = await API.graphql(
      graphqlOperation(await listLeagues, {
        filter: {
          id: {eq: updateLeagueID},
        },
      }),
    );
    let updateCurrentSchedule =
      leagueData.data.listLeagues.items[0].currentSchedule;

    //
    //Updating League current schedule
    //
    const _updatedLeague = await API.graphql(
      graphqlOperation(await updateLeague, {
        input: {
          id: updateLeagueID,
          currentSchedule: updateCurrentSchedule + 1,
        },
      }),
    );
    console.log('Updated league', _updatedLeague.data.updateLeague);

    //Check Playoff
    if (
      _updatedLeague.data.updateLeague.currentSchedule ==
        _updatedLeague.data.updateLeague.maxSchedule &&
      _updatedLeague.data.updateLeague.isPlayoff == false
    ) {
      // IsPlayoff = true
      await API.graphql(
        graphqlOperation(updateLeague, {
          input: {
            id: updateLeagueID,
            isPlayoff: true,
          },
        }),
      );
      const leagueData = await API.graphql(
        graphqlOperation(listTeams, {
          filter: {leagueID: {eq: updateLeagueID}},
        }),
      );
      startPlayoff(leagueData, _updatedLeague.data.updateLeague.game.id);
    } else if (
      _updatedLeague.data.updateLeague.currentSchedule ==
        _updatedLeague.data.updateLeague.maxSchedule &&
      _updatedLeague.data.updateLeague.isPlayoff == true
    ) {
      startFinals();
    } else {
      console.log('Season not ended');
    }
  }

  async function startPlayoff(leagueData, _playoffGameID) {
    const _leagueID = MatchData.leagueID;
    try {
      console.log('Season Ended');
      const teams = leagueData.data.listTeams.items
        .sort((a, b) => a.win / (a.lose + a.win) - b.win / (b.lose + b.win))
        .reverse();
      const sorted = [];
      for (var i = 0; i < 4; i++) {
        sorted.push(teams[i]);
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${teams[i].id}`,
              leagueStatus: `Playoff${i + 1}`,
            },
          }),
        );
      }
      if (teams.length > 4) {
        for (var i = 4; teams.length; i++) {
          API.graphql(
            graphqlOperation(updateTeam, {
              input: {
                id: `${teams[i].id}`,
                leagueStatus: 'Ended',
              },
            }),
          );
        }
      }
      const _teamPlayerData1 = await API.graphql(
        graphqlOperation(await listTeamPlayers, {
          filter: {
            teamID: {eq: `${sorted[0].id}`},
          },
        }),
      );
      const player1 = _teamPlayerData1.data.listTeamPlayers.items;
      const _teamAvatar1 = [];
      const _teamID1 = [];
      _teamAvatar1.push(player1[0].player.avatar);
      _teamAvatar1.push(player1[1].player.avatar);
      _teamID1.push(player1[0].player.id);
      _teamID1.push(player1[1].player.id);

      const _teamPlayerData2 = await API.graphql(
        graphqlOperation(await listTeamPlayers, {
          filter: {
            teamID: {eq: `${sorted[1].id}`},
          },
        }),
      );
      const player2 = _teamPlayerData2.data.listTeamPlayers.items;
      const _teamAvatar2 = [];
      const _teamID2 = [];
      _teamAvatar2.push(player2[0].player.avatar);
      _teamAvatar2.push(player2[1].player.avatar);
      _teamID2.push(player2[0].player.id);
      _teamID2.push(player2[1].player.id);

      const _teamPlayerData3 = await API.graphql(
        graphqlOperation(await listTeamPlayers, {
          filter: {
            teamID: {eq: `${sorted[2].id}`},
          },
        }),
      );
      const player3 = _teamPlayerData3.data.listTeamPlayers.items;
      const _teamAvatar3 = [];
      const _teamID3 = [];
      _teamAvatar3.push(player3[0].player.avatar);
      _teamAvatar3.push(player3[1].player.avatar);
      _teamID3.push(player3[0].player.id);
      _teamID3.push(player3[1].player.id);

      const _teamPlayerData4 = await API.graphql(
        graphqlOperation(await listTeamPlayers, {
          filter: {
            teamID: {eq: `${sorted[3].id}`},
          },
        }),
      );
      const player4 = _teamPlayerData4.data.listTeamPlayers.items;
      const _teamAvatar4 = [];
      const _teamID4 = [];
      _teamAvatar4.push(player4[0].player.avatar);
      _teamAvatar4.push(player4[1].player.avatar);
      _teamID4.push(player4[0].player.id);
      _teamID4.push(player4[1].player.id);

      const _teamsTemp = await API.graphql(
        graphqlOperation(await listSchedules, {
          filter: {
            leagueID: {eq: sorted[0].leagueID},
          },
        }),
      );
      const _team = await _teamsTemp.data.listSchedules.items.sort(
        (a, b) => b.index - a.index,
      );
      const _dateTemp = _team[0].date;
      var playoffDate = await moment(_dateTemp).add(1, 'd').format('MM/D/YY');
      var playoffDate2 = await moment(playoffDate).format('dddd');
      if (playoffDate2 == 'Saturday') {
        playoffDate = await moment(playoffDate).add(2, 'd').format('MM/D/YY');
      }

      _addSchedule(
        sorted[1].id,
        sorted[2].id,
        playoffDate,
        _leagueID,
        0,
        1,
        _teamAvatar2,
        _teamID2,
        _teamAvatar3,
        _teamID3,

        0,
        _playoffGameID,
      );
      _addSchedule(
        sorted[1].id,
        sorted[2].id,
        playoffDate,
        _leagueID,
        0,
        2,
        _teamAvatar2,
        _teamID2,
        _teamAvatar3,
        _teamID3,
        0,
        _playoffGameID,
      );

      playoffDate = await moment(_dateTemp).add(2, 'd').format('MM/D/YY');
      playoffDate2 = await moment(playoffDate).format('dddd');
      if (playoffDate2 == 'Saturday') {
        playoffDate = await moment(playoffDate).add(2, 'd').format('MM/D/YY');
      }
      _addSchedule(
        sorted[0].id,
        sorted[3].id,
        playoffDate,
        _leagueID,
        0,
        4,
        _teamAvatar1,
        _teamID1,
        _teamAvatar4,
        _teamID4,
        0,
        _playoffGameID,
      );
      _addSchedule(
        sorted[0].id,
        sorted[3].id,
        playoffDate,
        _leagueID,
        0,
        5,
        _teamAvatar1,
        _teamID1,
        _teamAvatar4,
        _teamID4,
        0,
        _playoffGameID,
      );
      await API.graphql(
        graphqlOperation(updateLeague, {
          input: {
            id: _leagueID,
            maxSchedule: 4,
            currentSchedule: 0,
          },
        }),
      );
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function _currentScheduleAdd() {
    const updateLeagueID = MatchData.leagueID;
    //
    //Getting League current Schedule
    //
    const leagueData = await API.graphql(
      graphqlOperation(await listLeagues, {
        filter: {
          id: {eq: updateLeagueID},
        },
      }),
    );
    let updateCurrentSchedule =
      leagueData.data.listLeagues.items[0].currentSchedule;
    let updateMaxSchedule = leagueData.data.listLeagues.items[0].maxSchedule;
    //
    //Updating League current schedule
    //
    const _updatedLeague = await API.graphql(
      graphqlOperation(await updateLeague, {
        input: {
          id: updateLeagueID,
          currentSchedule: updateCurrentSchedule + 1,
          maxSchedule: updateMaxSchedule + 1,
        },
      }),
    );
    console.log('Current schedule added', _updatedLeague.data.updateLeague);
  }

  async function startFinals() {
    console.log('PlayOffEnded');
    try {
      const _scheduleData1 = await API.graphql(
        graphqlOperation(listSchedules, {
          filter: {
            leagueID: {eq: MatchData.leagueID},
            playOffIndex: {gt: 0},
          },
        }),
      );
      const _schedule1 = _scheduleData1.data.listSchedules.items;
      // console.log('Playoff schedule2', _schedule1);
      var final1 = [];
      var final2 = [];
      for (var i = 0; i < _schedule1.length; i++) {
        if (
          _schedule1[i].away.leagueStatus == 'Playoff4' ||
          _schedule1[i].away.leagueStatus == 'Playoff1'
        ) {
          final1.push(_schedule1[i]);
        } else if (
          _schedule1[i].away.leagueStatus == 'Playoff3' ||
          _schedule1[i].away.leagueStatus == 'Playoff2'
        ) {
          final2.push(_schedule1[i]);
        }
      }

      var homeWin1 = 0;
      var awayWin1 = 0;
      var homeWin2 = 0;
      var awayWin2 = 0;
      for (var i = 0; i < final1.length; i++) {
        if (final1[i].homeScore > final1[i].awayScore) {
          homeWin1++;
        } else if (final1[i].awayScore > final1[i].homeScore) {
          awayWin1++;
        }
      }
      for (var i = 0; i < final2.length; i++) {
        if (final2[i].homeScore > final2[i].awayScore) {
          homeWin2++;
        } else if (final2[i].awayScore > final2[i].homeScore) {
          awayWin2++;
        }
      }

      const _teamsTemp = await API.graphql(
        graphqlOperation(await listSchedules, {
          filter: {
            leagueID: {eq: final1[0].leagueID},
            playOffIndex: {gt: 0},
          },
        }),
      );
      const _team = await _teamsTemp.data.listSchedules.items.sort(
        (a, b) => b.playOffIndex - a.playOffIndex,
      );
      console.log('>>>>>>>>', _team);
      const _dateTemp = _team[0].date;
      var playoffDate = await moment(_dateTemp).add(1, 'd').format('MM/D/YY');
      var playoffDate2 = await moment(playoffDate).format('dddd');
      if (playoffDate2 == 'Saturday') {
        playoffDate = await moment(playoffDate).add(2, 'd').format('MM/D/YY');
      }
      // console.log(`Final1 ${homeWin1}-${awayWin1}`);
      // console.log(`Final2 ${homeWin2}-${awayWin2}`);
      if (homeWin1 > awayWin1 && homeWin2 > awayWin2) {
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final1[0].home.id}`,
              finalStatus: `final1`,
            },
          }),
        );
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final2[0].home.id}`,
              finalStatus: `final2`,
            },
          }),
        );
        _addSchedule(
          final1[0].home.id,
          final2[0].home.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].homeImage,
          final1[0].homePlayers,
          final2[0].homeImage,
          final2[0].homePlayers,
          1,
          final1[0].gameID,
        );
        _addSchedule(
          final1[0].home.id,
          final2[0].home.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].homeImage,
          final1[0].homePlayers,
          final2[0].homeImage,
          final2[0].homePlayers,
          2,
          final1[0].gameID,
        );
      } else if (homeWin1 < awayWin1 && homeWin2 > awayWin2) {
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final1[0].away.id}`,
              finalStatus: `final1`,
            },
          }),
        );
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final2[0].home.id}`,
              finalStatus: `final2`,
            },
          }),
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].home.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].homeImage,
          final2[0].homePlayers,
          1,
          final1[0].gameID,
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].home.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].homeImage,
          final2[0].homePlayers,
          2,
          final1[0].gameID,
        );
      } else if (homeWin1 < awayWin1 && homeWin2 < awayWin2) {
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final1[0].away.id}`,
              finalStatus: `final1`,
            },
          }),
        );
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final2[0].away.id}`,
              finalStatus: `final2`,
            },
          }),
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].away.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].awayImage,
          final2[0].awayPlayers,
          1,
          final1[0].gameID,
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].away.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].awayImage,
          final2[0].awayPlayers,
          2,
          final1[0].gameID,
        );
      } else if (homeWin1 > awayWin1 && homeWin2 < awayWin2) {
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final1[0].home.id}`,
              finalStatus: `final1`,
            },
          }),
        );
        API.graphql(
          graphqlOperation(updateTeam, {
            input: {
              id: `${final2[0].away.id}`,
              finalStatus: `final2`,
            },
          }),
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].away.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].awayImage,
          final2[0].awayPlayers,
          1,
          final1[0].gameID,
        );
        _addSchedule(
          final1[0].away.id,
          final2[0].away.id,
          playoffDate,
          final1[0].leagueID,
          0,
          0,
          final1[0].awayImage,
          final1[0].awayPlayers,
          final2[0].awayImage,
          final2[0].awayPlayers,
          2,
          final1[0].gameID,
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function _updateSchedule() {
    await API.graphql(
      graphqlOperation(updateSchedule, {
        input: {
          //Schedule id
          id: MatchData.id,
          homeScore: `${homeScore}`,
          awayScore: `${awayScore}`,
        },
      }),
    );
  }

  async function _updateHome1() {
    //getting Team home win-lose data to update
    const teamData = await API.graphql(
      graphqlOperation(listTeams, {
        filter: {
          //Team id
          id: {eq: `${MatchData.home.id}`},
        },
      }),
    );
    const win = teamData.data.listTeams.items[0].win;
    const lose = teamData.data.listTeams.items[0].lose;

    // Updating Team home win-lose datas
    API.graphql(
      graphqlOperation(updateTeam, {
        input: {
          //Team id
          id: `${MatchData.home.id}`,
          win: `${win + 1}`,
          lose: `${lose}`,
        },
      }),
    );
  }

  async function _updateAway1() {
    //getting Team away win-lose data to update
    const teamData1 = await API.graphql(
      graphqlOperation(listTeams, {
        filter: {
          //Team id
          id: {eq: `${MatchData.away.id}`},
        },
      }),
    );
    const win1 = teamData1.data.listTeams.items[0].win;
    const lose1 = teamData1.data.listTeams.items[0].lose;

    // Updating Team away win-lose datas
    API.graphql(
      graphqlOperation(updateTeam, {
        input: {
          //Team id
          id: `${MatchData.away.id}`,
          win: `${win1}`,
          lose: `${lose1 + 1}`,
        },
      }),
    );
  }

  async function _updateHome2() {
    const teamData1 = await API.graphql(
      graphqlOperation(listTeams, {
        filter: {
          //Team id
          id: {eq: `${MatchData.home.id}`},
        },
      }),
    );
    const win1 = teamData1.data.listTeams.items[0].win;
    const lose1 = teamData1.data.listTeams.items[0].lose;

    // Updating Team win-lose datas
    API.graphql(
      graphqlOperation(updateTeam, {
        input: {
          //Team id
          id: `${MatchData.home.id}`,
          win: `${win1}`,
          lose: `${lose1 + 1}`,
        },
      }),
    );
  }

  async function _updateAway2() {
    //getting Team win-lose data to update
    const teamData = await API.graphql(
      graphqlOperation(listTeams, {
        filter: {
          //Team id
          id: {eq: `${MatchData.away.id}`},
        },
      }),
    );
    const win = teamData.data.listTeams.items[0].win;
    const lose = teamData.data.listTeams.items[0].lose;

    // Updating Team win-lose datas
    await API.graphql(
      graphqlOperation(updateTeam, {
        input: {
          //Team id
          id: `${MatchData.away.id}`,
          win: `${win + 1}`,
          lose: `${lose}`,
        },
      }),
    );
  }

  async function _addSchedule(
    team1ID,
    team2ID,
    date,
    startLeagueId,
    tooluur,
    _playoffIndex,
    homeAvatar,
    homeID,
    awayAvatar,
    awayID,
    _finalsIndex,
    _playoffGameID,
  ) {
    try {
      await API.graphql(
        graphqlOperation(createSchedule, {
          input: {
            scheduleHomeId: team1ID,
            scheduleAwayId: team2ID,
            homeScore: 0,
            awayScore: 0,
            date: `${date}`,
            leagueID: startLeagueId,
            index: tooluur,
            playOffIndex: _playoffIndex,
            homeImage: homeAvatar,
            awayImage: awayAvatar,
            homePlayers: homeID,
            awayPlayers: awayID,
            finalsIndex: _finalsIndex,
            gameID: _playoffGameID,
            isPlaying: false,
          },
        }),
      );
    } catch (err) {
      console.log('error creating Schedule:', err);
    }
  }
  const hide = () => {
    if (homeScore === 0 && awayScore === 0) {
      return false;
    } else {
      if (readyEnd) {
        return true;
      } else {
        return false;
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => toggleCancelModal(true)}>
        <Image source={icons.backWhiteBtn} style={styles.backBtn} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: wp(10),
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: itsme === 'home' ? COLORS.brand : COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: wp(4),
              marginBottom: wp(2),
            }}>
            {HomeName}
          </Text>
          {HomeAvatars && (
            <View style={{flexDirection: 'row'}}>
              {HomeAvatars.map(_item => {
                return imgLoad ? (
                  <ActivityIndicator
                    style={styles.avatar}
                    size={'small'}
                    color={COLORS.brand}
                  />
                ) : (
                  <Image source={_item} style={styles.avatar} />
                );
              })}
            </View>
          )}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: itsme === 'away' ? COLORS.brand : COLORS.white,
              fontFamily: FONTS.brandFont,
              fontSize: wp(4),
              marginBottom: wp(2),
            }}>
            {AwayName}
          </Text>
          {AwayAvatars && (
            <View style={{flexDirection: 'row'}}>
              {AwayAvatars.map(_item => {
                return imgLoad ? (
                  <ActivityIndicator
                    style={styles.avatar}
                    size={'small'}
                    color={COLORS.brand}
                  />
                ) : (
                  <Image source={_item} style={styles.avatar} />
                );
              })}
            </View>
          )}
        </View>
      </View>

      <View style={styles.scoreBoardContainer}>
        <View
          style={{
            width: wp(90),
            height: wp(30),
            borderColor: COLORS.count,
            borderWidth: 2,
            backgroundColor: 'black',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(90),
              height: wp(10),
              backgroundColor: COLORS.count,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>HOME</Text>
            </View>
            <View style={styles.homeAway}>
              <Text style={styles.homeAwayText}>AWAY</Text>
            </View>
          </View>
          <View
            style={{
              width: wp(90),
              height: wp(35),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>888</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  {HomeScorePlaceholder()}
                </Text>
                {homeScore}
              </Text>
            </View>
            <View style={styles.pointContainer}>
              <Text style={styles.placeholder}>888</Text>
              <Text
                style={[
                  styles.placeholder,
                  {color: COLORS.brand, position: 'absolute', zIndex: 1},
                ]}>
                <Text
                  style={[
                    styles.placeholder,
                    {color: '#ffffff00', position: 'absolute', zIndex: 1},
                  ]}>
                  {AwayScorePlaceholder()}
                </Text>
                {awayScore}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: wp(10),
        }}>
        <View
          styles={{
            width: wp(38),
            height: wp(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => [setSelect('home'), setReadyEnd(false)]}
            style={[
              styles.selectSide,
              {
                width: select === 'home' ? wp(38) : wp(36),
                height: select === 'home' ? wp(10) : wp(8),
                borderColor: select === 'home' ? COLORS.white : COLORS.count,
              },
            ]}>
            <Text
              style={{
                color: select === 'home' ? COLORS.white : '#ffffff50',
                fontFamily: FONTS.brandFont,
                fontSize: wp(3.5),
              }}>
              HOME
            </Text>
          </TouchableOpacity>
        </View>
        <View
          styles={{
            width: wp(38),
            height: wp(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => [setSelect('away'), setReadyEnd(false)]}
            style={[
              styles.selectSide,
              {
                width: select === 'away' ? wp(38) : wp(36),
                height: select === 'away' ? wp(10) : wp(8),
                borderColor: select === 'away' ? COLORS.white : COLORS.count,
              },
            ]}>
            <Text
              style={{
                color: select === 'away' ? COLORS.white : '#ffffff50',
                fontFamily: FONTS.brandFont,
                fontSize: wp(3.5),
              }}>
              AWAY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: wp(5),
          width: wp(90),
          height: wp(47.5),
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: wp(66),
          }}>
          {tempData.map(item => (
            <ScoreButton
              key={item}
              item={item}
              onPress={() => addNumber(item)}
              select={select}
            />
          ))}

          {tempData3.map(item => (
            <ScoreButton3
              key={item}
              item={item}
              select={select}
              onPress={() => clearBack(item)}
            />
          ))}
        </View>
        <View
          style={{
            width: wp(24),
            height: wp(47.5),
            marginLeft: wp(1),
          }}>
          {tempData2.map(item => (
            <ScoreButton2
              key={item}
              item={item}
              select={select}
              onPress={() => doublePlus(item)}
            />
          ))}
        </View>
        <View
          style={{
            width: wp(90),
            height: wp(47.5),
            backgroundColor: COLORS.background,
            opacity: 0.7,
            zIndex: select === '' ? 2 : -1,
            position: 'absolute',
          }}
        />
      </View>
      <View
        style={{
          flex: 1,

          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.modalBtnContainer}
          onPress={() => endMatchButton()}>
          <Text style={styles.modalBtnText}>End Match</Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: COLORS.background,
            width: wp(50),
            height: wp(9),
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7,
            zIndex: hide() ? -1 : 2,
            position: 'absolute',
          }}
        />
        {CancelModal()}
        {EndModalVisible && (
          <EndModalForm
            isVisible={EndModalVisible}
            onBackdropPress={() => setEndModalVisible(false)}
            HomeScore={homeScore}
            AwayScore={awayScore}
            HomeID={HomeID}
            AwayID={AwayID}
            HomeName={HomeName}
            AwayName={AwayName}
            HomeAvatars={HomeAvatars}
            AwayAvatars={AwayAvatars}
            cancelbtn={cancelBtnPress}
            EndBtn={EndBtnPress}
            loading={loading}
          />
        )}
        <LoadingModal bool={initLoad} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  animButton: {
    width: wp(20),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(1),
    shadowColor: COLORS.brand,
    elevation: 1,
    shadowOffset: {
      width: wp(1),
      height: wp(1),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    marginLeft: wp(1.5),
    marginTop: wp(1.5),
  },
  backBtn: {
    width: wp(9),
    height: wp(9),
    opacity: 0.5,
    marginLeft: wp(5),
    marginTop: wp(3),
  },
  modalBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
  },
  modalBtnContainer: {
    backgroundColor: COLORS.brand,
    width: wp(50),
    height: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectSide: {
    backgroundColor: COLORS.count,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: wp(5),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scoreBoardContainer: {
    marginVertical: wp(15),
    backgroundColor: COLORS.count,
    width: wp(90),
    height: wp(25),
    marginHorizontal: wp(5),

    justifyContent: 'center',
    alignItems: 'center',
  },
  pointContainer: {
    width: wp(35),
    height: wp(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  placeholder: {
    fontFamily: 'CursedTimerULiL',
    color: '#ffffff10',
    fontSize: wp(18),
  },
  avatar: {
    width: wp(13),
    height: wp(13),
  },
  homeAway: {
    width: wp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeAwayText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.tabgrey,
    fontWeight: '900',
    fontSize: wp(4),
  },
  modalStyle: {
    width: wp(70),
    height: wp(40),
    backgroundColor: COLORS.background,
    borderColor: COLORS.brand,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
