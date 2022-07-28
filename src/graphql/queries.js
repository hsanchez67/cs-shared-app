/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSharedApp = /* GraphQL */ `
  query GetSharedApp($id: ID!) {
    getSharedApp(id: $id) {
      id
      clientId
      configuration
      createdAt
      updatedAt
    }
  }
`;
export const listSharedApps = /* GraphQL */ `
  query ListSharedApps(
    $filter: ModelSharedAppFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSharedApps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        configuration
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
