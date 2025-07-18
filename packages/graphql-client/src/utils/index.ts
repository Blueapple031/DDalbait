// Utility functions for GraphQL client

export const isGraphQLError = (error: any): boolean => {
  return error?.networkError || error?.graphQLErrors?.length > 0;
};

export const getErrorMessage = (error: any): string => {
  if (error?.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }
  if (error?.networkError) {
    return error.networkError.message || 'Network error occurred';
  }
  return error?.message || 'An unknown error occurred';
}; 