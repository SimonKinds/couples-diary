// @flow

let emails: Array<string> = [];

const isValidEmail = (email: string): bool =>{
  // http://emailregex.com/
  return -1 !== email.search(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export default (email: string) => {
  if (isValidEmail(email) && emails.indexOf(email) < 0) {
    emails.push(email);
    return true;
  }
  return false;
};
