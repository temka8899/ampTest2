/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLeague = /* GraphQL */ `
  query GetLeague($id: ID!) {
    getLeague(id: $id) {
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
export const listLeagues = /* GraphQL */ `
  query ListLeagues(
    $filter: ModelLeagueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeagues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
`;
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
