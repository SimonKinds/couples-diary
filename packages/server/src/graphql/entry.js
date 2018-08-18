import { gql, AuthenticationError } from 'apollo-server-express';

export const schema = [
  gql`
    type Entry {
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

    const { createdAt } = entryRepository
      .getEntriesForCoupleByDate(couple, entry.year, entry.month, entry.date)
      .find(({ authorId }) => authorId === userId) || { createdAt: new Date() };

    return entryRepository.setEntry({
      ...entry,
      authorId: userId,
      coupleId: couple.id,
      createdAt,
    });
  },
  getEntriesForCoupleByDate: (couple, year, month, date) => {
    if (couple == null) {
      return [];
    }

    return entryRepository.getEntriesForCoupleByDate(couple, year, month, date);
  },
});
