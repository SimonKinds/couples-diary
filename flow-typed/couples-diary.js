declare type CancelablePromise<T> = {
  promise: Promise<T>,
  cancel: () => void,
}

declare type SimpleDate = { year: number, month: number, date: number }
declare type CalendarDate = SimpleDate & { inMonth: boolean }

declare type SummarizedEntry = {
  year: number,
  month: number,
  date: number,
  inMonth: boolean,
  entryHim: boolean,
  entryHer: boolean,
}

declare type UserId = string;
declare type CoupleId = string;

declare type User = {
  id: UserId,
  username: string,
  name: string,
  color: string,
  couple: ?CoupleId,
}

declare type UserWithPassword = User & {
  password: string,
}

declare type Entry = {
  author: UserId,
  couple: CoupleId,
  date: SimpleDate,
  text: string,
  dateCreated: Date,
  dateRead: Date,
}


declare type Credentials = {
  username: string,
  password: string,
}

declare type ApiResponse = {
  status: number,
  body?: mixed,
}
