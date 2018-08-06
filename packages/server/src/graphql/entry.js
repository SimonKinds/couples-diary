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
    author: (entry, _, { userModel }) => userModel.getById(entry.authorId),
  },
};

export const model = (entryRepository, userId) => ({
  setEntry: entry => {
    if (userId == null) return null;

    entry.authorId = userId;

    return entryRepository.setEntry(entry);
  },

  getEntries: entryRepository.getEntries,
  getEntriesByDate: entryRepository.getEntriesByDate,
});
