import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {COLORS, FONTS, icons, images} from '../constants';
import {hp, wp} from '../constants/theme';
import Modal from 'react-native-modal';
import {EndModal} from '../components/EndModal';
import LottieView from 'lottie-react-native';

import {
  updateLeague,
  updateSchedule,
  updateTeamPlayer,
  updateTeam,
  updatePlayer,
  createSchedule,
} from '../graphql/mutations';
import {
  listLeagues,
  listPlayers,
  listSchedules,
  listTeamPlayers,
  listTeams,
} from '../graphql/queries';
import moment from 'moment';
import {AuthContext} from '../../App';
import API, {graphqlOperation} from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import {LoadingModal} from '../components/LoadingModal';

export default function CountScreen({navigation, route}) {
  const [CancelModalVisible, setCancelModalVisible] = useState(false);
  const [EndModalVisible, setEndModalVisible] = useState(false);
  const [findMistake, setfindMistake] = useState(0);
  const [MatchData, setMatchData] = useState();
  const [Home, setHome] = useState();
  const [Away, setAway] = useState();
  const {userInfo, setUserInfo} = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [initLoad, setinitLoad] = useState(true);

  const [allPoint, setAllPoint] = useState({
    one: {
      point: 0,
      name: 'Player 1',
      image: '',
    },
    two: {
      point: 0,
      name: 'Player 2',
      image: '',
    },
    three: {
      point: 0,
      name: 'Player 3',
      image: '',
    },
    four: {
      point: 0,
      name: 'Player 4',
      image: '',
    },
  });
  const [OneName, setOneName] = useState();
  const [TwoName, setTwoName] = useState();
  const [ThreeName, setThreeName] = useState();
  const [FourName, setFourName] = useState();

  const [OneImage, setOneImage] = useState();
  const [TwoImage, setTwoImage] = useState();
  const [ThreeImage, setThreeImage] = useState();
  const [FourImage, setFourImage] = useState();

  useEffect(() => {
    const ScheduleData = route.params.match;
    setPlaying(ScheduleData.id, true);
    setMatchData(ScheduleData);
    console.log(ScheduleData);
    getPlayerData(ScheduleData);
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
      console.log('set playing');
    } catch (err) {
      console.log('error fetching Schedule Updated', err);
    }
  };
  const getPlayerData = React.useCallback(async item => {
    let homePlayers = await fetchTeamPlayers(item.home.id);
    let awayPlayers = await fetchTeamPlayers(item.away.id);
    setHome(homePlayers);
    setAway(awayPlayers);
    initMatch(homePlayers, awayPlayers);
    setinitLoad(false);
  }, []);

  const initMatch = (homePlayers, awayPlayers) => {
    setAllPoint(prev => ({
      ...prev,
      one: {
        point: 0,
        name: `${homePlayers[0].player.name}`,
        image: `${homePlayers[0].player.avatar}`,
      },
      two: {
        point: 0,
        name: `${homePlayers[1].player.name}`,
        image: `${homePlayers[1].player.avatar}`,
      },
      three: {
        point: 0,
        name: `${awayPlayers[0].player.name}`,
        image: `${awayPlayers[0].player.avatar}`,
      },
      four: {
        point: 0,
        name: `${awayPlayers[1].player.name}`,
        image: `${awayPlayers[1].player.avatar}`,
      },
    }));
    setOneName(`${homePlayers[0].player.name}`);
    setTwoName(`${homePlayers[1].player.name}`);
    setThreeName(`${awayPlayers[0].player.name}`);
    setFourName(`${awayPlayers[1].player.name}`);
    setOneImage(`${homePlayers[0].player.avatar}`);
    setTwoImage(`${homePlayers[1].player.avatar}`);
    setThreeImage(`${awayPlayers[0].player.avatar}`);
    setFourImage(`${awayPlayers[1].player.avatar}`);
  };

  async function fetchTeamPlayers(id) {
    try {
      const leagueData = await API.graphql(
        graphqlOperation(listTeamPlayers, {
          filter: {teamID: {eq: `${id}`}},
        }),
      );
      const todos = leagueData.data.listTeamPlayers.items;
      return todos;
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  function setFind(option) {
    setfindMistake(option);
    console.log('suuliin onoo', allPoint);
    setEndModalVisible(true);
  }
  const cancelBtnPress = () => {
    // setCancelPress(true);
    switch (findMistake) {
      case 1:
        setAllPoint(prev => ({
          ...prev,
          one: {
            point: allPoint.one.point - 1,
            name: `${OneName}`,
            image: `${OneImage}`,
          },
        }));
        break;
      case 2:
        setAllPoint(prev => ({
          ...prev,
          two: {
            point: allPoint.two.point - 1,
            name: `${TwoName}`,
            image: `${TwoImage}`,
          },
        }));
        break;
      case 3:
        setAllPoint(prev => ({
          ...prev,
          three: {
            point: allPoint.three.point - 1,
            name: `${ThreeName}`,
            image: `${ThreeImage}`,
          },
        }));
        break;
      case 4:
        setAllPoint(prev => ({
          ...prev,
          four: {
            point: allPoint.four.point - 1,
            name: `${FourName}`,
            image: `${FourImage}`,
          },
        }));
        break;
      default:
        toggleEndModal(false);
        break;
    }
  };
  const toggleCancelModal = bool => {
    setCancelModalVisible(bool);
    setEndModalVisible(bool);
  };
  const toggleEndModal = bool => {};
  const EndBtnPress = async () => {
    setLoading(true);
    await UpdateSchedule();
    const user = await Auth.currentUserInfo();
    findUser(user);
    toggleEndModal(false);
    setLoading(false);
    navigation.pop();
    //console.log('allpoint', allPoint);
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
    // Bagiin avsan onoog update hiine
    await _updateSchedule();
    if (allPoint.one.point + allPoint.two.point === 10) {
      //toglogch yalahad bagiin win-lose update
      _updateHome1();
      _updateAway1();
    } else {
      //toglogch yalagdahad bagiin win-lose update
      _updateHome2();
      _updateAway2();
    }

    //Toglogchdiin avsan onoog update
    updateProfile(Home[0].id, Home[0].player.id, allPoint.one.point);
    updateProfile(Home[1].id, Home[1].player.id, allPoint.two.point);
    updateProfile(Away[0].id, Away[0].player.id, allPoint.three.point);
    updateProfile(Away[1].id, Away[1].player.id, allPoint.four.point);

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
          0,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          3,
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
          0,
          MatchData.homeImage,
          MatchData.homePlayers,
          MatchData.awayImage,
          MatchData.awayPlayers,
          3,
          MatchData.gameID,
        );
      }
    }
  }

  async function _updateSchedule() {
    try {
      await API.graphql(
        graphqlOperation(updateSchedule, {
          input: {
            //Schedule id
            id: MatchData.id,
            homeScore: `${allPoint.one.point + allPoint.two.point}`,
            awayScore: `${allPoint.three.point + allPoint.four.point}`,
          },
        }),
      );
    } catch (err) {
      console.log('Error updating schedule', err);
    }
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
      const _team = _teamsTemp.data.listSchedules.items.sort(
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
        1,
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
        2,
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
      console.log(`Final1 ${homeWin1}-${awayWin1}`);
      console.log(`Final2 ${homeWin2}-${awayWin2}`);
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
          final1[0].date,
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
          final1[0].date,
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
          final1[0].date,
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
          final1[0].date,
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
          final1[0].date,
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
          final1[0].date,
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
          final1[0].home.id,
          final2[0].away.id,
          final1[0].date,
          final1[0].leagueID,
          0,
          0,
          final1[0].homeImage,
          final1[0].homePlayers,
          final2[0].awayImage,
          final2[0].awayPlayers,
          1,
          final1[0].gameID,
        );
        _addSchedule(
          final1[0].home.id,
          final2[0].away.id,
          final1[0].date,
          final1[0].leagueID,
          0,
          0,
          final1[0].homeImage,
          final1[0].homePlayers,
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

  async function updateProfile(id, playerid, point) {
    const teamPlayerData = await API.graphql(
      graphqlOperation(listTeamPlayers, {
        filter: {
          id: {eq: id},
        },
      }),
    );
    const score = teamPlayerData.data.listTeamPlayers.items[0].playerScore;

    await API.graphql(
      graphqlOperation(updateTeamPlayer, {
        input: {
          id: id,
          playerScore: `${score + point}`,
        },
      }),
    );

    const playerData = await API.graphql(
      graphqlOperation(listPlayers, {
        filter: {id: {eq: playerid}},
      }),
    );
    const xp = playerData.data.listPlayers.items[0].xp;
    const newxp = point * 8;

    API.graphql(
      graphqlOperation(updatePlayer, {
        input: {
          id: playerid,
          xp: `${xp + newxp}`,
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
  const cancelMatch = async () => {
    await setPlaying(MatchData.id, false);
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
          <View
            style={{
              width: wp(70),
              height: wp(40),
              backgroundColor: COLORS.background,
              borderColor: COLORS.brand,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
  // function BestOne() {

  const endMatch = () => {
    let response = '';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.backContainer}>
        <TouchableOpacity onPress={() => toggleCancelModal(true)}>
          <Image source={icons.backWhiteBtn} style={styles.backBtn} />
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar hidden />
      <View style={[styles.topContainer, {transform: [{rotate: '180deg'}]}]}>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>
            {allPoint.three.point + allPoint.four.point}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            width: wp(22),
            justifyContent: 'space-between',
            marginHorizontal: wp(39),
            marginTop: wp(12),
          }}>
          <TouchableOpacity
            onPress={() =>
              allPoint.three.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    three: {
                      point: allPoint.three.point - 1,
                      name: `${ThreeName}`,
                      image: `${ThreeImage}`,
                    },
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              allPoint.four.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    four: {
                      point: allPoint.four.point - 1,
                      name: `${FourName}`,
                      image: `${FourImage}`,
                    },
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.three.point + allPoint.four.point !== 9
              ? null
              : setFind(3);
            setAllPoint(prev => ({
              ...prev,
              three: {
                point: allPoint.three.point + 1,
                name: `${ThreeName}`,
                image: `${ThreeImage}`,
              },
            }));
          }}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              {allPoint.three.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={allPoint.three.image} style={[styles.image]} />
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginLeft: wp(2),
                }}>
                {allPoint.three.point}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.three.point + allPoint.four.point !== 9
              ? null
              : setFind(4);
            setAllPoint(prev => ({
              ...prev,
              four: {
                point: allPoint.four.point + 1,
                name: `${FourName}`,
                image: `${FourImage}`,
              },
            }));
          }}
          style={[styles.touch, {overflow: 'hidden'}]}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                alignSelf: 'flex-end',
                marginRight: wp(2),
              }}>
              {allPoint.four.name}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginRight: wp(2),
                }}>
                {allPoint.four.point}
              </Text>
              <Image
                source={allPoint.four.image}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.teamScoreContainer}>
          <Text style={styles.teamScore}>
            {allPoint.two.point + allPoint.one.point}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            width: wp(22),
            justifyContent: 'space-between',
            marginHorizontal: wp(39),
            marginTop: wp(12),
          }}>
          <TouchableOpacity
            onPress={() =>
              allPoint.one.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    one: {
                      point: allPoint.one.point - 1,
                      name: `${OneName}`,
                      image: `${OneImage}`,
                    },
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              allPoint.two.point !== 0
                ? setAllPoint(prev => ({
                    ...prev,
                    two: {
                      point: allPoint.two.point - 1,
                      name: `${TwoName}`,
                      image: `${TwoImage}`,
                    },
                  }))
                : null
            }>
            <Image
              source={icons.removeBtn}
              style={[styles.removeBtn, {alignSelf: 'flex-end'}]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            allPoint.one.point + allPoint.two.point !== 9 ? null : setFind(1);
            setAllPoint(prev => ({
              ...prev,
              one: {
                point: allPoint.one.point + 1,
                name: `${OneName}`,
                image: `${OneImage}`,
              },
            }));
          }}>
          <View style={[styles.avatarScore, {marginLeft: wp(2)}]}>
            <Text style={{color: COLORS.greyText, fontFamily: FONTS.brandFont}}>
              {allPoint.one.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image source={allPoint.one.image} style={[styles.image]} />
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginLeft: wp(2),
                }}>
                {allPoint.one.point}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            allPoint.one.point + allPoint.two.point !== 9 ? null : setFind(2);
            setAllPoint(prev => ({
              ...prev,
              two: {
                point: allPoint.two.point + 1,
                name: `${TwoName}`,
                image: `${TwoImage}`,
              },
            }));
          }}
          style={[styles.touch, {overflow: 'hidden'}]}>
          <View
            style={[
              {
                justifyContent: 'flex-end',
              },
              styles.avatarScore,
            ]}>
            <Text
              style={{
                color: COLORS.greyText,
                fontFamily: FONTS.brandFont,
                alignSelf: 'flex-end',
                marginRight: wp(2),
              }}>
              {allPoint.two.name}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              <Text
                style={{
                  color: COLORS.greyText,
                  fontFamily: FONTS.brandFont,
                  fontSize: RFPercentage(2.3),

                  marginTop: wp(4.5),
                  marginRight: wp(2),
                }}>
                {allPoint.two.point}
              </Text>
              <Image
                source={allPoint.two.image}
                style={[{marginRight: wp(2)}, styles.image]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {CancelModal()}
        {/* {BestOne()} */}
        {EndModalVisible && (
          <EndModal
            isVisible={EndModalVisible}
            onBackdropPress={() => setEndModalVisible(false)}
            navigateSchedule={endMatch}
            cancelbtn={cancelBtnPress}
            EndBtn={EndBtnPress}
            allData={allPoint}
            loading={loading}
          />
        )}
        <LoadingModal bool={initLoad} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // flexDirection: 'column',
    justifyContent: 'space-between',
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
  chooseType: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: wp(25),
  },
  chooseTypeText: {
    fontFamily: FONTS.brandFont,
    color: COLORS.white,
    fontSize: RFPercentage(2),
    textAlign: 'center',
  },
  touch: {
    flex: 1,
    width: wp(49),
    overflow: 'visible',
    backgroundColor: COLORS.count,
  },
  topContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: hp(50) - wp(1),
    overflow: 'visible',
  },
  backContainer: {
    position: 'absolute',
    left: wp(2),
    zIndex: 4,
    marginTop: hp(7),
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarScore: {
    flexDirection: 'column',
    marginTop: wp(2),
    width: wp(49),
  },
  personScore: {
    color: COLORS.greyText,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),

    marginTop: wp(2),
    marginLeft: wp(2),
  },
  image: {
    width: wp(9.6),
    height: wp(9.6),
    marginTop: wp(2),
  },
  teamScoreContainer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'visible',
    flexDirection: 'row',
    backgroundColor: COLORS.brand,
    width: wp(22),
    height: wp(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(39.1),
  },
  teamScore: {
    color: COLORS.white,
    fontFamily: FONTS.brandFont,
    fontSize: RFPercentage(2.3),
  },
  addBtn: {
    width: wp(49),
    height: hp(49),
    backgroundColor: COLORS.count,
  },
  removeBtn: {
    resizeMode: 'contain',
    width: wp(10),
    height: wp(10),
  },
  backBtn: {
    width: wp(9.6),
    height: wp(9.6),
    opacity: 0.5,
  },
});
