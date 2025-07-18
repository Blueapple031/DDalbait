import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';

const httpLink = createHttpLink({
  uri: __DEV__ 
    ? 'http://localhost:3001/graphql' 
    : 'https://api.hoops-platform.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('authToken');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    
    // Handle 401 Unauthorized
    if (networkError.statusCode === 401) {
      // Clear token and redirect to login
      AsyncStorage.removeItem('authToken');
      // TODO: Navigate to login screen
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        matches: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        rankings: {
          merge(existing = [], incoming) {
            return incoming; // Replace existing rankings
          },
        },
      },
    },
  },
});

// Setup cache persistence
export const initializeApollo = async () => {
  await persistCache({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
    maxSize: 1048576 * 5, // 5MB
  });
};

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}); 