import { gql, AuthenticationError } from 'apollo-server-express';
import { generateId } from '../database';

export const schema = [
  gql`
    type Couple {
      id: ID!
      me: User!
      partner: User
    }
  `,
];

export const resolver = {
  Couple: {
    me: ({ creatorId, otherId }, _, { userModel, userId }) =>
      userModel.getById(creatorId === userId ? creatorId : otherId),
    partner: ({ creatorId, otherId }, _, { userModel, userId }) =>
      userModel.getById(creatorId === userId ? otherId : creatorId),
  },
};

const coupleOfUser = (userId, couples) =>
  couples.find(
    ({ creatorId, otherId }) => userId === creatorId || userId === otherId
  ) || null;

const isInCouple = (userId, couples) => coupleOfUser(userId, couples) != null;

export const model = (coupleRepository, userId) => ({
  myCouple: () => {
    if (userId === null) {
      throw new AuthenticationError();
    }
    return coupleRepository
      .getCouples()
      .then(couples => coupleOfUser(userId, couples));
  },
  createCouple: () => {
    if (userId == null) {
      throw new AuthenticationError();
    }

    return coupleRepository.getCouples().then(couples => {
      if (isInCouple(userId, couples)) {
        throw new Error('May only be part of a single couple');
      }

      const couple = {
        id: generateId(),
        creatorId: userId,
      };

      return coupleRepository.createCouple(couple);
    });
  },
  joinCoupleOfUser: creatorId => {
    if (userId == null) {
      throw new AuthenticationError();
    }

    return coupleRepository.getCouples().then(couples => {
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
    });
  },
});
