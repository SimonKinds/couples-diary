import { gql } from 'apollo-server';

export const schema = [
  gql`
    type Entry {
      author: User!
      year: Int!
      month: Int!
      date: Int!
      content: String!
    }
  `,
];

export const resolver = {
  Entry: {
    author: (entry, _, { userRepo }) => userRepo.getById(entry.authorId),
  },
};
