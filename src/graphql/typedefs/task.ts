import { gql } from "apollo-server-core";

export default gql`
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input taskInput {
    title: String!
    description: String!
    status: String
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(taskInput: taskInput): Task
    updateTask(id: ID!, taskInput: taskInput): Task
    deleteTask(id: ID!): Task
    checkTask(id: ID!): Task
    uncheckTask(id: ID!): Task
  }
`;
