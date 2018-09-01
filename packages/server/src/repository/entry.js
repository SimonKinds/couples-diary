import Sequelize, { Op } from 'sequelize';

const serialize = entry => ({
  ...entry,
  createdAt: entry.createdAt && entry.createdAt.getTime(),
});
const deserialize = entry => ({
  ...entry,
  createdAt: new Date(entry.createdAt),
});

export const createEntryRepository = sequelize => {
  const Entry = sequelize.define('entry', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    coupleId: {
      type: Sequelize.UUID,
    },
    authorId: {
      type: Sequelize.UUID,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    month: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
  });

  return Entry.sync().then(() => ({
    createEntry(entry) {
      return Entry.create(serialize(entry)).then(() => entry);
    },
    updateEntry(entry) {
      return Entry.update(serialize(entry), {
        where: { id: { [Op.eq]: entry.id } },
      }).then(() => entry);
    },
    getEntries() {
      return Entry.findAll().then(entries =>
        entries.map(entry => entry.get({ plain: true })).map(deserialize)
      );
    },
    deleteEntry(id) {
      return Entry.destroy({ where: { id: { [Op.eq]: id } } });
    },
    getEntriesForCoupleByDate(couple, year, month, date) {
      let whereClause = {
        coupleId: { [Op.eq]: couple.id },
        year: { [Op.eq]: year },
        month: { [Op.eq]: month },
      };
      if (date) {
        whereClause = { ...whereClause, date: { [Op.eq]: date } };
      }

      return Entry.findAll({ where: whereClause }).then(entries =>
        entries.map(entry => entry.get({ plain: true })).map(deserialize)
      );
    },
  }));
};
