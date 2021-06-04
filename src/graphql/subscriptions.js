/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      teamPlayer {
        id
        teamId {
          id
          name
          createdAt
          updatedAt
        }
        playerId {
          id
          name
          level
          xp
          createdAt
          updatedAt
        }
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
      teamPlayer {
        id
        teamId {
          id
          name
          createdAt
          updatedAt
        }
        playerId {
          id
          name
          level
          xp
          createdAt
          updatedAt
        }
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
      teamPlayer {
        id
        teamId {
          id
          name
          createdAt
          updatedAt
        }
        playerId {
          id
          name
          level
          xp
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
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
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam {
    onUpdateTeam {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam {
    onDeleteTeam {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTeamPlayer = /* GraphQL */ `
  subscription OnCreateTeamPlayer {
    onCreateTeamPlayer {
      id
      teamId {
        id
        name
        createdAt
        updatedAt
      }
      playerId {
        id
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
      teamId {
        id
        name
        createdAt
        updatedAt
      }
      playerId {
        id
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
      teamId {
        id
        name
        createdAt
        updatedAt
      }
      playerId {
        id
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
