export const getLeagueFromApi = React.useCallback(async () => {
  //checkInLeague
  try {
    const checkInLeague = await API.graphql(
      graphqlOperation(listLeaguePlayers, {
        filter: {
          playerID: {eq: PlayerID},
        },
      }),
    );
    const leagueInfo = checkInLeague.data.listLeaguePlayers.items;
    if (leagueInfo.length > 0) {
      setInLeague(true);
    } else {
      setInLeague(false);
    }
    console.log('leagueInfo ->', leagueInfo);
  } catch (err) {
    console.log('error fetching todos', err);
  }
  setLoading(false);
  //LeaguePlayers
  try {
    const leaguePlayerData = await API.graphql(
      graphqlOperation(listLeaguePlayers, {
        filter: {
          leagueID: {eq: LeagueId},
        },
      }),
    );
    const playerData = await leaguePlayerData.data.listLeaguePlayers.items;
    console.log('League players ->', playerData);
    setLeaguePlayers(playerData);
  } catch (err) {
    console.log('error fetching todos', err);
  }
  //fetchLeague
  try {
    const fetchLeague = await API.graphql(
      graphqlOperation(listLeaguePlayers, {
        filter: {
          leagueID: {eq: LeagueId},
        },
      }),
    );
    const fetch = fetchLeague.data.listLeaguePlayers.items;
    console.log('Fetch league -->', fetch);
  } catch (err) {
    console.log('error fetching todos', err);
  }
  //getPlayerID
  try {
    const playerData = await API.graphql(
      graphqlOperation(listPlayers, {
        filter: {c_id: {eq: userInfo.c_id}},
      }),
    );
    setPlayerID(playerData.data.listPlayers.items[0].id);
    console.log('Player ID', playerData.data.listPlayers.items[0].id);
  } catch (err) {
    console.log('error fetching todos', err);
  }
}, [LeagueId, PlayerID, userInfo.c_id]);
