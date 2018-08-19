class EntryRepository {
  entries = [];

  setEntry = entry => {
    const index = this.entries.findIndex(
      ({ year, month, date, authorId }) =>
        year === entry.year &&
        month === entry.month &&
        date === entry.date &&
        authorId === entry.authorId
    );

    if (index !== -1) {
      this.entries[index] = entry;
    } else {
      this.entries.push(entry);
    }

    return Promise.resolve(entry);
  };

  getEntries = () => Promise.resolve(this.entries);

  getEntriesForCoupleByDate = (couple, year, month, date) =>
    Promise.resolve(
      this.entries.filter(
        entry =>
          entry.coupleId === couple.id &&
          entry.year === year &&
          entry.month === month &&
          (date == null || date === entry.date)
      )
    );
}

export const createEntryRepository = () => new EntryRepository();
