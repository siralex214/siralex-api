import { gql } from "apollo-server-core";

export default gql`
  type Query {
    hello: String
  }
  type Mutation {
    hello: String
  }
`;
