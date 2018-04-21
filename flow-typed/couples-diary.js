declare type SimpleDate = { year: number, month: number, date: number };
declare type CalendarDate = SimpleDate & { inMonth: boolean };
