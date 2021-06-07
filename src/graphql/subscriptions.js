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
      id
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
export const onUpdateLeague = /* GraphQL */ `
  subscription OnUpdateLeague {
    onUpdateLeague {
      id
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
export const onDeleteLeague = /* GraphQL */ `
  subscription OnDeleteLeague {
    onDeleteLeague {
      id
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
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
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
      id
      league {
        id
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
      id
      league {
        id
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
      id
      league {
        id
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
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      player {
        id
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
export const onUpdateTeamPlayer = /* GraphQL */ `
  subscription OnUpdateTeamPlayer {
    onUpdateTeamPlayer {
      id
      team {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      player {
        id
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
export const onDeleteTeamPlayer = /* GraphQL */ `
  subscription OnDeleteTeamPlayer {
    onDeleteTeamPlayer {
      id
      team {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      player {
        id
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
export const onCreateLeaguePlayer = /* GraphQL */ `
  subscription OnCreateLeaguePlayer {
    onCreateLeaguePlayer {
      id
      league_id {
        id
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
      player {
        id
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
export const onUpdateLeaguePlayer = /* GraphQL */ `
  subscription OnUpdateLeaguePlayer {
    onUpdateLeaguePlayer {
      id
      league_id {
        id
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
      player {
        id
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
export const onDeleteLeaguePlayer = /* GraphQL */ `
  subscription OnDeleteLeaguePlayer {
    onDeleteLeaguePlayer {
      id
      league_id {
        id
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
      player {
        id
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
export const onCreateSchedule = /* GraphQL */ `
  subscription OnCreateSchedule {
    onCreateSchedule {
      id
      home {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
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
      home {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
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
      home {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      away {
        id
        league {
          id
          startDate
          description
          createdAt
          updatedAt
        }
        name
        win
        lose
        createdAt
        updatedAt
      }
      date
      createdAt
      updatedAt
    }
  }
`;
