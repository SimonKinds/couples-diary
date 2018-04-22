declare type SimpleDate = { year: number, month: number, date: number };
declare type CalendarDate = SimpleDate & { inMonth: boolean };

declare type SummarizedEntry = {
  year: number,
  month: number,
  date: number,
  inMonth: boolean,
  entryHim: boolean,
  entryHer: boolean,
};
