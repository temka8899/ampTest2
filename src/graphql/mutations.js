/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLeague = /* GraphQL */ `
  mutation CreateLeague(
    $input: CreateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    createLeague(input: $input, condition: $condition) {
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
export const updateLeague = /* GraphQL */ `
  mutation UpdateLeague(
    $input: UpdateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    updateLeague(input: $input, condition: $condition) {
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
export const deleteLeague = /* GraphQL */ `
  mutation DeleteLeague(
    $input: DeleteLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    deleteLeague(input: $input, condition: $condition) {
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
export const createLeaguePlayer = /* GraphQL */ `
  mutation CreateLeaguePlayer(
    $input: CreateLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    createLeaguePlayer(input: $input, condition: $condition) {
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
export const updateLeaguePlayer = /* GraphQL */ `
  mutation UpdateLeaguePlayer(
    $input: UpdateLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    updateLeaguePlayer(input: $input, condition: $condition) {
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
export const deleteLeaguePlayer = /* GraphQL */ `
  mutation DeleteLeaguePlayer(
    $input: DeleteLeaguePlayerInput!
    $condition: ModelLeaguePlayerConditionInput
  ) {
    deleteLeaguePlayer(input: $input, condition: $condition) {
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
