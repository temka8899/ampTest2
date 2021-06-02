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
