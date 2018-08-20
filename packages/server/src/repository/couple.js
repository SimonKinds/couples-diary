import Sequelize from 'sequelize';

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
