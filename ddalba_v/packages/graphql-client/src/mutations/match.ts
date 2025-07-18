import { gql } from '@apollo/client';

export const CREATE_MATCH = gql`
  mutation CreateMatch($input: CreateMatchInput!) {
    createMatch(input: $input) {
      id
      title
      description
      scheduledAt
      location
      locationType
      type
      status
      maxPlayers
      rules
      createdAt
      host {
        id
        nickname
        avatarUrl
      }
    }
  }
`;

export const UPDATE_MATCH = gql`
  mutation UpdateMatch($input: UpdateMatchInput!) {
    updateMatch(input: $input) {
      id
      title
      description
      scheduledAt
      location
      locationType
      type
      status
      maxPlayers
      rules
      videoUrl
      thumbnailUrl
      updatedAt
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
  }
`;

export const DELETE_MATCH = gql`
  mutation DeleteMatch($id: ID!) {
    deleteMatch(id: $id)
  }
`;

export const ACCEPT_MATCH = gql`
  mutation AcceptMatch($input: MatchActionInput!) {
    acceptMatch(input: $input) {
      id
      title
      status
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
  }
`;

export const REJECT_MATCH = gql`
  mutation RejectMatch($input: MatchActionInput!) {
    rejectMatch(input: $input) {
      id
      title
      status
      host {
        id
        nickname
        avatarUrl
      }
    }
  }
`;

export const CANCEL_MATCH = gql`
  mutation CancelMatch($input: MatchActionInput!) {
    cancelMatch(input: $input) {
      id
      title
      status
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
  }
`;

export const START_MATCH = gql`
  mutation StartMatch($id: ID!) {
    startMatch(id: $id) {
      id
      title
      status
      scheduledAt
    }
  }
`;

export const COMPLETE_MATCH = gql`
  mutation CompleteMatch($id: ID!, $hostScore: Float, $opponentScore: Float) {
    completeMatch(id: $id, hostScore: $hostScore, opponentScore: $opponentScore) {
      id
      title
      status
      hostScore
      opponentScore
      completedAt
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
  }
`; 