import { gql } from '@apollo/client';

export const GET_MATCHES = gql`
  query GetMatches($filter: MatchFilterInput) {
    matches(filter: $filter) {
      matches {
        id
        title
        description
        scheduledAt
        location
        locationType
        latitude
        longitude
        type
        status
        maxPlayers
        rules
        videoUrl
        thumbnailUrl
        hostScore
        opponentScore
        createdAt
        updatedAt
        completedAt
        host {
          id
          nickname
          email
          avatarUrl
        }
        opponent {
          id
          nickname
          email
          avatarUrl
        }
      }
      pagination {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_MATCH = gql`
  query GetMatch($id: ID!) {
    match(id: $id) {
      id
      title
      description
      scheduledAt
      location
      locationType
      latitude
      longitude
      type
      status
      maxPlayers
      rules
      videoUrl
      thumbnailUrl
      hostScore
      opponentScore
      participants
      gameStats
      createdAt
      updatedAt
      completedAt
      host {
        id
        nickname
        email
        avatarUrl
        role
      }
      opponent {
        id
        nickname
        email
        avatarUrl
        role
      }
    }
  }
`;

export const GET_MY_MATCHES = gql`
  query GetMyMatches($filter: MatchFilterInput) {
    myMatches(filter: $filter) {
      matches {
        id
        title
        description
        scheduledAt
        location
        locationType
        type
        status
        maxPlayers
        hostScore
        opponentScore
        createdAt
        host {
          id
          nickname
          avatarUrl
        }
        opponent {
          id
          nickname
          avatarUrl
        }
      }
      pagination {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_MATCH_LOGS = gql`
  query GetMatchLogs($matchId: ID!) {
    matchLogs(matchId: $matchId) {
      id
      action
      previousStatus
      newStatus
      reason
      metadata
      createdAt
      user {
        id
        nickname
        avatarUrl
      }
    }
  }
`; 