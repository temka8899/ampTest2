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
        createdAt
        updatedAt
      }
      user_id
      user_name
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
        createdAt
        updatedAt
      }
      user_id
      user_name
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
        createdAt
        updatedAt
      }
      user_id
      user_name
      createdAt
      updatedAt
    }
  }
`;
