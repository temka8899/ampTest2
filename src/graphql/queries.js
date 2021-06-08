/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      description
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
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getTeamPlayer = /* GraphQL */ `
  query GetTeamPlayer($id: ID!) {
    getTeamPlayer(id: $id) {
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
export const listTeamPlayers = /* GraphQL */ `
  query ListTeamPlayers(
    $filter: ModelTeamPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        team {
          id
          name
          win
          lose
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
      nextToken
    }
  }
`;
export const getLeaguePlayer = /* GraphQL */ `
  query GetLeaguePlayer($id: ID!) {
    getLeaguePlayer(id: $id) {
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
export const listLeaguePlayers = /* GraphQL */ `
  query ListLeaguePlayers(
    $filter: ModelLeaguePlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeaguePlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        league {
          id
          startDate
          description
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
      nextToken
    }
  }
`;
export const getSchedule = /* GraphQL */ `
  query GetSchedule($id: ID!) {
    getSchedule(id: $id) {
      id
      home {
        id
        team {
          id
          name
          win
          lose
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
      away {
        id
        team {
          id
          name
          win
          lose
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
      date
      createdAt
      updatedAt
    }
  }
`;
export const listSchedules = /* GraphQL */ `
  query ListSchedules(
    $filter: ModelScheduleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        home {
          id
          createdAt
          updatedAt
        }
        away {
          id
          createdAt
          updatedAt
        }
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
