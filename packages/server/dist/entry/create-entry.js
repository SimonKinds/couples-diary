'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEntry;
function createEntry(user, body, entries) {
  const entry = parse(body);

  if (entry == null) {
    return {
      status: 400,
      body: { reason: 'Invalid request body' }
    };
  }

  if (!user) {
    return {
      status: 403,
      body: { reason: 'Not logged in' }
    };
  }

  if (user.id !== entry.author) {
    return {
      status: 403,
      body: { reason: 'You may not create entries for others' }
    };
  }

  if (user.couple !== entry.couple) {
    return {
      status: 403,
      body: { reason: 'You may not create entries for other couples' }
    };
  }

  entries.push(entry);
  return { status: 200, body: entry };
}

function parse(body) {
  if (body != null && typeof body === 'object' && body.author != null && typeof body.author === 'string' && body.couple != null && typeof body.couple === 'string' && isSimpleDate(body.date) && body.text != null && typeof body.text === 'string' && body.dateCreated != null && body.dateCreated instanceof Date && body.dateRead != null && body.dateRead instanceof Date) {
    const {
      author, couple, date, text, dateCreated, dateRead
    } = body;

    return {
      author,
      couple,
      // $FlowFixMe: It really is checked
      date,
      text,
      dateCreated,
      dateRead
    };
  }

  return null;
}

function isSimpleDate(date) {
  return date != null && typeof date === 'object' && date.year != null && typeof date.year === 'number' && date.month != null && typeof date.month === 'number' && date.date != null && typeof date.date === 'number';
}