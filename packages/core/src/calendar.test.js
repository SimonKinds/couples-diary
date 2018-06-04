// @flow

import { datesOfMonth, calendarMonth } from './calendar';


describe('calendar', () => {
  describe('datesOfMonth', () => {
    test('months are 1-indexed', () => {
      expect(datesOfMonth(2018, 1)).toHaveLength(31);
      expect(datesOfMonth(2018, 2)).toHaveLength(28);
      expect(datesOfMonth(2018, 3)).toHaveLength(31);
      expect(datesOfMonth(2018, 4)).toHaveLength(30);
      expect(datesOfMonth(2018, 12)).toHaveLength(31);
    });

    test('handles leap year', () => {
      expect(datesOfMonth(2016, 2)).toHaveLength(29);
      expect(datesOfMonth(2018, 2)).toHaveLength(28);
      expect(datesOfMonth(2020, 2)).toHaveLength(29);
    });

    test('is sorted by dates', () => {
      const year = 2018;
      const month = 1;
      const [first, second] = datesOfMonth(year, month);
      expect(first.date).toBeLessThan(second.date);
    });

    test('days are 1-indexed', () => {
      const year = 2018;
      const month = 1;
      expect(datesOfMonth(year, month)[0]).toEqual({ year, month, date: 1 });
    });
  });

  describe('calendarMonth', () => {
    test(
      'only contains dates of month if ' +
        'starting on monday and ending on sunday',
      () => {
        expect(calendarMonth(2010, 2)).toHaveLength(28);
      },
    );

    test('fills values from previous month if necessary', () => {
      // January 2010 starts on Friday the 1st and ends on Sunday the 31st
      expect(calendarMonth(2010, 1)).toHaveLength(35);
      expect(calendarMonth(2010, 1)[3]).toMatchObject({
        year: 2009,
        month: 12,
        date: 31,
      });
    });

    test('fills values from next month if necessary', () => {
      // January 2018 starts on Monday the 1st and ends on Wednesday the 31st
      expect(calendarMonth(2018, 1)).toHaveLength(35);
      expect(calendarMonth(2018, 1)[31]).toMatchObject({
        year: 2018,
        month: 2,
        date: 1,
      });
    });

    test('fills values from both prev and next month', () => {
      // April 2018 starts on Sunday the 1st and ends on Monday the 30th
      expect(calendarMonth(2018, 4)).toHaveLength(42);
      expect(calendarMonth(2018, 4)[0]).toMatchObject({
        year: 2018,
        month: 3,
        date: 26,
      });
      expect(calendarMonth(2018, 4)[41]).toMatchObject({
        year: 2018,
        month: 5,
        date: 6,
      });
    });
  });
});
