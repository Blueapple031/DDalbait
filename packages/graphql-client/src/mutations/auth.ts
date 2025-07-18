import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($input: RegisterDto!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        nickname
        role
        avatarUrl
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginDto!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        nickname
        role
        avatarUrl
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`; 