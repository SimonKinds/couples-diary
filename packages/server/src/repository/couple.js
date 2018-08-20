import Sequelize from 'sequelize';

class CoupleRepository {
  couples = [];

  createCouple = couple => {
    this.couples.push(couple);
    return Promise.resolve(couple);
  };
  getCouples = () => Promise.resolve(this.couples);
  updateCouple = couple => {
    const index = this.couples.findIndex(({ id }) => couple.id === id);

    if (index === -1) {
      return Promise.resolve(null);
    }

    this.couples[index] = couple;
    return Promise.resolve(couple);
  };
}

export const createCoupleRepository = sequelize => {
  const Couple = sequelize.define('couple', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    creatorId: {
      type: Sequelize.UUID,
    },
    otherId: {
      type: Sequelize.UUID,
    },
  });

  return Couple.sync().then(() => ({
    createCouple(couple) {
      return Couple.create(couple).then(couple => couple.get({ plain: true }));
    },
    getCouples() {
      return Couple.findAll().then(couples =>
        couples.map(couple => couple.get({ plain: true }))
      );
    },
    updateCouple(couple) {
      return Couple.update(couple, { where: { id: couple.id } }).then(
        () => couple
      );
    },
  }));
};
