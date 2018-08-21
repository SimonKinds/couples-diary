export const getNameOfUserFromQueryData = data =>
  (data && data.me && data.me.name) || '';

export const getNameOfPartnerFromQueryData = data => {
  if (!(data && data.myCouple)) {
    return '';
  }

  const nameOfCurrentUser = getNameOfUserFromQueryData(data);
  const {
    myCouple: { creator, other },
  } = data;

  if (nameOfCurrentUser.toLowerCase() !== creator.name.toLowerCase()) {
    return creator.name;
  }

  return (other && other.name) || '';
};
