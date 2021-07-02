/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLeague = /* GraphQL */ `
  subscription OnCreateLeague {
    onCreateLeague {
      minPlayer
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
      isPlayoff
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLeague = /* GraphQL */ `
  subscription OnUpdateLeague {
    onUpdateLeague {
      minPlayer
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
      isPlayoff
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLeague = /* GraphQL */ `
  subscription OnDeleteLeague {
    onDeleteLeague {
      minPlayer
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
      isPlayoff
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
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
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
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
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
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
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam {
    onCreateTeam {
      leagueStatus
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam {
    onUpdateTeam {
      leagueStatus
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam {
    onDeleteTeam {
      leagueStatus
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onCreateTeamPlayer = /* GraphQL */ `
  subscription OnCreateTeamPlayer {
    onCreateTeamPlayer {
      id
      team {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onUpdateTeamPlayer = /* GraphQL */ `
  subscription OnUpdateTeamPlayer {
    onUpdateTeamPlayer {
      id
      team {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onDeleteTeamPlayer = /* GraphQL */ `
  subscription OnDeleteTeamPlayer {
    onDeleteTeamPlayer {
      id
      team {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onCreateLeaguePlayer = /* GraphQL */ `
  subscription OnCreateLeaguePlayer {
    onCreateLeaguePlayer {
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onUpdateLeaguePlayer = /* GraphQL */ `
  subscription OnUpdateLeaguePlayer {
    onUpdateLeaguePlayer {
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onDeleteLeaguePlayer = /* GraphQL */ `
  subscription OnDeleteLeaguePlayer {
    onDeleteLeaguePlayer {
      id
      league {
        minPlayer
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
        isPlayoff
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
export const onCreateSchedule = /* GraphQL */ `
  subscription OnCreateSchedule {
    onCreateSchedule {
      id
      index
      playOffIndex
      finalsIndex
      leagueID
      gameID
      home {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onUpdateSchedule = /* GraphQL */ `
  subscription OnUpdateSchedule {
    onUpdateSchedule {
      id
      index
      playOffIndex
      finalsIndex
      leagueID
      gameID
      home {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onDeleteSchedule = /* GraphQL */ `
  subscription OnDeleteSchedule {
    onDeleteSchedule {
      id
      index
      playOffIndex
      finalsIndex
      leagueID
      gameID
      home {
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
        leagueStatus
        id
        league {
          minPlayer
          maxSchedule
          currentSchedule
          startedDate
          perDay
          id
          isStart
          startDate
          description
          isPlayoff
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
export const onCreateXP = /* GraphQL */ `
  subscription OnCreateXP {
    onCreateXP {
      id
      xp
      level
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateXP = /* GraphQL */ `
  subscription OnUpdateXP {
    onUpdateXP {
      id
      xp
      level
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteXP = /* GraphQL */ `
  subscription OnDeleteXP {
    onDeleteXP {
      id
      xp
      level
      game {
        id
        name
        image
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
