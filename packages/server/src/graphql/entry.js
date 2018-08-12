import { gql, AuthenticationError } from 'apollo-server';

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
    author: (entry, _, { userModel }) => userModel.getById(entry.authorId),
  },
};

export const model = (entryRepository, userId) => ({
  setEntry: entry => {
    if (userId == null) {
      throw new AuthenticationError();
    }

    entry.authorId = userId;

    return entryRepository.setEntry(entry);
  },
  getEntriesForCoupleByDate: (couple, year, month, date) => {
    if (couple == null) {
      return [];
    }

    return entryRepository.getEntriesForCoupleByDate(couple, year, month, date);
  },
});
