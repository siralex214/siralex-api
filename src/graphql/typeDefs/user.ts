import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    streamKey: String!
    createdAt: String!
    updatedAt: String!
    deactivatedAt: Boolean!
  }

  type Login {
    user: User!
    token: String!
  }

  input userInputRegister {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input userInputLogin {
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    register(userInput: userInputRegister): User
    login(userInput: userInputLogin): Login
  }
`;
