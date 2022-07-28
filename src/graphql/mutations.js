/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSharedApp = /* GraphQL */ `
  mutation CreateSharedApp(
    $input: CreateSharedAppInput!
    $condition: ModelSharedAppConditionInput
  ) {
    createSharedApp(input: $input, condition: $condition) {
      id
      clientId
      configuration
      createdAt
      updatedAt
    }
  }
`;
export const updateSharedApp = /* GraphQL */ `
  mutation UpdateSharedApp(
    $input: UpdateSharedAppInput!
    $condition: ModelSharedAppConditionInput
  ) {
    updateSharedApp(input: $input, condition: $condition) {
      id
      clientId
      configuration
      createdAt
      updatedAt
    }
  }
`;
export const deleteSharedApp = /* GraphQL */ `
  mutation DeleteSharedApp(
    $input: DeleteSharedAppInput!
    $condition: ModelSharedAppConditionInput
  ) {
    deleteSharedApp(input: $input, condition: $condition) {
      id
      clientId
      configuration
      createdAt
      updatedAt
    }
  }
`;
