import { gql } from 'apollo-server';

export const schema = [
  gql`
    type Couple {
      id: ID!
      creator: User!
      other: User
    }
  `,
];

export const resolver = {
  Couple: {
    creator: ({ creatorId }, _, { userModel }) => userModel.getById(creatorId),
    other: ({ otherId }, _, { userModel }) => userModel.getById(otherId),
  },
};

const coupleOfUser = (userId, couples) =>
  couples.find(
    ({ creatorId, otherId }) => userId === creatorId || userId === otherId
  );

const isInCouple = (userId, couples) => coupleOfUser(userId, couples) != null;

export const model = (coupleRepository, userId) => ({
  myCouple: () => coupleOfUser(userId, coupleRepository.getCouples()),
  createCouple: () => {
    if (userId == null) {
      throw new Error('Has to be logged in');
    }

    const couples = coupleRepository.getCouples();

    if (isInCouple(userId, couples)) {
      throw new Error('May only be part of a single couple');
    }

    const couple = {
      id: Math.max(-1, ...couples.map(({ id }) => id)) + 1,
      creatorId: userId,
    };

    return coupleRepository.createCouple(couple);
  },
  joinCoupleOfUser: creatorId => {
    const couples = coupleRepository.getCouples();
    if (isInCouple(userId, couples)) {
      throw new Error('May only be part of a single couple');
    }

    const couple = coupleOfUser(creatorId, couples);
    if (couple == null) {
      throw new Error('No such couple');
    }

    if (couple.otherId != null) {
      throw new Error('Couple is full');
    }

    couple.otherId = userId;

    return coupleRepository.updateCouple(couple);
  },
});
