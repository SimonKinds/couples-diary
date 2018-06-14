import { gql } from 'apollo-server';

export const schema = [
  gql`
    type Couple {
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

const coupleOfUser = (user, couples) =>
  couples.find(
    ({ creatorId, otherId }) => user.id === creatorId || user.id === otherId
  );

const isInCouple = (user, couples) => coupleOfUser(user, couples) != null;

export const model = (coupleRepository, user) => ({
  myCouple: () => coupleOfUser(user, coupleRepository.getCouples()),
  createCouple: () => {
    if (user == null) {
      throw new Error('Has to be logged in');
    }

    const couples = coupleRepository.getCouples();

    if (isInCouple(user, couples)) {
      throw new Error('May only be part of a single couple');
    }

    const couple = {
      id: Math.max(-1, ...couples.map(({ id }) => id)) + 1,
      creatorId: user.id,
    };

    return coupleRepository.createCouple(couple);
  },
  joinCoupleOfUser: creator => {
    const couples = coupleRepository.getCouples();
    if (isInCouple(user, couples)) {
      throw new Error('May only be part of a single couple');
    }

    const couple = coupleOfUser(creator, couples);
    if (couple == null) {
      throw new Error('No such couple');
    }

    if (couple.otherId != null) {
      throw new Error('Couple is full');
    }

    couple.otherId = user.id;

    return coupleRepository.updateCouple(couple);
  },
});
