import createEntry from './create-entry';

import { user } from '../../../test/utils';

describe('create entry route', () => {
  test('success', () => {
    expect(createEntry(user(), entry(), [])).toEqual({
      status: 200,
      body: entry(),
    });
  });

  test('user is null', () => {
    expect(createEntry(null, entry(), [])).toEqual({
      status: 403,
      body: { reason: 'Not logged in' },
    });
  });

  test('user id does not match author', () => {
    expect(
      createEntry(user(), { ...entry(), author: 'another-user-id' }, [])
    ).toEqual({
      status: 403,
      body: { reason: 'You may not create entries for others' },
    });
  });

  test('user is not part of couple', () => {
    expect(
      createEntry(user(), { ...entry(), couple: 'another-couple-id' }, [])
    ).toEqual({
      status: 403,
      body: { reason: 'You may not create entries for other couples' },
    });
  });

  describe('parse', () => {
    test('author is required', () => {
      const body = entry();
      delete body.author;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });
    test('couple is required', () => {
      const body = entry();
      delete body.couple;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });
    test('date is required', () => {
      const body = entry();
      delete body.date;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });
    test('text is required', () => {
      const body = entry();
      delete body.text;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });

    test('dateCreated is required', () => {
      const body = entry();
      delete body.dateCreated;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });

    test('dateRead is required', () => {
      const body = entry();
      delete body.dateRead;

      expect(createEntry(user(), body, [])).toEqual({
        status: 400,
        body: { reason: 'Invalid request body' },
      });
    });
  });
});

function entry() {
  return {
    author: user().id,
    couple: user().couple,
    date: { year: 2018, month: 12, date: 27 },
    text: 'This is my entry text',
    dateCreated: new Date(2018, 5, 28, 10, 0, 0, 0),
    dateRead: new Date(2018, 5, 28, 11, 0, 0, 0),
  };
}
