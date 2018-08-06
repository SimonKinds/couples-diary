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

    return entry;
  };

  getEntries = () => this.entries;

  getEntriesByDate = (year, month, date) =>
    this.entries.filter(
      entry =>
        entry.year === year &&
        entry.month === month &&
        (date == null || date === entry.date)
    );
}

export const createEntryRepository = () => new EntryRepository();
