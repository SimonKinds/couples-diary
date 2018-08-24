import { gql, AuthenticationError } from 'apollo-server-express';
import { generateId } from '../database';

export const schema = [
  gql`
    type Entry {
      id: ID!
      author: User!
      year: Int!
      month: Int!
      date: Int!
      content: String!
      createdAt: Date!
    }
  `,
];

export const resolver = {
  Entry: {
    author: (entry, _, { userModel }) => userModel.getById(entry.authorId),
  },
};

export const model = (entryRepository, userId) => ({
  setEntryForCouple: (entry, couple) => {
    if (userId === null) {
      throw new AuthenticationError();
    }

    if (couple === null) {
      throw new Error('Has to be in a couple');
    }

    return entryRepository
      .getEntriesForCoupleByDate(couple, entry.year, entry.month, entry.date)
      .then(
        entries => entries.find(({ authorId }) => authorId === userId) || null
      )
      .then(
        oldEntry =>
          oldEntry !== null
            ? entryRepository.updateEntry({ ...oldEntry, ...entry })
            : entryRepository.createEntry({
                ...entry,
                id: generateId(),
                authorId: userId,
                coupleId: couple.id,
                createdAt: new Date(),
              })
      );
  },
  getEntriesForCoupleByDate: (couple, year, month, date) => {
    if (couple == null) {
      return [];
    }

    return entryRepository.getEntriesForCoupleByDate(couple, year, month, date);
  },
});
