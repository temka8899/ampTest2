/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const createLeague = /* GraphQL */ `
  mutation CreateLeague(
    $input: CreateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    createLeague(input: $input, condition: $condition) {
      maxSchedule
      currentSchedule
      startedDate
      perDay
      id
      isStart
      startDate
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateLeague = /* GraphQL */ `
  mutation UpdateLeague(
    $input: UpdateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    updateLeague(input: $input, condition: $condition) {
      maxSchedule
      currentSchedule
      startedDate
      perDay
      id
      isStart
      startDate
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteLeague = /* GraphQL */ `
  mutation DeleteLeague(
    $input: DeleteLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    deleteLeague(input: $input, condition: $condition) {
      maxSchedule
      currentSchedule
      startedDate
      perDay
      id
      isStart
      startDate
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
      description
      createdAt
      updatedAt
    }
  }
`;
export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
      id
      avatar
      admin
      c_id
      name
      level
      xp
      createdAt
      updatedAt
    }
  }
`;
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
      id
      avatar
      admin
      c_id
      name
      level
      xp
      createdAt
      updatedAt
    }
  }
`;
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
      id
      avatar
      admin
      c_id
      name
      level
      xp
      createdAt
      updatedAt
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      name
      win
      lose
      createdAt
      updatedAt
    }
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      name
      win
      lose
      createdAt
      updatedAt
    }
  }
`;
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      name
      win
      lose
      createdAt
      updatedAt
    }
  }
`;
export const createTeamPlayer = /* GraphQL */ `
  mutation CreateTeamPlayer(
    $input: CreateTeamPlayerInput!
    $condition: ModelTeamPlayerConditionInput
  ) {
    createTeamPlayer(input: $input, condition: $condition) {
      id
      team {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      teamID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      playerScore
      createdAt
      updatedAt
    }
  }
`;
export const updateTeamPlayer = /* GraphQL */ `
  mutation UpdateTeamPlayer(
    $input: UpdateTeamPlayerInput!
    $condition: ModelTeamPlayerConditionInput
  ) {
    updateTeamPlayer(input: $input, condition: $condition) {
      id
      team {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      teamID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      playerScore
      createdAt
      updatedAt
    }
  }
`;
export const deleteTeamPlayer = /* GraphQL */ `
  mutation DeleteTeamPlayer(
    $input: DeleteTeamPlayerInput!
    $condition: ModelTeamPlayerConditionInput
  ) {
    deleteTeamPlayer(input: $input, condition: $condition) {
      id
      team {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      teamID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      playerScore
      createdAt
      updatedAt
    }
  }
`;
export const createLeaguePlayer = /* GraphQL */ `
  mutation CreateLeaguePlayer(
    $input: CreateLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    createLeaguePlayer(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      createdAt
      updatedAt
    }
  }
`;
export const updateLeaguePlayer = /* GraphQL */ `
  mutation UpdateLeaguePlayer(
    $input: UpdateLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    updateLeaguePlayer(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      createdAt
      updatedAt
    }
  }
`;
export const deleteLeaguePlayer = /* GraphQL */ `
  mutation DeleteLeaguePlayer(
    $input: DeleteLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    deleteLeaguePlayer(input: $input, condition: $condition) {
      id
      league {
        maxSchedule
        currentSchedule
        startedDate
        perDay
        id
        isStart
        startDate
        game {
          id
          name
          image
          createdAt
          updatedAt
        }
        description
        createdAt
        updatedAt
      }
      leagueID
      player {
        id
        avatar
        admin
        c_id
        name
        level
        xp
        createdAt
        updatedAt
      }
      playerID
      createdAt
      updatedAt
    }
  }
`;
export const createSchedule = /* GraphQL */ `
  mutation CreateSchedule(
    $input: CreateScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    createSchedule(input: $input, condition: $condition) {
      id
      index
      playOffIndex
      leagueID
      home {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      homeImage
      awayImage
      homePlayers
      awayPlayers
      homeScore
      awayScore
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateSchedule = /* GraphQL */ `
  mutation UpdateSchedule(
    $input: UpdateScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    updateSchedule(input: $input, condition: $condition) {
      id
      index
      playOffIndex
      leagueID
      home {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      homeImage
      awayImage
      homePlayers
      awayPlayers
      homeScore
      awayScore
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteSchedule = /* GraphQL */ `
  mutation DeleteSchedule(
    $input: DeleteScheduleInput!
    $condition: ModelScheduleConditionInput
  ) {
    deleteSchedule(input: $input, condition: $condition) {
      id
      index
      playOffIndex
      leagueID
      home {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          createdAt
          updatedAt
        }
        leagueID
        name
        win
        lose
        createdAt
        updatedAt
      }
      homeImage
      awayImage
      homePlayers
      awayPlayers
      homeScore
      awayScore
      date
      createdAt
      updatedAt
    }
  }
`;
