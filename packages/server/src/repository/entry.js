const entries = [];

export default class EntryRepository {
  constructor(user) {
    this.user = user;
  }

  setEntry = entry => {
    if (this.user == null) return null;

    entry.authorId = this.user.id;

    const index = entries.findIndex(
      ({ year, month, date, authorId }) =>
        year === entry.year &&
        month === entry.month &&
        date === entry.date &&
        authorId === entry.authorId
    );

    if (index !== -1) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }

    return entry;
  };

  getEntries = () => entries;
}
